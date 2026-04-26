/**
 * Auth Service
 * Handles secure token storage, validation, and management
 */

import { environment } from '../config/environment';

class AuthService {
  constructor() {
    this.tokenKey = 'app_token';
    this.tokenHashKey = 'app_token_hash';
    this.tokenExpiryKey = 'app_token_expiry';
    this.userKey = 'app_user';
  }

  /**
   * Generate a simple hash of the token for integrity verification
   * @param {string} token - The token to hash
   * @returns {string} Hash of the token
   */
  hashToken(token) {
    try {
      return btoa(token).slice(0, 32);
    } catch (error) {
      console.error('Error hashing token:', error);
      return null;
    }
  }

  /**
   * Set token with expiration and hash verification
   * @param {string} token - The authentication token
   * @param {number} expiresIn - Expiration time in milliseconds (optional)
   */
  setToken(token) {
    if (!token || typeof token !== 'string') {
      console.warn('Invalid token provided');
      return false;
    }

    try {
      // Store token
      localStorage.setItem(this.tokenKey, token);

      // Store hash for integrity verification
      const hash = this.hashToken(token);
      if (hash) {
        localStorage.setItem(this.tokenHashKey, hash);
      }

      // Set expiration
      const expiryTime = new Date().getTime() + environment.tokenExpiration;
      localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());

      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        this.clearToken();
      } else {
        console.error('Error storing token:', error);
      }
      return false;
    }
  }

  /**
   * Get token with integrity verification
   * @returns {string|null} Token if valid, null if invalid or expired
   */
  getToken() {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const storedHash = localStorage.getItem(this.tokenHashKey);

      // Validate token exists
      if (!token) {
        return null;
      }

      // Verify integrity with hash
      if (storedHash) {
        const currentHash = this.hashToken(token);
        if (currentHash !== storedHash) {
          console.warn('Token integrity check failed');
          this.clearToken();
          return null;
        }
      }

      // Check expiration
      if (this.isTokenExpired()) {
        this.clearToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Check if token exists and is valid
   * @returns {boolean} True if token is valid
   */
  hasValidToken() {
    return this.getToken() !== null;
  }

  /**
   * Check if token is expired
   * @returns {boolean} True if token is expired
   */
  isTokenExpired() {
    try {
      const expiryTime = localStorage.getItem(this.tokenExpiryKey);
      if (!expiryTime) {
        return true;
      }

      const currentTime = new Date().getTime();
      const isExpired = currentTime > parseInt(expiryTime, 10);

      if (isExpired) {
        this.clearToken();
      }

      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Get time remaining until token expires (in milliseconds)
   * @returns {number|null} Milliseconds until expiry, or null if no token
   */
  getTokenTimeRemaining() {
    try {
      const expiryTime = localStorage.getItem(this.tokenExpiryKey);
      if (!expiryTime) {
        return null;
      }

      const currentTime = new Date().getTime();
      const remaining = parseInt(expiryTime, 10) - currentTime;

      return remaining > 0 ? remaining : 0;
    } catch (error) {
      console.error('Error calculating token time remaining:', error);
      return null;
    }
  }

  /**
   * Clear token and related data
   */
  clearToken() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenHashKey);
      localStorage.removeItem(this.tokenExpiryKey);
      localStorage.removeItem(this.userKey);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  /**
   * Store user information
   * @param {object} user - User data to store
   */
  setUser(user) {
    if (!user || typeof user !== 'object') {
      console.warn('Invalid user data provided');
      return false;
    }

    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  }

  /**
   * Get stored user information
   * @returns {object|null} User data or null
   */
  getUser() {
    try {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    return this.hasValidToken() && this.getUser() !== null;
  }

  /**
   * Logout user - clear all auth data
   */
  logout() {
    this.clearToken();
    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  /**
   * Refresh token expiration (extend session)
   */
  refreshTokenExpiry() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.setToken(token);
      return true;
    }
    return false;
  }
}

/**
 * Export singleton instance
 */
export const authService = new AuthService();

export default authService;
