// 使用者類型
export interface User {
  user_id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  preferences: string; // JSON string
}


// 登入請求類型
export interface LoginRequest {
  email: string;
  password: string;
}

// JWT Payload 類型
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// 認證回應類型
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password_hash'>;
  message?: string;
}

// 動作類型
export interface Exercise {
  exercise_id: string;
  name: string;
  primary_muscle: string;
  secondary_muscles?: string;
  category: string;
  description?: string;
  instructions?: string;
  is_system: boolean;
  user_id?: string;
  created_at: string;
}

// 動作搜尋和篩選參數
export interface ExerciseSearchParams {
  search?: string;
  category?: string;
  primary_muscle?: string;
  is_system?: boolean;
  page?: number;
  limit?: number;
}

// 動作創建請求
export interface CreateExerciseRequest {
  name: string;
  primary_muscle: string;
  secondary_muscles?: string;
  category: string;
  description?: string;
  instructions?: string;
}

// 動作更新請求
export interface UpdateExerciseRequest {
  name?: string;
  primary_muscle?: string;
  secondary_muscles?: string;
  category?: string;
  description?: string;
  instructions?: string;
}

// 訓練狀態枚舉
export enum WorkoutStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 訓練記錄類型
export interface Workout {
  workout_id: string;
  user_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  duration: number; // 秒數
  status: WorkoutStatus;
  total_volume: number;
  total_sets: number;
  total_reps: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// 訓練動作類型
export interface WorkoutExercise {
  workout_exercise_id: string;
  workout_id: string;
  exercise_id: string;
  order: number;
  notes?: string;
  created_at: string;
}

// 組數記錄類型
export interface Set {
  set_id: string;
  workout_exercise_id: string;
  set_number: number;
  weight: number;
  reps: number;
  completed: boolean;
  rest_time?: number;
  notes?: string;
  completed_at?: string;
  created_at: string;
}

// 詳細訓練記錄（包含動作和組數）
export interface WorkoutWithDetails {
  workout_id: string;
  user_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  duration: number;
  status: WorkoutStatus;
  total_volume: number;
  total_sets: number;
  total_reps: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  exercises: WorkoutExerciseWithDetails[];
}

// 訓練動作詳情（包含動作資訊和組數）
export interface WorkoutExerciseWithDetails {
  workout_exercise_id: string;
  workout_id: string;
  exercise_id: string;
  order: number;
  notes?: string;
  created_at: string;
  exercise: Exercise;
  sets: Set[];
}

// 創建訓練請求
export interface CreateWorkoutRequest {
  title: string;
  template_id?: string;
  notes?: string;
}

// 更新訓練請求
export interface UpdateWorkoutRequest {
  title?: string;
  notes?: string;
  status?: WorkoutStatus;
}

// 添加訓練動作請求
export interface AddWorkoutExerciseRequest {
  exercise_id: string;
  notes?: string;
}

// 更新訓練動作請求
export interface UpdateWorkoutExerciseRequest {
  notes?: string;
}

// 添加組數請求
export interface AddSetRequest {
  weight: number;
  reps: number;
  notes?: string;
}

// 更新組數請求
export interface UpdateSetRequest {
  weight?: number;
  reps?: number;
  completed?: boolean;
  rest_time?: number;
  notes?: string;
}

// 訓練搜尋參數
export interface WorkoutSearchParams {
  start_date?: string;
  end_date?: string;
  status?: WorkoutStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// 訓練統計
export interface WorkoutStats {
  total_workouts: number;
  total_duration: number;
  total_volume: number;
  total_sets: number;
  total_reps: number;
  average_workout_duration: number;
  favorite_exercises: {
    exercise_id: string;
    name: string;
    count: number;
  }[];
  monthly_volume: {
    month: string;
    volume: number;
  }[];
}

// 範本難度枚舉
export enum TemplateDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// 範本類型枚舉
export enum TemplateType {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  FLEXIBILITY = 'flexibility',
  HIIT = 'hiit',
  POWERLIFTING = 'powerlifting',
  BODYBUILDING = 'bodybuilding',
  CROSSFIT = 'crossfit',
  YOGA = 'yoga',
  PILATES = 'pilates',
  FUNCTIONAL = 'functional'
}

// 範本分享狀態
export enum TemplateVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  SHARED = 'shared'
}

// 訓練計畫/範本類型
export interface Template {
  template_id: string;
  user_id: string;
  name: string;
  description?: string;
  type: TemplateType;
  difficulty: TemplateDifficulty;
  visibility: TemplateVisibility;
  estimated_duration: number; // 分鐘
  target_muscle_groups?: string; // JSON array string
  tags?: string; // JSON array string
  use_count: number;
  rating: number;
  rating_count: number;
  last_used_at?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

// 計畫動作類型
export interface TemplateExercise {
  template_exercise_id: string;
  template_id: string;
  exercise_id: string;
  target_sets: number;
  target_reps: string; // "8-12" 或 "10"
  target_weight?: number;
  rest_time?: number; // 秒數
  order: number;
  notes?: string;
  created_at: string;
}

// 範本詳情（包含動作）
export interface TemplateWithDetails {
  template_id: string;
  user_id: string;
  name: string;
  description?: string;
  type: TemplateType;
  difficulty: TemplateDifficulty;
  visibility: TemplateVisibility;
  estimated_duration: number;
  target_muscle_groups?: string[];
  tags?: string[];
  use_count: number;
  rating: number;
  rating_count: number;
  last_used_at?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  exercises: TemplateExerciseWithDetails[];
}

// 範本動作詳情（包含動作資訊）
export interface TemplateExerciseWithDetails {
  template_exercise_id: string;
  template_id: string;
  exercise_id: string;
  target_sets: number;
  target_reps: string;
  target_weight?: number;
  rest_time?: number;
  order: number;
  notes?: string;
  created_at: string;
  exercise: Exercise;
}

// 創建範本請求
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  type: TemplateType;
  difficulty: TemplateDifficulty;
  visibility?: TemplateVisibility;
  estimated_duration?: number;
  target_muscle_groups?: string[];
  tags?: string[];
}

// 更新範本請求
export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  type?: TemplateType;
  difficulty?: TemplateDifficulty;
  visibility?: TemplateVisibility;
  estimated_duration?: number;
  target_muscle_groups?: string[];
  tags?: string[];
}

