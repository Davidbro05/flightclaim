import express from 'express';
import db from '../db';
import logger from '../logger';
import authenticate from '../middleware/auth';
import affiliatesRouter from './affiliates';
import type { Claim } from '../types';

const router = express.Router();

function escapeHtml(unsafe: unknown): string {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ADMIN_NAV = `
  <div class="admin-nav">
    <a href="/admin">📋 Alla ärenden</a>
    <a href="/admin/affiliates">📊 Affiliate-statistik</a>
  </div>
`;

const ADMIN_STYLES = `
  body { font-family: Arial, sans-serif; margin: 20px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: middle; }
  th { background-color: #1a4b8c; color: white; }
  tr:nth-child(even) { background-color: #f2f2f2; }
  img { max-width: 200px; max-height: 100px; border: 1px solid #ccc; background: #fff; }
  .no-signature { color: #999; font-style: italic; }
  .accepted-yes { color: green; font-weight: bold; }
  .accepted-no { color: red; }
  .pdf-link { background: #2a5298; color: white; padding: 4px 8px; text-decoration: none; border-radius: 4px; font-size: 12px; }
  .pdf-link:hover { background: #1e3c72; }
  .delete-btn { background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
  .delete-btn:hover { background: #c82333; }
  .admin-nav { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
  .admin-nav a { margin-right: 20px; color: #1a4b8c; text-decoration: none; font-weight: 500; }
`;

const ISSUE_MAP: Record<string, string> = {
  delay: 'Försening',
  cancelled: 'Inställt',
  denied: 'Nekad ombordstigning',
};

router.use('/affiliates', affiliatesRouter);

router.get('/', authenticate, async (_req, res) => {
  try {
    const rows = await db('claims').orderBy('created_at', 'desc').select<Claim[]>();

    let html = `<!DOCTYPE html><html><head><title>Admin - Claims</title>
      <style>${ADMIN_STYLES}</style></head><body>
      ${ADMIN_NAV}
      <h1>Alla inskickade ersättningsanspråk</h1>
      <table><tr>
        <th>ID</th><th>Namn</th><th>Gata</th><th>Postnr</th><th>Ort</th>
        <th>Email</th><th>Telefon</th><th>Flygnr</th><th>Flygbolag</th>
        <th>PNR</th><th>Från</th><th>Till</th><th>Datum</th><th>Händelse</th>
        <th>Signatur</th><th>Godkänt</th><th>IP</th><th>Skapad</th>
        <th>Affiliate</th><th>Fullmakt</th><th>Ta bort</th>
      </tr>`;

    for (const row of rows) {
      const signatureImg = row.signature
        ? `<img src="${escapeHtml(row.signature)}" alt="Signatur">`
        : '<span class="no-signature">Ingen signatur</span>';
      const termsAccepted = row.terms_accepted
        ? '<span class="accepted-yes">Ja</span>'
        : '<span class="accepted-no">Nej</span>';
      const pdfLink = row.signature
        ? `<a href="/fullmakt/${row.id}" class="pdf-link" target="_blank">📄 PDF</a>`
        : '—';
      const issueText = ISSUE_MAP[row.issue] ?? row.issue;

      html += `<tr>
        <td>${row.id}</td><td>${escapeHtml(row.namn)}</td>
        <td>${escapeHtml(row.street)}</td><td>${escapeHtml(row.zip)}</td>
        <td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.email)}</td>
        <td>${escapeHtml(row.phone)}</td><td>${escapeHtml(row.flightNumber)}</td>
        <td>${escapeHtml(row.airline)}</td>
        <td>${escapeHtml(row.bookingReference) || '—'}</td>
        <td>${escapeHtml(row.departureAirport)}</td><td>${escapeHtml(row.arrivalAirport)}</td>
        <td>${escapeHtml(row.flightDate)}</td><td>${escapeHtml(issueText)}</td>
        <td>${signatureImg}</td><td>${termsAccepted}</td>
        <td>${escapeHtml(row.ip_address) || 'N/A'}</td><td>${row.created_at}</td>
        <td>${escapeHtml(row.affiliate_code) || 'main'}</td><td>${pdfLink}</td>
        <td>
          <form action="/admin/delete/${row.id}" method="POST"
            onsubmit="return confirm('Är du säker på att du vill ta bort detta ärende?');">
            <button type="submit" class="delete-btn">Ta bort</button>
          </form>
        </td>
      </tr>`;
    }

    html += '</table></body></html>';
    res.send(html);
  } catch (err) {
    logger.error({ err }, 'Admin fetch failed');
    res.status(500).send('Databasfel');
  }
});

router.post('/delete/:id', authenticate, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (!id || isNaN(id)) { res.status(400).send('Ogiltigt ID'); return; }

  try {
    await db('claims').where({ id }).delete();
    res.redirect('/admin');
  } catch (err) {
    logger.error({ err, id }, 'Delete claim failed');
    res.status(500).send('Kunde inte ta bort ärendet.');
  }
});

export default router;
