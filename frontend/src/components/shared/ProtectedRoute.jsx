/**
 * ProtectedRoute.jsx — Role-aware route guard.
 *
 * Usage:
 *   <ProtectedRoute role="child">
 *     <Dashboard />
 *   </ProtectedRoute>
 *
 * Behaviour:
 *  - While auth is being checked  → show a full-screen spinner
 *  - Not authenticated            → redirect to /
 *  - Authenticated, wrong role    → redirect to the correct dashboard
 *  - Authenticated, correct role  → render children
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Map each role to its home dashboard path
const ROLE_HOME = {
  child:   '/dashboard',
  parent:  '/parent/dashboard',
  teacher: '/teacher/dashboard',
};

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // ── 1. Still verifying token ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={styles.splash}>
        <div style={styles.spinner} />
        <p style={styles.splashText}>Loading Lumio…</p>
      </div>
    );
  }

  // ── 2. Not logged in ───────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ── 3. Wrong role — redirect to the user's actual home ───────────────────
  if (role && user?.role !== role) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/'} replace />;
  }

  // ── 4. All good ─────────────────────────────────────────────────────────
  return children;
}

// Inline styles — minimal, no extra CSS file needed
const styles = {
  splash: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)',
    gap: '1rem',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '5px solid #e0e0e0',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  splashText: {
    color: '#667eea',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
};

// Inject the @keyframes spin rule once
if (typeof document !== 'undefined') {
  const styleId = 'lumio-spinner-keyframes';
  if (!document.getElementById(styleId)) {
    const tag = document.createElement('style');
    tag.id = styleId;
    tag.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(tag);
  }
}
