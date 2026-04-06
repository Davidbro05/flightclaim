const express = require('express');
const db = require('../db');
const logger = require('../logger');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Build nested tree from flat rows
function buildTree(rows) {
  const map = {};
  const roots = [];
  for (const row of rows) {
    map[row.id] = { ...row, children: [] };
  }
  for (const row of rows) {
    if (row.parent_id && map[row.parent_id]) {
      map[row.parent_id].children.push(map[row.id]);
    } else {
      roots.push(map[row.id]);
    }
  }
  return roots;
}

// GET /api/nav  — public, returns nested tree
router.get('/', async (req, res) => {
  try {
    const rows = await db('nav_items').orderBy('sort_order', 'asc');
    res.json({ nav: buildTree(rows) });
  } catch (err) {
    logger.error({ err }, 'Nav API: list failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// All write routes require authentication
router.use(authenticate);

// GET /api/nav/flat  — admin, flat list for management UI
router.get('/flat', async (req, res) => {
  try {
    const items = await db('nav_items').orderBy('sort_order', 'asc');
    res.json({ items });
  } catch (err) {
    logger.error({ err }, 'Nav API: flat list failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// POST /api/nav
router.post('/', async (req, res) => {
  const { label, url, parent_id, sort_order } = req.body;
  if (!label?.trim()) return res.status(400).json({ error: 'label krävs' });
  if (!url?.trim())   return res.status(400).json({ error: 'url krävs' });

  try {
    const [id] = await db('nav_items').insert({
      label: label.trim(),
      url: url.trim(),
      parent_id: parent_id || null,
      sort_order: sort_order ?? 0,
    });
    const item = await db('nav_items').where({ id }).first();
    res.status(201).json({ item });
  } catch (err) {
    logger.error({ err }, 'Nav API: create failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// PUT /api/nav/:id
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Ogiltigt ID' });

  const { label, url, parent_id, sort_order } = req.body;
  if (!label?.trim()) return res.status(400).json({ error: 'label krävs' });
  if (!url?.trim())   return res.status(400).json({ error: 'url krävs' });

  // Guard against circular references
  if (parent_id && parent_id === id) {
    return res.status(400).json({ error: 'En nav-item kan inte vara sin egen förälder' });
  }

  try {
    const updated = await db('nav_items').where({ id }).update({
      label: label.trim(),
      url: url.trim(),
      parent_id: parent_id || null,
      sort_order: sort_order ?? 0,
    });
    if (updated === 0) return res.status(404).json({ error: 'Nav-item hittades inte' });
    const item = await db('nav_items').where({ id }).first();
    res.json({ item });
  } catch (err) {
    logger.error({ err }, 'Nav API: update failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// DELETE /api/nav/:id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Ogiltigt ID' });

  try {
    const deleted = await db('nav_items').where({ id }).delete();
    if (deleted === 0) return res.status(404).json({ error: 'Nav-item hittades inte' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Nav API: delete failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

module.exports = router;
