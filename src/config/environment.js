/**
 * Environment Configuration
 * Validates and provides typed access to environment variables
 */

const requiredEnvVars = ['VITE_API_BASE_URL'];
const optionalEnvVars = {
  VITE_ENCRYPTION_KEY: 'default-encryption-key',
  VITE_DEBUG: 'false',
  VITE_API_TIMEOUT: '30000',
  VITE_TOKEN_EXPIRATION: '86400000', // 24 hours
};

// Validate required variables
requiredEnvVars.forEach((envVar) => {
  if (!import.meta.env[envVar]) {
    const message = `Missing required environment variable: ${envVar}`;
    console.error(message);
    if (import.meta.env.MODE === 'production') {
      throw new Error(message);
    }
  }
});

/**
 * Environment configuration object
 */
export const environment = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  
  // Security
  encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || 'default-encryption-key',
  tokenExpiration: parseInt(import.meta.env.VITE_TOKEN_EXPIRATION || '86400000', 10),
  
  // Debug
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  debug: import.meta.env.VITE_DEBUG === 'true',
  
  // Validation
  validate() {
    const errors = [];
    
    if (!this.apiBaseUrl) {
      errors.push('API base URL is not configured');
    }
    
    if (this.apiTimeout < 1000 || this.apiTimeout > 120000) {
      errors.push('API timeout should be between 1000 and 120000 milliseconds');
    }
    
    if (errors.length > 0) {
      throw new Error(`Environment configuration errors:\n${errors.join('\n')}`);
    }
  },
};

// Validate on load
environment.validate();

export default environment;
