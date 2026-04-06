import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api.js';

export default function AffiliatesPage({ creds, onUnauth }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [newCode, setNewCode]       = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const fetchAffiliates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/admin/affiliates', creds);
      if (res.status === 401) { onUnauth(); return; }
      if (!res.ok) throw new Error('Serverfel');
      const data = await res.json();
      setAffiliates(data.affiliates);
    } catch {
      setError('Kunde inte hämta affiliate-statistik.');
    } finally {
      setLoading(false);
    }
  }, [creds, onUnauth]);

  useEffect(() => { fetchAffiliates(); }, [fetchAffiliates]);

  function generateLink() {
    const clean = newCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) { alert('Ange ett namn.'); return; }
    setGeneratedLink(`${window.location.origin}/?ref=${encodeURIComponent(clean)}`);
  }

  const affiliateTotal = affiliates
    .filter((r) => r.affiliate_code !== 'main')
    .reduce((sum, r) => sum + r.total_claims, 0);

  if (loading) return <div className="spinner" />;
  if (error)   return <p className="empty">{error}</p>;

  return (
    <>
      <h2 className="page-title">Affiliate-program</h2>
      <div className="aff-grid">
        {/* Link generator */}
        <div className="card">
          <h3>Skapa ny affiliate-länk</h3>
          <p style={{ fontSize: '.85rem', color: '#718096', marginTop: 0 }}>
            Ange ett unikt namn för kreatören (t.ex. "youtuber123").
          </p>
          <div className="link-form">
            <input
              type="text"
              placeholder="t.ex. johansblogg"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateLink()}
            />
            <button onClick={generateLink}>Generera</button>
          </div>
          {generatedLink && (
            <div className="generated-link">
              Din affiliate-länk:{' '}
              <a href={generatedLink} target="_blank" rel="noreferrer">{generatedLink}</a>
              <button
                style={{ marginLeft: 10, fontSize: '.78rem', padding: '2px 8px', cursor: 'pointer' }}
                onClick={() => navigator.clipboard.writeText(generatedLink).then(() => alert('Kopierat!'))}
              >
                Kopiera
              </button>
            </div>
          )}
        </div>

        {/* Stats table */}
        <div className="card">
          <h3>Statistik per affiliate</h3>
          {affiliates.length === 0 ? (
            <p className="empty">Inga ärenden registrerade ännu.</p>
          ) : (
            <div className="table-wrap" style={{ boxShadow: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Totalt</th>
                    <th>Senaste 30 d</th>
                    <th>Andel</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((r) => {
                    const isMain = r.affiliate_code === 'main';
                    const pct = !isMain && affiliateTotal > 0
                      ? Math.round((r.total_claims / affiliateTotal) * 100)
                      : null;
                    return (
                      <tr key={r.affiliate_code} className={isMain ? 'row-main' : ''}>
                        <td>
                          {isMain ? r.affiliate_code : (
                            <a
                              href={`${window.location.origin}/?ref=${encodeURIComponent(r.affiliate_code)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {r.affiliate_code}
                            </a>
                          )}
                        </td>
                        <td>{r.total_claims}</td>
                        <td>{r.last_30_days ?? 0}</td>
                        <td>{pct !== null ? `${pct}%` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
