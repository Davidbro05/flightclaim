const express = require('express');
const db = require('../db');
const logger = require('../logger');
const authenticate = require('../middleware/auth');

const router = express.Router();

const ISSUE_MAP = { delay: 'Försening', cancelled: 'Inställt', denied: 'Nekad ombordstigning' };

// GET /api/admin/claims
router.get('/claims', authenticate, async (req, res) => {
  try {
    const claims = await db('claims').orderBy('created_at', 'desc');
    res.json({ claims: claims.map((c) => ({ ...c, issueLabel: ISSUE_MAP[c.issue] || c.issue })) });
  } catch (err) {
    logger.error({ err }, 'Admin API: fetch claims failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// DELETE /api/admin/claims/:id
router.delete('/claims/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Ogiltigt ID' });

  try {
    const deleted = await db('claims').where({ id }).delete();
    if (deleted === 0) return res.status(404).json({ error: 'Ärende hittades inte' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err, id }, 'Admin API: delete claim failed');
    res.status(500).json({ error: 'Kunde inte ta bort ärendet' });
  }
});

// GET /api/admin/affiliates
router.get('/affiliates', authenticate, async (req, res) => {
  try {
    const allClaims = await db('claims').select('affiliate_code', 'created_at');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const statsMap = {};
    for (const row of allClaims) {
      const code = row.affiliate_code || 'main';
      if (!statsMap[code]) statsMap[code] = { total: 0, last30: 0 };
      statsMap[code].total++;
      if (new Date(row.created_at) > thirtyDaysAgo) statsMap[code].last30++;
    }

    const affiliates = Object.entries(statsMap)
      .map(([code, s]) => ({ affiliate_code: code, total_claims: s.total, last_30_days: s.last30 }))
      .sort((a, b) => b.total_claims - a.total_claims);

    res.json({ affiliates });
  } catch (err) {
    logger.error({ err }, 'Admin API: fetch affiliates failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

module.exports = router;
