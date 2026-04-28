'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import Logo from './Logo';

export default function LoginScreen() {
  const { login } = useApp();
  const router = useRouter();
  const [credential, setCredential] = useState('meenal.tiwari@jmfinancial.in');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      login();
      router.push('/discover');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <Logo size={48} />
        </div>
        <div className="login-eyebrow">HNI Wealth Platform</div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to your JMPro account to continue</p>

        <div className="fg">
          <label>Mobile / Email</label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="fg">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 8 }}>{error}</p>}

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In to JMPro'}
        </button>

        <p className="login-hint">
          Demo credentials pre-filled — <span onClick={handleLogin}>click to continue →</span>
        </p>

        <div className="login-divider">
          <div className="login-divider-line" />
          <div className="login-divider-text">Secured by</div>
          <div className="login-divider-line" />
        </div>
        <div className="login-badges">
          <div className="login-badge">🔒 256-bit SSL</div>
          <div className="login-badge">🛡️ 2FA Enabled</div>
          <div className="login-badge">✓ SEBI Registered</div>
        </div>
      </div>
    </div>
  );
}
