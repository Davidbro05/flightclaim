import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import ClaimsList from './components/ClaimsList.jsx';
import AffiliatesPage from './components/AffiliatesPage.jsx';

const SESSION_KEY = 'fc_admin_creds';

function loadCreds() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [creds, setCreds] = useState(loadCreds);
  const [view, setView]   = useState('claims');

  function handleLogin(c) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(c));
    setCreds(c);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setCreds(null);
  }

  if (!creds) return <Login onLogin={handleLogin} />;

  return (
    <div className="layout">
      <header className="topbar">
        <h1>FlightClaim Admin</h1>
        <nav>
          <button
            className={`nav-btn ${view === 'claims' ? 'active' : 'inactive'}`}
            onClick={() => setView('claims')}
          >
            Ärenden
          </button>
          <button
            className={`nav-btn ${view === 'affiliates' ? 'active' : 'inactive'}`}
            onClick={() => setView('affiliates')}
          >
            Affiliates
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logga ut</button>
      </header>
      <main className="content">
        {view === 'claims'      && <ClaimsList     creds={creds} onUnauth={handleLogout} />}
        {view === 'affiliates'  && <AffiliatesPage creds={creds} onUnauth={handleLogout} />}
      </main>
    </div>
  );
}