// 添加範本動作請求
export interface AddTemplateExerciseRequest {
  exercise_id: string;
  target_sets: number;
  target_reps: string;
  target_weight?: number;
  rest_time?: number;
  notes?: string;
}

// 更新範本動作請求
export interface UpdateTemplateExerciseRequest {
  target_sets?: number;
  target_reps?: string;
  target_weight?: number;
  rest_time?: number;
  notes?: string;
}

// 範本搜尋參數
export interface TemplateSearchParams {
  search?: string;
  type?: TemplateType;
  difficulty?: TemplateDifficulty;
  visibility?: TemplateVisibility;
  tags?: string[];
  user_id?: string;
  is_favorite?: boolean;
  sort_by?: 'name' | 'created_at' | 'use_count' | 'rating' | 'last_used_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// 套用範本請求
export interface ApplyTemplateRequest {
  title?: string;
  notes?: string;
  scheduled_date?: string;
}

// 複製範本請求
export interface DuplicateTemplateRequest {
  name?: string;
  visibility?: TemplateVisibility;
}

// 範本統計
export interface TemplateStats {
  total_templates: number;
  public_templates: number;
  private_templates: number;
  favorite_templates: number;
  most_used_template?: {
    template_id: string;
    name: string;
    use_count: number;
  };
  recent_templates: {
    template_id: string;
    name: string;
    last_used_at: string;
  }[];
  template_types: {
    type: TemplateType;
    count: number;
  }[];
}

// 範本評分請求
export interface RateTemplateRequest {
  rating: number; // 1-5
  comment?: string;
}

// 範本收藏請求
export interface ToggleFavoriteRequest {
  is_favorite: boolean;
}

// 批量操作範本請求
export interface BulkTemplateOperation {
  template_ids: string[];
  operation: 'delete' | 'favorite' | 'unfavorite' | 'change_visibility';
  visibility?: TemplateVisibility;
}

// 週期計畫類型
export interface WeeklyPlan {
  plan_id: string;
  user_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 週期計畫日程
export interface WeeklyPlanSchedule {
  schedule_id: string;
  plan_id: string;
  template_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  week_number?: number;
  notes?: string;
  created_at: string;
}

// 成就類型枚舉
export enum AchievementType {
  WORKOUT_COUNT = 'workout_count',
  TOTAL_VOLUME = 'total_volume',
  STREAK_DAYS = 'streak_days',
  PERSONAL_RECORD = 'personal_record',
  MILESTONE = 'milestone'
}

// 成就狀態枚舉
export enum AchievementStatus {
  LOCKED = 'locked',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// 成就類型
export interface Achievement {
  achievement_id: string;
  name: string;
  description: string;
  type: AchievementType;
  target_value: number;
  current_value: number;
  status: AchievementStatus;
  icon: string;
  reward_points?: number;
  unlocked_at?: string;
  created_at: string;
}

// 個人記錄類型
export interface PersonalRecord {
  pr_id: string;
  user_id: string;
  exercise_id: string;
  exercise_name: string;
  max_weight: number;
  max_reps: number;
  max_volume: number; // weight * reps
  achieved_at: string;
  workout_id: string;
  previous_record?: {
    weight: number;
    reps: number;
    volume: number;
    achieved_at: string;
  };
}

// 訓練洞察類型
export interface WorkoutInsight {
  insight_id: string;
  type: 'best_time' | 'rest_analysis' | 'efficiency' | 'balance' | 'suggestion';
  title: string;
  description: string;
  data: any;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

// 進度追蹤類型
export interface ProgressTracking {
  date: string;
  total_volume: number;
  total_workouts: number;
  average_duration: number;
  strength_index: number;
  consistency_score: number;
}

// 訓練日曆項目
export interface CalendarItem {
  date: string;
  workout_count: number;
  total_duration: number;
  total_volume: number;
  workouts: {
    workout_id: string;
    title: string;
    duration: number;
    status: WorkoutStatus;
  }[];
  is_rest_day: boolean;
}

// 儀表板總覽
export interface DashboardOverview {
  user: {
    name: string;
    streak_days: number;
    total_workouts: number;
    member_since: string;
  };
  current_week: {
    workouts_completed: number;
    total_duration: number;
    total_volume: number;
    goal_progress: number; // 百分比
  };
  recent_achievements: Achievement[];
  quick_stats: {
    this_month_workouts: number;
    this_month_volume: number;
    favorite_exercise: string;
    avg_workout_duration: number;
  };
  upcoming_milestones: {
    type: string;
    current: number;
    target: number;
    progress: number;
  }[];
}

// 儀表板統計
export interface DashboardStats {
  overview: {
    total_workouts: number;
    total_duration: number; // 總時長（分鐘）
    total_volume: number; // 總重量
    total_sets: number;
    total_reps: number;
    average_workout_duration: number;
    current_streak: number;
    longest_streak: number;
  };
  this_week: {
    workouts: number;
    duration: number;
    volume: number;
    sets: number;
    reps: number;
  };
  this_month: {
    workouts: number;
    duration: number;
    volume: number;
    sets: number;
    reps: number;
  };
  trends: {
    workout_frequency: {
      period: string;
      workouts: number;
    }[];
    volume_progression: {
      period: string;
      volume: number;
    }[];
    duration_trends: {
      period: string;
      duration: number;
    }[];
  };
  muscle_group_distribution: {
    muscle_group: string;
    percentage: number;
    total_sets: number;
  }[];
  favorite_exercises: {
    exercise_id: string;
    exercise_name: string;
    times_performed: number;
    total_volume: number;
    avg_weight: number;
  }[];
}

// 近期訓練
export interface RecentWorkout {
  workout_id: string;
  title: string;
  date: string;
  duration: number;
  total_volume: number;
  total_sets: number;
  status: WorkoutStatus;
  exercises_count: number;
  highlights: string[]; // 亮點，如 "新的個人記錄"
}

// 訓練日曆查詢參數
export interface CalendarParams {
  year: number;
  month: number;
}

// 進度查詢參數
export interface ProgressParams {
  period: 'week' | 'month' | 'quarter' | 'year';
  metric: 'volume' | 'duration' | 'workouts' | 'strength';
  start_date?: string;
  end_date?: string;
}

// 洞察查詢參數
export interface InsightParams {
  type?: 'best_time' | 'rest_analysis' | 'efficiency' | 'balance' | 'suggestion';
  priority?: 'low' | 'medium' | 'high';
  limit?: number;
}

// 儀表板資料快取
export interface DashboardCache {
  user_id: string;
  cache_key: string;
  data: any;
  expires_at: string;
  created_at: string;
}

// 單位系統枚舉
export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

// 主題模式枚舉
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// 語言枚舉
export enum Language {
  ZH_TW = 'zh-tw',
  ZH_CN = 'zh-cn',
  EN = 'en',
  JA = 'ja'
}

// 通知類型枚舉
export enum NotificationType {
  WORKOUT_REMINDER = 'workout_reminder',
  ACHIEVEMENT = 'achievement',
  NEW_FEATURE = 'new_feature',
  EMAIL = 'email'
}

// 資料隱私設定枚舉
export enum PrivacySetting {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only'
}

// 使用者偏好設定
export interface UserPreferences {
  unit_system: UnitSystem;
  default_rest_time: number; // 秒
  theme: ThemeMode;
  language: Language;
  timezone: string;
  workout_reminders: boolean;
  reminder_time?: string; // HH:MM format
  reminder_days?: number[]; // 0-6 (Sunday-Saturday)
  auto_start_rest_timer: boolean;
  show_tutorial_tips: boolean;
  compact_view: boolean;
}

// 通知設定
export interface NotificationSettings {
  workout_reminders: boolean;
  achievement_notifications: boolean;
  new_feature_notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  email_frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  quiet_hours_start?: string; // HH:MM format
  quiet_hours_end?: string; // HH:MM format
}

// 隱私設定
export interface PrivacySettings {
  profile_visibility: PrivacySetting;
  workout_history_visibility: PrivacySetting;
  achievements_visibility: PrivacySetting;
  allow_friend_requests: boolean;
  show_online_status: boolean;
  data_analytics_consent: boolean;
  third_party_integrations: boolean;
}

// 帳戶資訊
export interface AccountInfo {
  name: string;
  email: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  fitness_goals?: string[];
  contact_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_picture_url?: string;
}

// 安全設定
export interface SecuritySettings {
  two_factor_enabled: boolean;
  password_last_changed: string;
  active_sessions: {
    session_id: string;
    device_info: string;
    location: string;
    last_activity: string;
    is_current: boolean;
  }[];
  login_history: {
    login_time: string;
    device_info: string;
    location: string;
    ip_address: string;
    success: boolean;
  }[];
}

// 完整的使用者設定
export interface UserSettings {
  user_id: string;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  account: AccountInfo;
  security: SecuritySettings;
  created_at: string;
  updated_at: string;
  settings_version: number;
}

// 設定更新請求類型
export interface UpdatePreferencesRequest {
  unit_system?: UnitSystem;
  default_rest_time?: number;
  theme?: ThemeMode;
  language?: Language;
  timezone?: string;
  workout_reminders?: boolean;
  reminder_time?: string;
  reminder_days?: number[];
  auto_start_rest_timer?: boolean;
  show_tutorial_tips?: boolean;
  compact_view?: boolean;
}

export interface UpdateNotificationSettingsRequest {
  workout_reminders?: boolean;
  achievement_notifications?: boolean;
  new_feature_notifications?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  email_frequency?: 'immediate' | 'daily' | 'weekly' | 'monthly';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface UpdatePrivacySettingsRequest {
  profile_visibility?: PrivacySetting;
  workout_history_visibility?: PrivacySetting;
  achievements_visibility?: PrivacySetting;
  allow_friend_requests?: boolean;
  show_online_status?: boolean;
  data_analytics_consent?: boolean;
  third_party_integrations?: boolean;
}

export interface UpdateAccountInfoRequest {
  name?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  fitness_goals?: string[];
  contact_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_picture_url?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface Enable2FARequest {
  password: string;
  backup_codes?: string[];
}

export interface Verify2FARequest {
  code: string;
}

// 資料匯出請求
export interface ExportDataRequest {
  format: 'json' | 'csv';
  data_types: ('workouts' | 'exercises' | 'templates' | 'achievements' | 'settings')[];
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

// 匯出資料回應
export interface ExportDataResponse {
  export_id: string;
  download_url: string;
  expires_at: string;
  file_size: number;
  format: string;
}

// 帳戶刪除請求
export interface DeleteAccountRequest {
  password: string;
  confirmation: string; // 必須是 "DELETE_MY_ACCOUNT"
  reason?: string;
  feedback?: string;
}

// 設定重置請求
export interface ResetSettingsRequest {
  setting_types: ('preferences' | 'notifications' | 'privacy')[];
  confirmation: boolean;
}

// 使用統計
export interface UsageStatistics {
  total_workouts: number;
  total_workout_time: number; // 分鐘
  total_exercises_performed: number;
  most_used_exercises: {
    exercise_id: string;
    exercise_name: string;
    times_used: number;
  }[];
  workout_frequency: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  monthly_activity: {
    month: string;
    workout_count: number;
    total_time: number;
  }[];
  achievement_count: number;
  data_storage_usage: number; // MB
  account_age_days: number;
}

// 設定備份
export interface SettingsBackup {
  backup_id: string;
  user_id: string;
  settings_snapshot: UserSettings;
  backup_date: string;
  backup_type: 'manual' | 'automatic';
  description?: string;
}

// 設定恢復請求
export interface RestoreSettingsRequest {
  backup_id: string;
  setting_types?: ('preferences' | 'notifications' | 'privacy')[];
}

// API 回應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}