const nodemailer = require('nodemailer');
const logger = require('../logger');

const ISSUE_MAP = { delay: 'Försening', cancelled: 'Inställt', denied: 'Nekad ombordstigning' };

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: SMTP_SECURE === 'true',
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

function getTransporter() {
  return createTransport();
}

async function sendAdminNotification(claim) {
  const transporter = getTransporter();
  if (!transporter) {
    logger.warn('SMTP not configured — skipping admin notification email');
    return;
  }

  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    logger.warn('NOTIFY_EMAIL not set — skipping admin notification email');
    return;
  }

  const issueText = ISSUE_MAP[claim.issue] || claim.issue;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Nytt ärende: ${claim.namn} — ${claim.flightNumber}`,
    text: [
      `Ett nytt ersättningsanspråk har registrerats.`,
      ``,
      `Namn:           ${claim.namn}`,
      `E-post:         ${claim.email}`,
      `Telefon:        ${claim.phone}`,
      `Adress:         ${claim.street}, ${claim.zip} ${claim.city}`,
      ``,
      `Flygnummer:     ${claim.flightNumber}`,
      `Flygbolag:      ${claim.airline}`,
      `Bokningsref:    ${claim.bookingReference || '—'}`,
      `Från/Till:      ${claim.departureAirport} → ${claim.arrivalAirport}`,
      `Datum:          ${claim.flightDate}`,
      `Händelse:       ${issueText}`,
      ``,
      `Affiliate-kod:  ${claim.affiliate_code || 'main'}`,
      `IP-adress:      ${claim.ip_address || 'okänd'}`,
    ].join('\n'),
  });

  logger.info({ to, flightNumber: claim.flightNumber }, 'Admin notification email sent');
}

async function sendCustomerConfirmation(claim) {
  const transporter = getTransporter();
  if (!transporter) return;

  const companyName = process.env.COMPANY_NAME || 'FlightClaim';

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: claim.email,
    subject: `Vi har mottagit ditt ärende — ${claim.flightNumber}`,
    text: [
      `Hej ${claim.namn},`,
      ``,
      `Tack för att du kontaktade ${companyName}!`,
      ``,
      `Vi har mottagit ditt ersättningsanspråk för flyg ${claim.flightNumber} den ${claim.flightDate}.`,
      `Vi granskar ditt ärende och återkommer till dig via e-post så snart som möjligt.`,
      ``,
      `Med vänliga hälsningar,`,
      `${companyName}`,
    ].join('\n'),
  });

  logger.info({ to: claim.email, flightNumber: claim.flightNumber }, 'Customer confirmation email sent');
}

module.exports = { sendAdminNotification, sendCustomerConfirmation };
