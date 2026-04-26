/**
 * API Configuration
 * Centralized API endpoints and HTTP status codes
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    USER: '/auth/user',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  // Product endpoints
  PRODUCTS: {
    GET_ALL: '/api/products',
    GET_BY_ID: (id) => `/api/products/${id}`,
    GET_BEST_SELLING: '/api/getBestSellingProducts',
    GET_BY_CATEGORY: (category) => `/api/products/category/${category}`,
    SEARCH: '/api/products/search',
  },

  // Cart endpoints
  CART: {
    GET: '/api/getCart',
    ADD_ITEM: '/api/addItemToCart',
    REMOVE_ITEM: '/api/removeItemFromCart',
    SAVE: '/api/saveCart',
    CLEAR: '/api/clearCart',
    UPDATE_QUANTITY: '/api/updateCartQuantity',
  },

  // Order endpoints
  ORDERS: {
    CREATE: '/api/orders',
    GET_USER_ORDERS: '/api/orders/user',
    GET_ORDER: (id) => `/api/orders/${id}`,
    CANCEL: (id) => `/api/orders/${id}/cancel`,
    PAYMENT: '/api/orders/payment',
  },

  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
  },

  // Admin endpoints
  ADMIN: {
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    PROMOTIONS: '/admin/promotions',
    COMMENTS: '/admin/comments',
  },
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Get error message by status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error message
 */
export const getErrorMessage = (statusCode) => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return 'Too many requests. Please try again later.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

/**
 * Request configuration
 */
export const REQUEST_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
  RATE_LIMIT_DELAY: 60000, // 1 minute
};

export default {
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  REQUEST_CONFIG,
};
