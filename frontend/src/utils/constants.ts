// API Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  WORKOUTS: {
    BASE: '/workouts',
    STATS: '/workouts/stats',
  },
  EXERCISES: {
    BASE: '/exercises',
    CATEGORIES: '/exercises/categories',
    MUSCLE_GROUPS: '/exercises/muscle-groups',
    EQUIPMENT: '/exercises/equipment',
    SEARCH: '/exercises/search',
  },
  TEMPLATES: {
    BASE: '/templates',
    CREATE_WORKOUT: (id: string) => `/templates/${id}/create-workout`,
  },
} as const;

// Exercise Categories
export const EXERCISE_CATEGORIES = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Balance',
  'Sport',
  'Other',
] as const;

// Muscle Groups
export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Biceps',
  'Triceps',
  'Forearms',
  'Core',
  'Abs',
  'Obliques',
  'Legs',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Full Body',
] as const;

// Equipment Types
export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Resistance Band',
  'Cable Machine',
  'Smith Machine',
  'Bodyweight',
  'Treadmill',
  'Stationary Bike',
  'Elliptical',
  'Rowing Machine',
  'Medicine Ball',
  'Stability Ball',
  'Other',
] as const;

// Units
export const WEIGHT_UNITS = ['kg', 'lbs'] as const;
export const DISTANCE_UNITS = ['m', 'km', 'ft', 'mi'] as const;

// Default Values
export const DEFAULT_VALUES = {
  WORKOUT_DURATION: 60, // minutes
  REST_TIME: 60, // seconds
  SETS: 3,
  REPS: 12,
  WEIGHT: 50, // kg
  PAGE_SIZE: {
    WORKOUTS: 10,
    EXERCISES: 12,
    TEMPLATES: 12,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  WORKOUT_DRAFT: 'workoutDraft',
  THEME: 'theme',
} as const;

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    WARNING: 'yellow',
    DANGER: 'red',
    GRAY: 'gray',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  WORKOUT: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    NOTES: {
      MAX_LENGTH: 1000,
    },
    MAX_EXERCISES: 50,
    MAX_SETS: 100,
  },
  EXERCISE: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
    },
    INSTRUCTIONS: {
      MAX_LENGTH: 2000,
    },
  },
  SET: {
    REPS: {
      MIN: 1,
      MAX: 1000,
    },
    WEIGHT: {
      MIN: 0,
      MAX: 1000,
    },
    DURATION: {
      MIN: 1,
      MAX: 36000, // 10 hours in seconds
    },
    DISTANCE: {
      MIN: 0,
      MAX: 1000000, // 1000km in meters
    },
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  INVALID_NUMBER: 'Must be a valid number',
  POSITIVE_NUMBER: 'Must be a positive number',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  WORKOUT_CREATED: 'Workout created successfully',
  WORKOUT_UPDATED: 'Workout updated successfully',
  WORKOUT_DELETED: 'Workout deleted successfully',
  TEMPLATE_CREATED: 'Template created successfully',
  TEMPLATE_UPDATED: 'Template updated successfully',
  TEMPLATE_DELETED: 'Template deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTRATION_SUCCESS: 'Account created successfully',
} as const;