import { useState } from 'react';
import Login from './components/Login.jsx';
import ClaimsList from './components/ClaimsList.jsx';
import AffiliatesPage from './components/AffiliatesPage.jsx';
import ArticlesList from './components/ArticlesList.jsx';
import ArticleEditor from './components/ArticleEditor.jsx';
import NavManager from './components/NavManager.jsx';

const SESSION_KEY = 'fc_admin_creds';

function loadCreds() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const NAV = [
  { id: 'claims',    label: 'Ärenden' },
  { id: 'articles',  label: 'Artiklar' },
  { id: 'nav',       label: 'Navigation' },
  { id: 'affiliates',label: 'Affiliates' },
];

export default function App() {
  const [creds, setCreds]         = useState(loadCreds);
  const [view, setView]           = useState('claims');
  const [editingSlug, setEditing] = useState(null); // null = list, string = edit, 'new' = new

  function handleLogin(c) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(c));
    setCreds(c);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setCreds(null);
  }

  function goToView(v) {
    setView(v);
    setEditing(null);
  }

  if (!creds) return <Login onLogin={handleLogin} />;

  return (
    <div className="layout">
      <header className="topbar">
        <h1>FlightClaim Admin</h1>
        <nav>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-btn ${view === n.id ? 'active' : 'inactive'}`}
              onClick={() => goToView(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logga ut</button>
      </header>

      <main className="content">
        {view === 'claims' && (
          <ClaimsList creds={creds} onUnauth={handleLogout} />
        )}

        {view === 'affiliates' && (
          <AffiliatesPage creds={creds} onUnauth={handleLogout} />
        )}

        {view === 'nav' && (
          <NavManager creds={creds} onUnauth={handleLogout} />
        )}

        {view === 'articles' && editingSlug === null && (
          <ArticlesList
            creds={creds}
            onUnauth={handleLogout}
            onEdit={(slug) => setEditing(slug)}
            onNew={() => setEditing('new')}
          />
        )}

        {view === 'articles' && editingSlug !== null && (
          <ArticleEditor
            creds={creds}
            onUnauth={handleLogout}
            slug={editingSlug === 'new' ? null : editingSlug}
            onSaved={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        )}
      </main>
    </div>
  );
}
