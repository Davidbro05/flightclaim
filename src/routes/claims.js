const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const logger = require('../logger');
const { sendAdminNotification, sendCustomerConfirmation } = require('../services/emailService');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'För många förfrågningar. Försök igen om 15 minuter.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', submitLimiter, async (req, res) => {
  const {
    namn, street, zip, city, email, phone,
    flightNumber, airline, bookingReference,
    departureAirport, arrivalAirport, flightDate,
    issue, signature, terms_accepted,
  } = req.body;

  const userIp = req.ip || req.socket?.remoteAddress;

  // Affiliate tracking: query param takes priority over cookie
  let affiliateCode = 'main';
  if (req.cookies?.affiliate_code) {
    affiliateCode = req.cookies.affiliate_code;
  }
  if (req.query.ref) {
    affiliateCode = req.query.ref;
    res.cookie('affiliate_code', req.query.ref, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  if (!namn || !street || !zip || !city || !email || !phone ||
      !flightNumber || !airline || !departureAirport ||
      !arrivalAirport || !flightDate || !issue) {
    return res.status(400).send('Alla fält (förutom bokningsreferens) måste fyllas i.');
  }
  if (!signature) {
    return res.status(400).send('Signatur saknas.');
  }
  if (terms_accepted !== 'on') {
    return res.status(400).send('Du måste godkänna användarvillkoren.');
  }

  try {
    const claimData = {
      namn, street, zip, city, email, phone,
      flightNumber, airline,
      bookingReference: bookingReference || null,
      departureAirport, arrivalAirport, flightDate,
      issue, signature,
      ip_address: userIp,
      terms_accepted: true,
      affiliate_code: affiliateCode,
    };

    await db('claims').insert(claimData);

    // Fire-and-forget — email failure must not prevent claim from being saved
    Promise.all([
      sendAdminNotification(claimData),
      sendCustomerConfirmation(claimData),
    ]).catch((err) => logger.error({ err }, 'Failed to send notification emails'));

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Tack!</title></head>
      <body style="font-family:Arial,sans-serif;text-align:center;padding:60px;">
        <h1>Tack!</h1>
        <p>Ditt ärende har registrerats. Vi återkommer via e-post.</p>
        <a href="/">Gå tillbaka</a>
      </body>
      </html>
    `);
  } catch (err) {
    logger.error({ err }, 'Failed to insert claim');
    res.status(500).send('Något gick fel vid sparandet.');
  }
});

module.exports = router;
