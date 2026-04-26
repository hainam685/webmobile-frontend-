/**
 * API Client
 * Axios instance with security interceptors and error handling
 */

import axios from 'axios';
import { authService } from './authService';
import { environment } from '../config/environment';
import { getErrorMessage, HTTP_STATUS } from '../config/api';

/**
 * Create axios instance with default config
 */
const apiClient = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: environment.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

/**
 * Request interceptor
 * Adds token and CSRF protection
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Log request in development mode
    if (environment.debug) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    if (environment.debug) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles errors and auth failures
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (environment.debug) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || getErrorMessage(status);

    // Handle specific status codes
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Token expired or invalid
        authService.clearToken();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        // Redirect to login
        if (window.location.pathname !== '/admin-login' && 
            window.location.pathname !== '/login') {
          window.location.href = '/admin-login';
        }
        break;

      case HTTP_STATUS.FORBIDDEN:
        // User doesn't have permission
        window.dispatchEvent(new CustomEvent('auth:forbidden'));
        break;

      case HTTP_STATUS.TOO_MANY_REQUESTS:
        // Rate limited
        window.dispatchEvent(
          new CustomEvent('api:rateLimited', {
            detail: { retryAfter: error.response?.headers?.['retry-after'] },
          })
        );
        break;

      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        // Validation error
        window.dispatchEvent(
          new CustomEvent('api:validationError', {
            detail: error.response?.data,
          })
        );
        break;

      default:
        // Network error or server error
        if (!error.response) {
          window.dispatchEvent(
            new CustomEvent('api:networkError', {
              detail: { error: 'Network error' },
            })
          );
        }
    }

    // Log error in development mode
    if (environment.debug) {
      console.error(
        `[API Error] ${status || 'NETWORK_ERROR'} - ${message}`,
        error.response?.data
      );
    }

    // Return rejection with standardized error
    return Promise.reject({
      status,
      message,
      data: error.response?.data,
      originalError: error,
    });
  }
);

/**
 * Add event listener for logout
 */
window.addEventListener('auth:logout', () => {
  // Cancel all pending requests
  apiClient.defaults.timeout = 0;
});

/**
 * Utility function to set authorization header
 * @param {string} token - The bearer token
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

/**
 * Utility function to add custom headers
 * @param {object} headers - Headers to add
 */
export const addCustomHeaders = (headers) => {
  Object.assign(apiClient.defaults.headers.common, headers);
};

export default apiClient;
