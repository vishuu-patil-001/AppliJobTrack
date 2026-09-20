
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Welcome back! ');
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  // Demo login
  const demoLogin = async () => {
    setError('');
    const res = await login('demo@jobtrack.dev', 'demo1234');
    if (res.success) {
      toast.success('Logged in as demo user!');
      navigate('/dashboard');
    } else {
      setError('Demo account not set up yet. Please register first.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark">
            <div className="logo-icon" style={{ width: 44, height: 44, fontSize: 22 }}>🎯</div>
            <div className="logo-text" style={{ fontSize: 26 }}>Job<span>Track</span></div>
          </div>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Track your job hunt like a pro.</p>

        {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
            />
          </div>

          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <button className="btn btn-secondary" onClick={demoLogin} disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
           Try Demo Account
        </button>

        <p className="auth-divider" style={{ marginTop: 20 }}>
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/register')}>Sign up free</span>
        </p>
      </div>
    </div>
  );
}