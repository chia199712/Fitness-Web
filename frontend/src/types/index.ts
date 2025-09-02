// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Exercise related types
export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment?: string[];
  instructions?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  distance?: number; // in meters
  restTime?: number; // in seconds
  notes?: string;
  completed?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  order: number;
}

// Workout related types
export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  duration?: number; // in minutes
  notes?: string;
  templateId?: string;
  totalVolume?: number; // in kg
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, 'sets'>[];
  isPublic: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// API related types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface WorkoutForm {
  name: string;
  date: string;
  exercises: {
    exerciseId: string;
    sets: Omit<ExerciseSet, 'id'>[];
  }[];
  notes?: string;
}

// Filter and search types
export interface ExerciseFilter {
  category?: string;
  muscleGroups?: string[];
  equipment?: string[];
  search?: string;
}

export interface WorkoutFilter {
  startDate?: string;
  endDate?: string;
  templateId?: string;
  search?: string;
}

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon?: string;
  protected?: boolean;
}

// Chart and statistics types
export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  averageWorkoutDuration: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
}

export interface ProgressData {
  date: string;
  exercise: string;
  maxWeight?: number;
  totalReps?: number;
  totalVolume?: number;
}

// Dashboard types
export interface DashboardData {
  weeklyStats: {
    workouts: number;
    exercises: number;
    volume: number;
    duration: number;
  };
  monthlyStats: {
    workouts: number;
    exercises: number;
    volume: number;
    duration: number;
  };
  recentWorkouts: Workout[];
  personalRecords: PersonalRecord[];
  workoutCalendar: CalendarData[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  name: string;
  type: 'weight' | 'reps' | 'duration' | 'distance';
  value: number;
  weight: number;
  date: string;
  workoutId: string;
}

export interface CalendarData {
  date: string;
  workoutCount: number;
  hasWorkout: boolean;
}

// Settings types
export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  units: 'metric' | 'imperial';
  defaultRestTime: number;
  notifications: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    achievements: boolean;
  };
  privacy: {
    profileVisible: boolean;
    workoutsVisible: boolean;
    statsVisible: boolean;
  };
}

// Timer types
export interface Timer {
  id: string;
  type: 'workout' | 'rest' | 'exercise';
  duration: number;
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Loading state types
export interface LoadingState {
  [key: string]: boolean;
}

// Create workout session types
export interface WorkoutSession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  exercises: WorkoutExercise[];
  isActive: boolean;
  templateId?: string;
}

// Additional types for API responses
export interface DashboardOverview {
  weekly_stats: {
    workouts_completed: number;
    total_volume: number;
    exercises_performed: number;
    total_duration: number;
  };
  recent_workouts: Array<{
    date: string;
    exercises: Array<{
      name: string;
      sets: Array<{
        reps: number;
        weight?: number;
      }>;
    }>;
  }>;
  personal_records: Array<{
    exercise_name: string;
    new_max: number;
    achieved_date: string;
  }>;
  favorite_exercises: Array<{
    name: string;
    muscleGroups: string[];
    frequency: number;
  }>;
  templates: Array<{
    id: string;
    name: string;
  }>;
}

// Search related types
export interface SearchState {
  query: string;
  results: Exercise[];
  isSearching: boolean;
  hasSearched: boolean;
}

// Exercise history types
export interface ExerciseHistoryEntry {
  date: string;
  sets: ExerciseSet[];
  maxWeight?: number;
  totalVolume?: number;
  notes?: string;
}

// Template related types
export interface TemplateExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  muscleGroups: string[];
}

// Hook types
export interface UseWorkoutTemplateReturn {
  templates: WorkoutTemplate[];
  loading: boolean;
  error: string | null;
  createTemplate: (template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<WorkoutTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  useTemplate: (templateId: string) => Promise<void>;
}

// Cache types
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Component prop types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Event handler types
export type HandleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
export type HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => void;
export type HandleClick = (event: React.MouseEvent<HTMLButtonElement>) => void;