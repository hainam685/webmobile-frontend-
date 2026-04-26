/**
 * Input Validation & Sanitization
 * Prevents XSS attacks and validates user input
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Simple implementation without external library
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Create a temporary div element to use browser's built-in HTML parser
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML;
};

/**
 * Sanitize object recursively
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }
  // RFC 5322 simplified regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 254;
};

/**
 * Validate phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid phone
 */
export const validatePhoneNumber = (phone) => {
  if (typeof phone !== 'string') {
    return false;
  }
  // Allows digits, spaces, hyphens, plus sign, parentheses
  const regex = /^[0-9\s\-\+\(\)]{10,}$/;
  return regex.test(phone);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const validateURL = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength level
 */
export const validatePasswordStrength = (password) => {
  const result = {
    isValid: false,
    strength: 'weak', // weak, fair, good, strong
    feedback: [],
    score: 0,
  };

  if (!password || typeof password !== 'string') {
    result.feedback.push('Password is required');
    return result;
  }

  if (password.length < 8) {
    result.feedback.push('Password must be at least 8 characters long');
  } else {
    result.score += 1;
  }

  if (!/[a-z]/.test(password)) {
    result.feedback.push('Password must contain lowercase letters');
  } else {
    result.score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    result.feedback.push('Password must contain uppercase letters');
  } else {
    result.score += 1;
  }

  if (!/[0-9]/.test(password)) {
    result.feedback.push('Password must contain numbers');
  } else {
    result.score += 1;
  }

  if (!/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.feedback.push('Password must contain special characters');
  } else {
    result.score += 1;
  }

  // Set strength level based on score
  if (result.score >= 5) {
    result.strength = 'strong';
    result.isValid = true;
  } else if (result.score >= 4) {
    result.strength = 'good';
    result.isValid = true;
  } else if (result.score >= 2) {
    result.strength = 'fair';
  }

  return result;
};

/**
 * Validation schema definition
 */
const ValidationRules = {
  email: {
    type: 'email',
    validate: (value) => validateEmail(value),
    message: 'Invalid email format',
  },
  phone: {
    type: 'phone',
    validate: (value) => validatePhoneNumber(value),
    message: 'Invalid phone number',
  },
  url: {
    type: 'url',
    validate: (value) => validateURL(value),
    message: 'Invalid URL format',
  },
  password: {
    type: 'password',
    validate: (value) => validatePasswordStrength(value).isValid,
    message: 'Password is too weak',
  },
  string: {
    type: 'string',
    validate: (value) => typeof value === 'string',
    message: 'Must be a string',
  },
  number: {
    type: 'number',
    validate: (value) => typeof value === 'number' && !isNaN(value),
    message: 'Must be a number',
  },
};

/**
 * Validate form data against schema
 * @param {object} data - Form data to validate
 * @param {object} schema - Validation schema
 * @returns {object} Validation result
 */
export const validateFormData = (data, schema) => {
  const result = {
    isValid: true,
    errors: {},
    data: {},
  };

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    const errors = [];

    // Check if required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rules.label || key} is required`);
      result.isValid = false;
    } else if (value === undefined || value === null || value === '') {
      // Skip validation for empty optional fields
      continue;
    }

    // Check type
    if (rules.type) {
      const rule = ValidationRules[rules.type];
      if (rule && !rule.validate(value)) {
        errors.push(rules.message || rule.message);
        result.isValid = false;
      }
    }

    // Check minLength
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(
        `${rules.label || key} must be at least ${rules.minLength} characters`
      );
      result.isValid = false;
    }

    // Check maxLength
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(
        `${rules.label || key} must not exceed ${rules.maxLength} characters`
      );
      result.isValid = false;
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || `${rules.label || key} format is invalid`);
      result.isValid = false;
    }

    // Check custom validator
    if (rules.validate && !rules.validate(value)) {
      errors.push(rules.message || `${rules.label || key} is invalid`);
      result.isValid = false;
    }

    if (errors.length > 0) {
      result.errors[key] = errors;
    } else {
      result.data[key] = value;
    }
  }

  return result;
};

/**
 * Sanitize and validate data in one step
 * @param {object} data - Data to sanitize and validate
 * @param {object} schema - Validation schema
 * @returns {object} Result with sanitized data and validation errors
 */
export const sanitizeAndValidate = (data, schema) => {
  const sanitized = sanitizeObject(data);
  return validateFormData(sanitized, schema);
};

/**
 * Escape special characters for safe display
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHTML = (text) => {
  if (typeof text !== 'string') {
    return text;
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'\/]/g, (char) => map[char]);
};

/**
 * Remove dangerous characters from filename
 * @param {string} filename - Filename to clean
 * @returns {string} Cleaned filename
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') {
    return '';
  }
  // Remove special characters that could be dangerous
  return filename.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 255);
};

export default {
  sanitizeInput,
  sanitizeObject,
  validateEmail,
  validatePhoneNumber,
  validateURL,
  validatePasswordStrength,
  validateFormData,
  sanitizeAndValidate,
  escapeHTML,
  sanitizeFilename,
};
