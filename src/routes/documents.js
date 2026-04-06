const express = require('express');
const db = require('../db');
const logger = require('../logger');
const authenticate = require('../middleware/auth');
const { generatePowerOfAttorney } = require('../services/pdfService');

const router = express.Router();

// GET /fullmakt/:id
router.get('/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).send('Ogiltigt ID');

  try {
    const row = await db('claims').where({ id }).first();
    if (!row) return res.status(404).send('Ärendet hittades inte.');

    generatePowerOfAttorney(row, res);
  } catch (err) {
    logger.error({ err, id }, 'PDF generation failed');
    res.status(500).send('Kunde inte generera PDF.');
  }
});

module.exports = router;
