import nodemailer from 'nodemailer';
import logger from '../logger';
import type { Claim } from '../types';

const ISSUE_MAP: Record<string, string> = {
  delay: 'Försening',
  cancelled: 'Inställt',
  denied: 'Nekad ombordstigning',
};

function createTransport(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT ?? '587', 10),
    secure: SMTP_SECURE === 'true',
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

export async function sendAdminNotification(claim: Claim): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn('SMTP not configured — skipping admin notification email');
    return;
  }

  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    logger.warn('NOTIFY_EMAIL not set — skipping admin notification email');
    return;
  }

  const issueText = ISSUE_MAP[claim.issue] ?? claim.issue;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
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
      `Bokningsref:    ${claim.bookingReference ?? '—'}`,
      `Från/Till:      ${claim.departureAirport} → ${claim.arrivalAirport}`,
      `Datum:          ${claim.flightDate}`,
      `Händelse:       ${issueText}`,
      ``,
      `Affiliate-kod:  ${claim.affiliate_code ?? 'main'}`,
      `IP-adress:      ${claim.ip_address ?? 'okänd'}`,
    ].join('\n'),
  });

  logger.info({ to, flightNumber: claim.flightNumber }, 'Admin notification email sent');
}

export async function sendCustomerConfirmation(claim: Claim): Promise<void> {
  const transporter = createTransport();
  if (!transporter) return;

  const companyName = process.env.COMPANY_NAME ?? 'FlightClaim';

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
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

export async function sendContactNotification(params: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn('SMTP not configured — skipping contact notification email');
    return;
  }

  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    logger.warn('NOTIFY_EMAIL not set — skipping contact notification email');
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    replyTo: params.email,
    subject: `Kontaktformulär: ${params.name}`,
    text: [
      `Nytt meddelande via kontaktformuläret på FlightClaim.se.`,
      ``,
      `Namn:    ${params.name}`,
      `E-post:  ${params.email}`,
      ``,
      `Meddelande:`,
      params.message,
    ].join('\n'),
  });

  logger.info({ to, from: params.email }, 'Contact notification email sent');
}
