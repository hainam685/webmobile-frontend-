/**
 * Common Helper Functions
 * Utilities for formatting, string manipulation, and object operations
 */

/**
 * Format number as currency
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  } catch {
    return '';
  }
};

/**
 * Format date and time to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date, locale = 'en-US') => {
  if (!date) return '';

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(dateObj);
  } catch {
    return '';
  }
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix (default: ...)
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50, suffix = '...') => {
  if (typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to URL slug
 * @param {string} str - String to convert
 * @returns {string} URL-safe slug
 */
export const toSlug = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
};

/**
 * Deep merge two objects
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} Merged object
 */
export const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object') {
    return target;
  }

  const merged = deepClone(target) || {};

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        !(source[key] instanceof Date)
      ) {
        merged[key] = deepMerge(merged[key] || {}, source[key]);
      } else {
        merged[key] = deepClone(source[key]);
      }
    }
  }

  return merged;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {object} Grouped object
 */
export const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) return {};

  return arr.reduce((grouped, item) => {
    const groupKey = item[key];
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
    return grouped;
  }, {});
};

/**
 * Get unique values from array
 * @param {Array} arr - Array to filter
 * @param {string} key - Optional key to check uniqueness by
 * @returns {Array} Unique array
 */
export const unique = (arr, key) => {
  if (!Array.isArray(arr)) return [];

  if (key) {
    return arr.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  }

  return [...new Set(arr)];
};

/**
 * Flatten nested array
 * @param {Array} arr - Array to flatten
 * @param {number} depth - Depth to flatten (default: Infinity)
 * @returns {Array} Flattened array
 */
export const flatten = (arr, depth = Infinity) => {
  if (!Array.isArray(arr)) return [];

  if (depth === 0) return arr;

  return arr.reduce((flat, item) => {
    if (Array.isArray(item)) {
      return flat.concat(flatten(item, depth - 1));
    }
    return flat.concat(item);
  }, []);
};

/**
 * Check if two objects are equal
 * @param {*} obj1 - First object
 * @param {*} obj2 - Second object
 * @returns {boolean} True if equal
 */
export const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => isEqual(obj1[key], obj2[key]));
};

/**
 * Pick specific keys from object
 * @param {object} obj - Object to pick from
 * @param {string[]} keys - Keys to pick
 * @returns {object} New object with picked keys
 */
export const pick = (obj, keys = []) => {
  if (typeof obj !== 'object' || !Array.isArray(keys)) {
    return {};
  }

  return keys.reduce((picked, key) => {
    if (key in obj) {
      picked[key] = obj[key];
    }
    return picked;
  }, {});
};

/**
 * Omit specific keys from object
 * @param {object} obj - Object to omit from
 * @param {string[]} keys - Keys to omit
 * @returns {object} New object without omitted keys
 */
export const omit = (obj, keys = []) => {
  if (typeof obj !== 'object' || !Array.isArray(keys)) {
    return obj;
  }

  const keySet = new Set(keys);
  return Object.keys(obj).reduce((omitted, key) => {
    if (!keySet.has(key)) {
      omitted[key] = obj[key];
    }
    return omitted;
  }, {});
};

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Retry async function
 * @param {Function} func - Async function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Promise
 */
export const retry = async (func, retries = 3, delay = 1000) => {
  try {
    return await func();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(func, retries - 1, delay);
  }
};

/**
 * Wait for milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Resolved promise
 */
export const wait = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  truncateString,
  capitalize,
  toSlug,
  deepClone,
  deepMerge,
  debounce,
  throttle,
  groupBy,
  unique,
  flatten,
  isEqual,
  pick,
  omit,
  isEmpty,
  retry,
  wait,
};
