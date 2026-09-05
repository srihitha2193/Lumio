/**
 * api.js — Central API client for Lumio frontend.
 *
 * Features:
 *  - Automatically attaches the JWT access token on every request
 *  - On 401 (token expired), silently tries to refresh using the refresh token
 *  - If refresh fails (both tokens expired), clears storage and redirects to login
 */
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach access token ─────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle token expiry ────────────────────────────────
let _isRefreshing = false;
let _pendingQueue = [];   // requests queued while refresh is in progress

const processQueue = (error, token = null) => {
  _pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  _pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors that haven't already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (_isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          _pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      _isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No refresh token → force logout
        _clearAuth();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = data.access_token;
        localStorage.setItem('access_token', newAccessToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        _clearAuth();
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Helpers ──────────────────────────────────────────────────────────────────

export function _clearAuth() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

export default api;
