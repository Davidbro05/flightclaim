import { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import { apiFetch } from '../api.js';

marked.setOptions({ breaks: true });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Counter({ value, max, warn }) {
  const len = (value || '').length;
  const color = len > max ? '#e53e3e' : len > warn ? '#d69e2e' : '#718096';
  return <span style={{ fontSize: '.75rem', color }}>{len}/{max}</span>;
}

export default function ArticleEditor({ creds, onUnauth, slug, onSaved, onCancel }) {
  const isNew = !slug;

  const [form, setForm] = useState({
    title: '', slug: '', parent_slug: '', type: 'guide', status: 'draft',
    meta_title: '', meta_desc: '', content: '', schema_type: 'none',
    faq_json: [], affiliate_ref: '',
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [tab, setTab]               = useState('edit');
  const [saving, setSaving]         = useState(false);
  const [errors, setErrors]         = useState([]);
  const [loading, setLoading]       = useState(!isNew);

  const load = useCallback(async () => {
    const res = await apiFetch(`/api/articles/${slug}`, creds);
    if (res.status === 401) { onUnauth(); return; }
    if (!res.ok) { setErrors(['Artikel hittades inte']); setLoading(false); return; }
    const { article } = await res.json();
    setForm({
      title: article.title || '',
      slug: article.slug || '',
      parent_slug: article.parent_slug || '',
      type: article.type || 'guide',
      status: article.status || 'draft',
      meta_title: article.meta_title || '',
      meta_desc: article.meta_desc || '',
      content: article.content || '',
      schema_type: article.schema_type || 'none',
      faq_json: Array.isArray(article.faq_json) ? article.faq_json : [],
      affiliate_ref: article.affiliate_ref || '',
    });
    setSlugEdited(true);
    setLoading(false);
  }, [slug, creds, onUnauth]);

  useEffect(() => { if (!isNew) load(); }, [isNew, load]);

  function set(key, val) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === 'title' && !slugEdited) next.slug = slugify(val);
      return next;
    });
  }

  // FAQ helpers
  function addFaq()           { setForm((f) => ({ ...f, faq_json: [...f.faq_json, { q: '', a: '' }] })); }
  function removeFaq(i)       { setForm((f) => ({ ...f, faq_json: f.faq_json.filter((_, idx) => idx !== i) })); }
  function setFaq(i, key, v)  {
    setForm((f) => {
      const next = [...f.faq_json];
      next[i] = { ...next[i], [key]: v };
      return { ...f, faq_json: next };
    });
  }

  async function handleSave(newStatus) {
    setSaving(true);
    setErrors([]);
    const payload = { ...form, status: newStatus || form.status };
    const method  = isNew ? 'POST' : 'PUT';
    const url     = isNew ? '/api/articles' : `/api/articles/${slug}`;
    try {
      const res = await apiFetch(url, creds, {
        method,
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { onUnauth(); return; }
      const data = await res.json();
      if (!res.ok) { setErrors(data.errors || [data.error || 'Fel']); return; }
      onSaved(data.article.slug);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="spinner" />;

  const preview = marked.parse(form.content || '*Ingen content ännu.*');

  return (
    <div className="editor-wrap">
      {/* ── Top bar ── */}
      <div className="editor-topbar">
        <button className="btn-back" onClick={onCancel}>← Tillbaka</button>
        <h2 className="page-title" style={{ margin: 0, flex: 1 }}>
          {isNew ? 'Ny artikel' : 'Redigera artikel'}
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>
            {saving ? 'Sparar…' : 'Spara utkast'}
          </button>
          <button className="btn-primary" onClick={() => handleSave('published')} disabled={saving}>
            {saving ? 'Publicerar…' : 'Publicera'}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-banner">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <div className="editor-grid">
        {/* ── Left: main fields ── */}
        <div className="editor-main">
          {/* Titel */}
          <div className="field">
            <label>Titel *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Försenat flyg — din guide" />
          </div>

          {/* Slug */}
          <div className="field">
            <label>Slug * <span style={{ color: '#718096', fontWeight: 400 }}>(URL-del, t.ex. forsening/hur-mycket)</span></label>
            <input
              value={form.slug}
              onChange={(e) => { setSlugEdited(true); set('slug', e.target.value); }}
              placeholder="forsening/hur-mycket"
            />
          </div>

          {/* Förälder-slug */}
          <div className="field">
            <label>Förälder-slug <span style={{ color: '#718096', fontWeight: 400 }}>(för breadcrumbs)</span></label>
            <input value={form.parent_slug} onChange={(e) => set('parent_slug', e.target.value)} placeholder="forsening" />
          </div>

          {/* Content + preview */}
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Content (Markdown)</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className={`tab-btn ${tab === 'edit' ? 'active' : ''}`} onClick={() => setTab('edit')}>Skriv</button>
                <button className={`tab-btn ${tab === 'preview' ? 'active' : ''}`} onClick={() => setTab('preview')}>Förhandsgranskning</button>
              </div>
            </div>
            {tab === 'edit' ? (
              <textarea
                className="md-editor"
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                placeholder="## Rubrik&#10;&#10;Skriv din artikel här med **Markdown**..."
                rows={18}
              />
            ) : (
              <div
                className="md-preview"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            )}
          </div>

          {/* FAQ builder */}
          {form.schema_type === 'FAQPage' && (
            <div className="field">
              <label>FAQ-frågor</label>
              {form.faq_json.map((faq, i) => (
                <div key={i} className="faq-row">
                  <div style={{ flex: 1 }}>
                    <input
                      value={faq.q}
                      onChange={(e) => setFaq(i, 'q', e.target.value)}
                      placeholder="Fråga"
                      style={{ marginBottom: 6 }}
                    />
                    <textarea
                      value={faq.a}
                      onChange={(e) => setFaq(i, 'a', e.target.value)}
                      placeholder="Svar"
                      rows={2}
                    />
                  </div>
                  <button className="btn-delete" style={{ alignSelf: 'flex-start', marginTop: 2 }} onClick={() => removeFaq(i)}>✕</button>
                </div>
              ))}
              <button className="btn-secondary" onClick={addFaq} style={{ marginTop: 8 }}>+ Lägg till FAQ-fråga</button>
            </div>
          )}
        </div>

        {/* ── Right: meta sidebar ── */}
        <aside className="editor-sidebar">
          <div className="card">
            <h3>Inställningar</h3>

            <div className="field">
              <label>Typ *</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="guide">Guide</option>
                <option value="airline">Flygbolag</option>
                <option value="blog">Blogg</option>
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Utkast</option>
                <option value="published">Publicerad</option>
              </select>
            </div>

            <div className="field">
              <label>Schema-markup</label>
              <select value={form.schema_type} onChange={(e) => set('schema_type', e.target.value)}>
                <option value="none">Ingen</option>
                <option value="FAQPage">FAQPage</option>
                <option value="Article">Article</option>
              </select>
            </div>

            <div className="field">
              <label>Affiliate-ref</label>
              <input value={form.affiliate_ref} onChange={(e) => set('affiliate_ref', e.target.value)} placeholder="partner1" />
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>SEO</h3>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Meta-titel</label>
                <Counter value={form.meta_title} max={60} warn={50} />
              </div>
              <input
                value={form.meta_title}
                onChange={(e) => set('meta_title', e.target.value)}
                placeholder="Försenat flyg — ersättning upp till 600€"
              />
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Meta-beskrivning</label>
                <Counter value={form.meta_desc} max={160} warn={130} />
              </div>
              <textarea
                value={form.meta_desc}
                onChange={(e) => set('meta_desc', e.target.value)}
                placeholder="Komplett guide om din rätt till ersättning vid försenat flyg enligt EU-förordning 261/2004."
                rows={3}
              />
            </div>

            {/* SERP preview */}
            <div className="serp-preview">
              <p className="serp-title">{form.meta_title || form.title || 'Sidtitel'}</p>
              <p className="serp-url">flightclaim.se/{form.slug || 'slug'}</p>
              <p className="serp-desc">{form.meta_desc || 'Meta-beskrivning visas här.'}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
