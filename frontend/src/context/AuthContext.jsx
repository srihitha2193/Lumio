/**
 * AuthContext.jsx — Global authentication state for Lumio.
 *
 * Provides:
 *   useAuth()  →  { user, isAuthenticated, isLoading, login, logout, register }
 *
 * Persistence strategy:
 *   - access_token, refresh_token, user (JSON) are stored in localStorage.
 *   - On app mount, if a token exists, we hit GET /api/auth/me to verify it
 *     and restore the user session (survives page refresh).
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { _clearAuth } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]         = useState(true);   // true until session checked

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        setIsAuthenticated(true);
      } catch {
        // Token invalid / expired and refresh also failed (interceptor handles it)
        _clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  /**
   * Authenticate with email + password.
   * Returns the TokenPair (includes role + uid) on success.
   * Throws on failure so the Login page can display error messages.
   */
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    // Persist tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    // Fetch full user profile
    const meRes = await api.get('/auth/me');
    const profile = meRes.data;

    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
    setIsAuthenticated(true);

    return profile;   // caller uses this to know which dashboard to navigate to
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Fire-and-forget — clear local state regardless
    } finally {
      _clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  /**
   * Register a new user.
   * Returns the created UserResponse on success.
   * Throws on failure (duplicate email, validation errors, etc.)
   */
  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — consume the auth context.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
