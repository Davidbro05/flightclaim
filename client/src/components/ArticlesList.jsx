import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api.js';

const TYPE_LABELS  = { guide: 'Guide', airline: 'Flygbolag', blog: 'Blogg' };
const STATUS_BADGE = { published: 'badge-yes', draft: 'badge-draft' };

export default function ArticlesList({ creds, onUnauth, onEdit, onNew }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filterType, setFilterType]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType)   params.set('type', filterType);
    if (filterStatus) params.set('status', filterStatus);
    try {
      const res = await apiFetch(`/api/articles?${params}`, creds);
      if (res.status === 401) { onUnauth(); return; }
      const data = await res.json();
      setArticles(data.articles);
    } finally {
      setLoading(false);
    }
  }, [creds, onUnauth, filterType, filterStatus]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  async function handleDelete(slug, title) {
    if (!confirm(`Ta bort "${title}"?`)) return;
    const res = await apiFetch(`/api/articles/${slug}`, creds, { method: 'DELETE' });
    if (res.status === 401) { onUnauth(); return; }
    setArticles((prev) => prev.filter((a) => a.slug !== slug));
  }

  return (
    <>
      <div className="list-header">
        <h2 className="page-title" style={{ margin: 0 }}>
          Artiklar <span style={{ color: '#718096', fontWeight: 400, fontSize: '1rem' }}>({articles.length})</span>
        </h2>
        <div className="list-actions">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="">Alla typer</option>
            <option value="guide">Guide</option>
            <option value="airline">Flygbolag</option>
            <option value="blog">Blogg</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Alla statusar</option>
            <option value="published">Publicerade</option>
            <option value="draft">Utkast</option>
          </select>
          <button className="btn-primary" onClick={onNew}>+ Ny artikel</button>
        </div>
      </div>

      {loading ? <div className="spinner" /> : articles.length === 0 ? (
        <p className="empty">Inga artiklar. Skapa din första!</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titel</th>
                <th>Slug</th>
                <th>Typ</th>
                <th>Status</th>
                <th>Schema</th>
                <th>Skapad</th>
                <th>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</td>
                  <td><code style={{ fontSize: '.75rem' }}>{a.slug}</code></td>
                  <td>{TYPE_LABELS[a.type] || a.type}</td>
                  <td>
                    <span className={STATUS_BADGE[a.status] || ''}>
                      {a.status === 'published' ? 'Publicerad' : 'Utkast'}
                    </span>
                  </td>
                  <td>{a.schema_type !== 'none' ? a.schema_type : '—'}</td>
                  <td>{new Date(a.created_at).toLocaleDateString('sv-SE')}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-edit" onClick={() => onEdit(a.slug)}>Redigera</button>
                    <a
                      href={`/${a.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-preview"
                    >
                      Visa
                    </a>
                    <button className="btn-delete" onClick={() => handleDelete(a.slug, a.title)}>Ta bort</button>
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
