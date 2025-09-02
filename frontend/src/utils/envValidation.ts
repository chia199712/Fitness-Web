/**
 * Frontend environment variable validation and fallback handling
 */

interface EnvConfig {
  API_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  NODE_ENV: string;
}

export function validateEnvironment(): EnvConfig {
  const warnings: string[] = [];

  // Check if API URL is set
  if (!import.meta.env.VITE_API_URL) {
    warnings.push('VITE_API_URL not set, using default: http://localhost:3000/api');
  }

  // Check if app name is set
  if (!import.meta.env.VITE_APP_NAME) {
    warnings.push('VITE_APP_NAME not set, using default: FitnessApp');
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('Frontend environment validation warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  // Return validated configuration with defaults
  const config: EnvConfig = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'FitnessApp',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    NODE_ENV: import.meta.env.NODE_ENV || 'development'
  };

  console.log('Frontend environment validation completed successfully');
  console.log(`API URL: ${config.API_URL}`);
  console.log(`App Name: ${config.APP_NAME}`);
  console.log(`Environment: ${config.NODE_ENV}`);

  return config;
}

export function getEnvConfig(): EnvConfig {
  return validateEnvironment();
}