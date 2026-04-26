/**
 * Safe localStorage Wrapper
 * Provides safe access to localStorage with error handling and optional expiration
 */

/**
 * Storage Manager Class
 */
class StorageManager {
  constructor() {
    this.prefix = 'app_';
    this.expirationSuffix = '_exp';
  }

  /**
   * Create prefixed key
   * @param {string} key - The key
   * @returns {string} Prefixed key
   */
  prefixKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Get expiration key
   * @param {string} key - The key
   * @returns {string} Expiration key
   */
  getExpirationKey(key) {
    return `${this.prefixKey(key)}${this.expirationSuffix}`;
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if localStorage is available
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error.message);
      return false;
    }
  }

  /**
   * Set item in storage
   * @param {string} key - The key
   * @param {*} value - The value (will be JSON stringified)
   * @returns {boolean} Success or failure
   */
  setItem(key, value) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const prefixedKey = this.prefixKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded, clearing old data');
        this.clearOldData();
        // Try again after clearing
        try {
          const prefixedKey = this.prefixKey(key);
          localStorage.setItem(prefixedKey, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error('Error setting item after cleanup:', retryError);
          return false;
        }
      } else {
        console.error('Error setting item:', error);
        return false;
      }
    }
  }

  /**
   * Get item from storage
   * @param {string} key - The key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} The stored value or default
   */
  getItem(key, defaultValue = null) {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const prefixedKey = this.prefixKey(key);
      const item = localStorage.getItem(prefixedKey);

      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item);
    } catch (error) {
      console.error('Error getting item:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - The key
   * @returns {boolean} Success or failure
   */
  removeItem(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const prefixedKey = this.prefixKey(key);
      localStorage.removeItem(prefixedKey);
      
      // Also remove expiration key
      const expirationKey = this.getExpirationKey(key);
      localStorage.removeItem(expirationKey);
      
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  }

  /**
   * Set item with expiration
   * @param {string} key - The key
   * @param {*} value - The value
   * @param {number} expirationMs - Expiration time in milliseconds
   * @returns {boolean} Success or failure
   */
  setItemWithExpiration(key, value, expirationMs) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const prefixedKey = this.prefixKey(key);
      const expirationKey = this.getExpirationKey(key);
      const expirationTime = new Date().getTime() + expirationMs;

      localStorage.setItem(prefixedKey, JSON.stringify(value));
      localStorage.setItem(expirationKey, expirationTime.toString());

      return true;
    } catch (error) {
      console.error('Error setting item with expiration:', error);
      return false;
    }
  }

  /**
   * Get item with expiration checking
   * @param {string} key - The key
   * @param {*} defaultValue - Default value if expired or not found
   * @returns {*} The stored value or default
   */
  getItemWithExpiration(key, defaultValue = null) {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const prefixedKey = this.prefixKey(key);
      const expirationKey = this.getExpirationKey(key);

      const item = localStorage.getItem(prefixedKey);
      const expiration = localStorage.getItem(expirationKey);

      // Item doesn't exist
      if (item === null) {
        return defaultValue;
      }

      // Check expiration
      if (expiration) {
        const currentTime = new Date().getTime();
        if (currentTime > parseInt(expiration, 10)) {
          // Item has expired
          this.removeItem(key);
          return defaultValue;
        }
      }

      return JSON.parse(item);
    } catch (error) {
      console.error('Error getting item with expiration:', error);
      return defaultValue;
    }
  }

  /**
   * Clear all storage items with app prefix
   * @returns {boolean} Success or failure
   */
  clear() {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = this.keys();
      keys.forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get all keys in storage with app prefix
   * @returns {string[]} Array of keys
   */
  keys() {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          // Remove prefix for return
          keys.push(key.replace(this.prefix, ''));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  /**
   * Get size of storage in bytes
   * @returns {number} Size in bytes
   */
  getSize() {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      let size = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = localStorage.getItem(key);
        if (key && item) {
          size += key.length + item.length;
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating size:', error);
      return 0;
    }
  }

  /**
   * Clear old expired items
   */
  clearOldData() {
    if (!this.isAvailable()) {
      return;
    }

    try {
      const currentTime = new Date().getTime();
      const keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(this.expirationSuffix)) {
          const expiration = parseInt(localStorage.getItem(key), 10);
          if (currentTime > expiration) {
            const originalKey = key.replace(this.prefix, '').replace(this.expirationSuffix, '');
            keysToRemove.push(originalKey);
          }
        }
      }

      keysToRemove.forEach((key) => {
        this.removeItem(key);
      });

      if (environment.debug && keysToRemove.length > 0) {
        console.log(`Cleared ${keysToRemove.length} expired items from storage`);
      }
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }

  /**
   * Check if key exists
   * @param {string} key - The key
   * @returns {boolean} True if key exists
   */
  hasKey(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const prefixedKey = this.prefixKey(key);
      return localStorage.getItem(prefixedKey) !== null;
    } catch (error) {
      console.error('Error checking key:', error);
      return false;
    }
  }
}

/**
 * Export singleton instance
 */
export const storageManager = new StorageManager();

export default storageManager;
