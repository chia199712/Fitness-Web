/**
 * Utility functions for transforming data between snake_case and camelCase
 */

// Convert snake_case to camelCase
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Convert camelCase to snake_case
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Transform object keys from snake_case to camelCase
export function transformToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformToCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      transformed[camelKey] = transformToCamelCase(value);
    }
    return transformed as T;
  }

  return obj;
}

// Transform object keys from camelCase to snake_case
export function transformToSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformToSnakeCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = toSnakeCase(key);
      transformed[snakeKey] = transformToSnakeCase(value);
    }
    return transformed as T;
  }

  return obj;
}

// Transform User object for API response
export function transformUserForResponse(user: any) {
  if (!user) return null;
  
  const transformed = transformToCamelCase(user);
  
  // Map specific fields for consistency
  if (transformed.userId) {
    transformed.id = transformed.userId;
    delete transformed.userId;
  }
  
  return transformed;
}

// Transform Exercise object for API response
export function transformExerciseForResponse(exercise: any) {
  if (!exercise) return null;
  
  const transformed = transformToCamelCase(exercise);
  
  // Map specific fields
  if (transformed.exerciseId) {
    transformed.id = transformed.exerciseId;
    delete transformed.exerciseId;
  }
  
  // Parse JSON strings if they exist
  if (typeof transformed.muscleGroups === 'string') {
    try {
      transformed.muscleGroups = JSON.parse(transformed.muscleGroups);
    } catch (e) {
      transformed.muscleGroups = [transformed.muscleGroups];
    }
  }
  
  if (typeof transformed.equipment === 'string') {
    try {
      transformed.equipment = JSON.parse(transformed.equipment);
    } catch (e) {
      transformed.equipment = [transformed.equipment];
    }
  }
  
  return transformed;
}

// Transform Workout object for API response
export function transformWorkoutForResponse(workout: any) {
  if (!workout) return null;
  
  const transformed = transformToCamelCase(workout);
  
  // Map specific fields
  if (transformed.workoutId) {
    transformed.id = transformed.workoutId;
    delete transformed.workoutId;
  }
  
  // Transform nested exercises if they exist
  if (transformed.exercises && Array.isArray(transformed.exercises)) {
    transformed.exercises = transformed.exercises.map((exercise: any) => {
      const transformedExercise = transformToCamelCase(exercise);
      
      // Map exercise ID
      if (transformedExercise.workoutExerciseId) {
        transformedExercise.id = transformedExercise.workoutExerciseId;
        delete transformedExercise.workoutExerciseId;
      }
      
      // Transform nested exercise details
      if (transformedExercise.exercise) {
        transformedExercise.exercise = transformExerciseForResponse(transformedExercise.exercise);
      }
      
      // Transform sets
      if (transformedExercise.sets && Array.isArray(transformedExercise.sets)) {
        transformedExercise.sets = transformedExercise.sets.map((set: any) => {
          const transformedSet = transformToCamelCase(set);
          if (transformedSet.setId) {
            transformedSet.id = transformedSet.setId;
            delete transformedSet.setId;
          }
          return transformedSet;
        });
      }
      
      return transformedExercise;
    });
  }
  
  return transformed;
}

// Generic API response transformer
export function createApiResponse<T>(data: T, message?: string): { success: boolean; data: T; message?: string } {
  return {
    success: true,
    data,
    message
  };
}

// Error response creator
export function createErrorResponse(message: string, code?: string) {
  return {
    success: false,
    message,
    code
  };
}