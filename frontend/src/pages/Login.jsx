import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// Map role returned by the API to the correct dashboard path
const ROLE_HOME = {
  child:   '/dashboard',
  parent:  '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

export default function Login() {
  const navigate     = useNavigate();
  const { login }    = useAuth();

  const [role, setRole]       = useState('child');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const profile = await login(email.trim(), password);
      navigate(ROLE_HOME[profile.role] ?? '/dashboard');
    } catch (err) {
      // Axios wraps the FastAPI detail in err.response.data.detail
      const detail = err.response?.data?.detail;
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 403) {
        setError('This account has been deactivated. Please contact support.');
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Role-specific label/placeholder ────────────────────────────────────────
  const getEmailLabel = () => {
    if (role === 'child') return { label: 'Email Address', placeholder: 'e.g. timmy@email.com' };
    if (role === 'parent') return { label: 'Email Address', placeholder: 'e.g. sarah@email.com' };
    return { label: 'Email Address', placeholder: 'e.g. smith@school.edu' };
  };

  const field = getEmailLabel();

  return (
    <div className="login-card">
      <div className="login-header">
        <h1>🌟 Lumio 🌟</h1>
        <p>Learning Made Fun!</p>
      </div>

      {/* Role Selector */}
      <div className="role-selector">
        <button
          className={`role-btn ${role === 'child' ? 'active child-active' : ''}`}
          onClick={() => { setRole('child'); setError(''); }}
          type="button"
        >
          🧒 Child
        </button>
        <button
          className={`role-btn ${role === 'parent' ? 'active parent-active' : ''}`}
          onClick={() => { setRole('parent'); setError(''); }}
          type="button"
        >
          👨‍👩‍👧 Parent
        </button>
        <button
          className={`role-btn ${role === 'teacher' ? 'active teacher-active' : ''}`}
          onClick={() => { setRole('teacher'); setError(''); }}
          type="button"
        >
          🎓 Teacher
        </button>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>{field.label}</label>
          <input
            type="email"
            placeholder={field.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            key={role}
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label>Password {role === 'child' && '/ Pin'}</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="login-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        <button type="submit" className="btn login-btn" disabled={isLoading}>
          {isLoading
            ? 'Signing in…'
            : role === 'child'
            ? "Let's Go! 🚀"
            : 'Sign In →'}
        </button>
      </form>

      <div className="login-footer">
        <p>Select your role above and sign in.</p>
      </div>
    </div>
  );
}
