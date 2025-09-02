// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, containing uppercase, lowercase, and number
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /\d/.test(password);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

// Form validation
export const isRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const minLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

export const maxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

export const isNumber = (value: unknown): boolean => {
  return !isNaN(parseFloat(value as string)) && isFinite(value as number);
};

export const isPositiveNumber = (value: unknown): boolean => {
  const num = parseFloat(value as string);
  return isNumber(value) && num > 0;
};

export const isInteger = (value: unknown): boolean => {
  return isNumber(value) && parseInt(value as string) === parseFloat(value as string);
};

export const isPositiveInteger = (value: unknown): boolean => {
  return isInteger(value) && parseInt(value as string) > 0;
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj > now;
};

export const isPastDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj < now;
};

// Workout validation
export const isValidWeight = (weight: number): boolean => {
  return isPositiveNumber(weight) && weight <= 1000; // Reasonable upper limit
};

export const isValidReps = (reps: number): boolean => {
  return isPositiveInteger(reps) && reps <= 1000; // Reasonable upper limit
};

export const isValidDuration = (duration: number): boolean => {
  return isPositiveInteger(duration) && duration <= 600; // Max 10 hours in minutes
};

export const isValidDistance = (distance: number): boolean => {
  return isPositiveNumber(distance) && distance <= 1000000; // Reasonable upper limit in meters
};