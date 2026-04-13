import express from 'express';
import db from '../db';
import logger from '../logger';
import authenticate from '../middleware/auth';
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

router.get('/', authenticate, async (req, res) => {
  try {
    const allClaims = await db('claims').select<Pick<Claim, 'affiliate_code' | 'created_at'>[]>('affiliate_code', 'created_at');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const statsMap: Record<string, { total: number; last30: number }> = {};
    for (const row of allClaims) {
      const code = row.affiliate_code ?? 'main';
      if (!statsMap[code]) statsMap[code] = { total: 0, last30: 0 };
      statsMap[code].total++;
      if (new Date(row.created_at) > thirtyDaysAgo) statsMap[code].last30++;
    }

    const rows = Object.entries(statsMap)
      .map(([code, s]) => ({ affiliate_code: code, total_claims: s.total, last_30_days: s.last30 }))
      .sort((a, b) => b.total_claims - a.total_claims);

    const affiliateTotal = rows
      .filter((r) => r.affiliate_code !== 'main')
      .reduce((sum, r) => sum + r.total_claims, 0);

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    let html = `<!DOCTYPE html><html>
    <head>
      <title>Affiliates - FlightClaim</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1a4b8c; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #1a4b8c; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .main-row { background-color: #e8f4f8; font-weight: bold; }
        .code-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        input { padding: 8px; width: 300px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 8px 15px; background: #1a4b8c; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0f3a6b; }
        .nav { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .nav a { color: #1a4b8c; text-decoration: none; margin-right: 15px; }
      </style>
    </head>
    <body>
      <div class="nav">
        <a href="/admin">← Tillbaka till alla ärenden</a>
        <a href="/admin/affiliates">🔄 Uppdatera</a>
      </div>
      <h1>Affiliate-program</h1>
      <div class="code-box">
        <h3>Skapa ny affiliate-länk</h3>
        <p>Ange ett unikt namn för kreatören (t.ex. "youtuber123" eller "bloggaren"):</p>
        <input type="text" id="affiliateName" placeholder="t.ex. johansblogg">
        <button onclick="generateLink()">Generera länk</button>
        <p id="generatedLink" style="margin-top:10px;display:none;">
          Din affiliate-länk:<br>
          <input type="text" id="linkOutput" readonly style="width:100%;margin-top:5px;">
          <button onclick="copyLink()">Kopiera länk</button>
        </p>
      </div>
      <h2>Statistik per affiliate</h2>
      <table>
        <tr>
          <th>Affiliate-kod</th><th>Totalt antal ärenden</th>
          <th>Senaste 30 dagarna</th><th>Andel</th><th>Länk</th>
        </tr>`;

    for (const row of rows) {
      const isMain = row.affiliate_code === 'main';
      const percentage = !isMain && affiliateTotal > 0
        ? Math.round((row.total_claims / affiliateTotal) * 100)
        : 0;
      const affiliateLink = isMain ? '—' : `${baseUrl}/?ref=${encodeURIComponent(row.affiliate_code)}`;

      html += `<tr class="${isMain ? 'main-row' : ''}">
        <td><strong>${escapeHtml(row.affiliate_code)}</strong></td>
        <td>${row.total_claims}</td>
        <td>${row.last_30_days ?? 0}</td>
        <td>${!isMain ? percentage + '%' : '—'}</td>
        <td>${!isMain
          ? `<a href="${escapeHtml(affiliateLink)}" target="_blank">🔗 ${escapeHtml(row.affiliate_code)}-länk</a>`
          : '—'
        }</td>
      </tr>`;
    }

    html += `</table>
      <script>
        function generateLink() {
          const name = document.getElementById('affiliateName').value.trim();
          if (!name) { alert('Ange ett namn'); return; }
          const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (clean !== name.toLowerCase()) alert('Endast bokstäver och siffror är tillåtna. Namnet blev: ' + clean);
          const link = window.location.origin + '/?ref=' + encodeURIComponent(clean);
          document.getElementById('linkOutput').value = link;
          document.getElementById('generatedLink').style.display = 'block';
        }
        function copyLink() {
          document.getElementById('linkOutput').select();
          document.execCommand('copy');
          alert('Länken har kopierats!');
        }
      </script>
    </body></html>`;

    res.send(html);
  } catch (err) {
    logger.error({ err }, 'Affiliates fetch failed');
    res.status(500).send('Databasfel');
  }
});

export default router;
