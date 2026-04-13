import express from 'express';
import db from '../db';
import logger from '../logger';
import authenticate from '../middleware/auth';
import type { NavItem } from '../types';

const router = express.Router();

function buildTree(rows: NavItem[]): NavItem[] {
  const map: Record<number, NavItem> = {};
  const roots: NavItem[] = [];
  for (const row of rows) {
    map[row.id] = { ...row, children: [] };
  }
  for (const row of rows) {
    if (row.parent_id != null && map[row.parent_id]) {
      map[row.parent_id].children!.push(map[row.id]);
    } else {
      roots.push(map[row.id]);
    }
  }
  return roots;
}

router.get('/', async (_req, res) => {
  try {
    const rows = await db('nav_items').orderBy('sort_order', 'asc').select<NavItem[]>();
    res.json({ nav: buildTree(rows) });
  } catch (err) {
    logger.error({ err }, 'Nav API: list failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.use(authenticate);

router.get('/flat', async (_req, res) => {
  try {
    const items = await db('nav_items').orderBy('sort_order', 'asc').select<NavItem[]>();
    res.json({ items });
  } catch (err) {
    logger.error({ err }, 'Nav API: flat list failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.post('/', async (req, res) => {
  const { label, url, parent_id, sort_order } = req.body as Partial<NavItem>;
  if (!label?.trim()) { res.status(400).json({ error: 'label krävs' }); return; }
  if (!url?.trim())   { res.status(400).json({ error: 'url krävs' }); return; }

  try {
    const [id] = await db('nav_items').insert({
      label: label.trim(),
      url: url.trim(),
      parent_id: parent_id ?? null,
      sort_order: sort_order ?? 0,
    });
    const item = await db('nav_items').where({ id }).first<NavItem>();
    res.status(201).json({ item });
  } catch (err) {
    logger.error({ err }, 'Nav API: create failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.put('/:id', async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (!id || isNaN(id)) { res.status(400).json({ error: 'Ogiltigt ID' }); return; }

  const { label, url, parent_id, sort_order } = req.body as Partial<NavItem>;
  if (!label?.trim()) { res.status(400).json({ error: 'label krävs' }); return; }
  if (!url?.trim())   { res.status(400).json({ error: 'url krävs' }); return; }

  if (parent_id != null && parent_id === id) {
    res.status(400).json({ error: 'En nav-item kan inte vara sin egen förälder' });
    return;
  }

  try {
    const updated = await db('nav_items').where({ id }).update({
      label: label.trim(),
      url: url.trim(),
      parent_id: parent_id ?? null,
      sort_order: sort_order ?? 0,
    });
    if (updated === 0) { res.status(404).json({ error: 'Nav-item hittades inte' }); return; }
    const item = await db('nav_items').where({ id }).first<NavItem>();
    res.json({ item });
  } catch (err) {
    logger.error({ err }, 'Nav API: update failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (!id || isNaN(id)) { res.status(400).json({ error: 'Ogiltigt ID' }); return; }

  try {
    const deleted = await db('nav_items').where({ id }).delete();
    if (deleted === 0) { res.status(404).json({ error: 'Nav-item hittades inte' }); return; }
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Nav API: delete failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

export default router;
