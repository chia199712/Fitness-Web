/**
 * Environment variable validation and fallback handling
 */

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
  GOOGLE_SPREADSHEET_ID?: string;
  GOOGLE_CLIENT_EMAIL?: string;
  GOOGLE_PRIVATE_KEY?: string;
}

const requiredEnvVars = [
  'JWT_SECRET'
];

const optionalEnvVars = [
  'GOOGLE_SPREADSHEET_ID',
  'GOOGLE_CLIENT_EMAIL', 
  'GOOGLE_PRIVATE_KEY'
];

export function validateEnvironment(): EnvConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Check optional environment variables that affect functionality
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(`Missing optional environment variable: ${envVar} - Google Sheets functionality will not work`);
    }
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('Environment validation warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  // Throw errors if any required variables are missing
  if (errors.length > 0) {
    console.error('Environment validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }

  // Return validated configuration with defaults
  const config: EnvConfig = {
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
  };

  // Validate PORT
  if (isNaN(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    throw new Error('PORT must be a valid number between 1 and 65535');
  }

  // Validate BCRYPT_SALT_ROUNDS
  if (isNaN(config.BCRYPT_SALT_ROUNDS) || config.BCRYPT_SALT_ROUNDS < 10 || config.BCRYPT_SALT_ROUNDS > 20) {
    console.warn('BCRYPT_SALT_ROUNDS should be between 10 and 20, using default value of 12');
    config.BCRYPT_SALT_ROUNDS = 12;
  }

  console.log('Environment validation completed successfully');
  console.log(`Server will run on port: ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`Google Sheets integration: ${config.GOOGLE_SPREADSHEET_ID ? 'enabled' : 'disabled'}`);

  return config;
}

export function getEnvConfig(): EnvConfig {
  return validateEnvironment();
}