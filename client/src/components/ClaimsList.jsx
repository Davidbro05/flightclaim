import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api.js';

export default function ClaimsList({ creds, onUnauth }) {
  const [claims, setClaims]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/admin/claims', creds);
      if (res.status === 401) { onUnauth(); return; }
      if (!res.ok) throw new Error('Serverfel');
      const data = await res.json();
      setClaims(data.claims);
    } catch {
      setError('Kunde inte hämta ärenden.');
    } finally {
      setLoading(false);
    }
  }, [creds, onUnauth]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  async function handleDelete(id, namn) {
    if (!confirm(`Ta bort ärendet för ${namn}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/claims/${id}`, creds, { method: 'DELETE' });
      if (res.status === 401) { onUnauth(); return; }
      if (!res.ok) throw new Error();
      setClaims((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Kunde inte ta bort ärendet.');
    }
  }

  if (loading) return <div className="spinner" />;
  if (error)   return <p className="empty">{error}</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>
          Alla ärenden <span style={{ color: '#718096', fontWeight: 400, fontSize: '1rem' }}>({claims.length})</span>
        </h2>
        <button className="nav-btn inactive" style={{ background: '#1a4b8c' }} onClick={fetchClaims}>
          Uppdatera
        </button>
      </div>
      {claims.length === 0 ? (
        <p className="empty">Inga ärenden registrerade ännu.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Namn</th><th>Gata</th><th>Postnr</th><th>Ort</th>
                <th>E-post</th><th>Telefon</th><th>Flygnr</th><th>Flygbolag</th>
                <th>PNR</th><th>Från</th><th>Till</th><th>Datum</th><th>Händelse</th>
                <th>Signatur</th><th>Godkänt</th><th>IP</th><th>Skapad</th>
                <th>Affiliate</th><th>Fullmakt</th><th>Ta bort</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.namn}</td>
                  <td>{c.street}</td>
                  <td>{c.zip}</td>
                  <td>{c.city}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.flightNumber}</td>
                  <td>{c.airline}</td>
                  <td>{c.bookingReference || '—'}</td>
                  <td>{c.departureAirport}</td>
                  <td>{c.arrivalAirport}</td>
                  <td>{c.flightDate}</td>
                  <td>{c.issueLabel}</td>
                  <td>
                    {c.signature
                      ? <img className="sig-img" src={c.signature} alt="Signatur" />
                      : <span className="no-sig">Ingen signatur</span>}
                  </td>
                  <td>
                    {c.terms_accepted
                      ? <span className="badge-yes">Ja</span>
                      : <span className="badge-no">Nej</span>}
                  </td>
                  <td>{c.ip_address || 'N/A'}</td>
                  <td>{new Date(c.created_at).toLocaleString('sv-SE')}</td>
                  <td>{c.affiliate_code || 'main'}</td>
                  <td>
                    {c.signature
                      ? <a className="btn-pdf" href={`/fullmakt/${c.id}`} target="_blank" rel="noreferrer">PDF</a>
                      : '—'}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(c.id, c.namn)}>
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
