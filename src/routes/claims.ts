import express from 'express';
import rateLimit from 'express-rate-limit';
import db from '../db';
import logger from '../logger';
import { sendAdminNotification, sendCustomerConfirmation } from '../services/emailService';
import type { Claim } from '../types';

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
  } = req.body as Record<string, string>;

  const userIp = req.ip ?? req.socket?.remoteAddress;

  let affiliateCode = 'main';
  if (req.cookies?.affiliate_code) affiliateCode = req.cookies.affiliate_code as string;
  if (req.query.ref) {
    affiliateCode = req.query.ref as string;
    res.cookie('affiliate_code', req.query.ref, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  if (!namn || !street || !zip || !city || !email || !phone ||
      !flightNumber || !airline || !departureAirport ||
      !arrivalAirport || !flightDate || !issue) {
    res.status(400).send('Alla fält (förutom bokningsreferens) måste fyllas i.');
    return;
  }
  if (!signature) {
    res.status(400).send('Signatur saknas.');
    return;
  }
  if (terms_accepted !== 'on') {
    res.status(400).send('Du måste godkänna användarvillkoren.');
    return;
  }

  try {
    const claimData: Omit<Claim, 'id' | 'created_at'> = {
      namn, street, zip, city, email, phone,
      flightNumber, airline,
      bookingReference: bookingReference || null,
      departureAirport, arrivalAirport, flightDate,
      issue, signature,
      ip_address: userIp ?? null,
      terms_accepted: true,
      affiliate_code: affiliateCode,
    };

    await db('claims').insert(claimData);

    Promise.all([
      sendAdminNotification(claimData as Claim),
      sendCustomerConfirmation(claimData as Claim),
    ]).catch((err: unknown) => logger.error({ err }, 'Failed to send notification emails'));

    res.redirect('/tack');
  } catch (err) {
    logger.error({ err }, 'Failed to insert claim');
    res.status(500).send('Något gick fel vid sparandet.');
  }
});

export default router;
