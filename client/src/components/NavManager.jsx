import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api.js';

const EMPTY_FORM = { label: '', url: '', parent_id: '', sort_order: 0 };

export default function NavManager({ creds, onUnauth }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item object
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch('/api/nav/flat', creds);
    if (res.status === 401) { onUnauth(); return; }
    const data = await res.json();
    setItems(data.items);
    setLoading(false);
  }, [creds, onUnauth]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function startNew() {
    setForm({ ...EMPTY_FORM, sort_order: items.length + 1 });
    setEditing('new');
    setError('');
  }

  function startEdit(item) {
    setForm({
      label: item.label,
      url: item.url,
      parent_id: item.parent_id || '',
      sort_order: item.sort_order,
    });
    setEditing(item);
    setError('');
  }

  function cancel() { setEditing(null); setError(''); }

  async function handleSave() {
    if (!form.label.trim()) { setError('Label krävs'); return; }
    if (!form.url.trim())   { setError('URL krävs'); return; }
    setSaving(true);
    setError('');
    const payload = {
      label: form.label.trim(),
      url: form.url.trim(),
      parent_id: form.parent_id ? parseInt(form.parent_id, 10) : null,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };
    const isNew = editing === 'new';
    const res = await apiFetch(
      isNew ? '/api/nav' : `/api/nav/${editing.id}`,
      creds,
      { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(payload) }
    );
    if (res.status === 401) { onUnauth(); return; }
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || 'Fel vid sparande');
      setSaving(false);
      return;
    }
    setSaving(false);
    setEditing(null);
    fetchItems();
  }

  async function handleDelete(id, label) {
    if (!confirm(`Ta bort "${label}"? Undersidor tas också bort.`)) return;
    const res = await apiFetch(`/api/nav/${id}`, creds, { method: 'DELETE' });
    if (res.status === 401) { onUnauth(); return; }
    setItems((prev) => prev.filter((i) => i.id !== id && i.parent_id !== id));
  }

  // Build display: show top-level then children indented
  const topLevel = items.filter((i) => !i.parent_id);
  const childrenOf = (id) => items.filter((i) => i.parent_id === id);
  const parents = items.filter((i) => !i.parent_id);

  if (loading) return <div className="spinner" />;

  return (
    <>
      <div className="list-header">
        <h2 className="page-title" style={{ margin: 0 }}>Navigation</h2>
        <button className="btn-primary" onClick={startNew}>+ Nytt menyval</button>
      </div>

      {/* ── Form ── */}
      {editing && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3>{editing === 'new' ? 'Nytt menyval' : `Redigera: ${editing.label}`}</h3>
          {error && <p className="error-msg" style={{ textAlign: 'left', marginTop: 0 }}>{error}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Label *</label>
              <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Försenat flyg" />
            </div>
            <div className="field">
              <label>URL *</label>
              <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="/forsening" />
            </div>
            <div className="field">
              <label>Förälder <span style={{ color: '#718096', fontWeight: 400 }}>(dropdown-barn)</span></label>
              <select value={form.parent_id} onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}>
                <option value="">— Toppnivå —</option>
                {parents.filter((p) => editing === 'new' || p.id !== editing.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Sorteringsordning</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Sparar…' : 'Spara'}</button>
            <button className="btn-secondary" onClick={cancel}>Avbryt</button>
          </div>
        </div>
      )}

      {/* ── Nav tree table ── */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>URL</th>
              <th>Förälder</th>
              <th>Ordning</th>
              <th>Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {topLevel.map((item) => (
              <>
                <tr key={item.id} style={{ background: '#ebf4ff' }}>
                  <td><strong>{item.label}</strong></td>
                  <td><code style={{ fontSize: '.75rem' }}>{item.url}</code></td>
                  <td>—</td>
                  <td>{item.sort_order}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-edit" onClick={() => startEdit(item)}>Redigera</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id, item.label)}>Ta bort</button>
                  </td>
                </tr>
                {childrenOf(item.id).map((child) => (
                  <tr key={child.id}>
                    <td style={{ paddingLeft: 32 }}>↳ <strong>{child.label}</strong></td>
                    <td><code style={{ fontSize: '.75rem' }}>{child.url}</code></td>
                    <td>{item.label}</td>
                    <td>{child.sort_order}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-edit" onClick={() => startEdit(child)}>Redigera</button>
                      <button className="btn-delete" onClick={() => handleDelete(child.id, child.label)}>Ta bort</button>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
