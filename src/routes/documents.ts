import express from 'express';
import db from '../db';
import logger from '../logger';
import authenticate from '../middleware/auth';
import { generatePowerOfAttorney } from '../services/pdfService';
import type { Claim } from '../types';

const router = express.Router();

router.get('/:id', authenticate, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (!id || isNaN(id)) { res.status(400).send('Ogiltigt ID'); return; }

  try {
    const row = await db('claims').where({ id }).first<Claim>();
    if (!row) { res.status(404).send('Ärendet hittades inte.'); return; }
    generatePowerOfAttorney(row, res);
  } catch (err) {
    logger.error({ err, id }, 'PDF generation failed');
    res.status(500).send('Kunde inte generera PDF.');
  }
});

export default router;
