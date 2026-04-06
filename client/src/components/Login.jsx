import { useState } from 'react';
import { apiFetch } from '../api.js';

export default function Login({ onLogin }) {
  const [user, setUser]     = useState('');
  const [pass, setPass]     = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/claims', { user, pass });
      if (res.ok) {
        onLogin({ user, pass });
      } else if (res.status === 401) {
        setError('Fel användarnamn eller lösenord.');
      } else {
        setError('Något gick fel. Försök igen.');
      }
    } catch {
      setError('Kunde inte ansluta till servern.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>FlightClaim</h2>
        <p>Logga in för att komma åt adminpanelen.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="user">Användarnamn</label>
            <input
              id="user"
              type="text"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="pass">Lösenord</label>
            <input
              id="pass"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Loggar in…' : 'Logga in'}
          </button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
}
