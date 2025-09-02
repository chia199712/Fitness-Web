import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * 處理驗證結果的中間件
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: '輸入驗證失敗',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : null
      }))
    });
    return;
  }
  
  next();
};


/**
 * 登入驗證規則
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('請輸入有效的電子信箱')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('請輸入密碼'),
  
  handleValidationErrors
];

/**
 * 更新用戶資訊驗證規則
 */
export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('姓名長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/)
    .withMessage('姓名只能包含中文、英文和空格'),
  
  body('preferences')
    .optional()
    .isJSON()
    .withMessage('偏好設定必須是有效的 JSON 格式'),
  
  handleValidationErrors
];

/**
 * 更改密碼驗證規則
 */
export const validateChangePassword = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('請輸入當前密碼'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('新密碼至少需要 8 個字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('新密碼必須包含至少一個小寫字母、一個大寫字母和一個數字'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('確認密碼與新密碼不匹配');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * 動作數據驗證規則
 */
export const validateExerciseData = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('動作名稱長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('動作名稱只能包含中文、英文、數字、空格和常用符號'),
  
  body('primary_muscle')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('主要肌群必須指定且長度不超過 50 個字符')
    .isIn(['胸部', '背部', '肩部', '腿部', '臀部', '二頭肌', '三頭肌', '核心', '小腿', '前臂'])
    .withMessage('主要肌群必須是有效的選項'),
  
  body('secondary_muscles')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('次要肌群長度不能超過 200 個字符'),
  
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('動作分類必須指定且長度不超過 50 個字符')
    .isIn(['複合動作', '單關節動作', '有氧運動', '伸展運動', '核心訓練', '爆發力訓練'])
    .withMessage('動作分類必須是有效的選項'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('動作描述長度不能超過 500 個字符'),
  
  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('動作說明長度不能超過 1000 個字符'),
  
  handleValidationErrors
];

/**
 * 動作更新驗證規則
 */
export const validateExerciseUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('動作名稱長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('動作名稱只能包含中文、英文、數字、空格和常用符號'),
  
  body('primary_muscle')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('主要肌群長度不超過 50 個字符')
    .isIn(['胸部', '背部', '肩部', '腿部', '臀部', '二頭肌', '三頭肌', '核心', '小腿', '前臂'])
    .withMessage('主要肌群必須是有效的選項'),
  
  body('secondary_muscles')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('次要肌群長度不能超過 200 個字符'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('動作分類長度不超過 50 個字符')
    .isIn(['複合動作', '單關節動作', '有氧運動', '伸展運動', '核心訓練', '爆發力訓練'])
    .withMessage('動作分類必須是有效的選項'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('動作描述長度不能超過 500 個字符'),
  
  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('動作說明長度不能超過 1000 個字符'),
  
  handleValidationErrors
];

/**
 * 創建訓練驗證規則
 */
export const validateCreateWorkout = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('訓練標題長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('訓練標題只能包含中文、英文、數字、空格和常用符號'),
  
  body('template_id')
    .optional()
    .isUUID()
    .withMessage('模板ID必須是有效的UUID'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('備註長度不能超過 500 個字符'),
  
  handleValidationErrors
];

/**
 * 更新訓練驗證規則
 */
export const validateUpdateWorkout = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('訓練標題長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('訓練標題只能包含中文、英文、數字、空格和常用符號'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('備註長度不能超過 500 個字符'),
  
  body('status')
    .optional()
    .isIn(['active', 'paused', 'completed', 'cancelled'])
    .withMessage('訓練狀態必須是有效的選項'),
  
  handleValidationErrors
];

/**
 * 添加訓練動作驗證規則
 */
export const validateAddWorkoutExercise = [
  body('exercise_id')
    .isUUID()
    .withMessage('動作ID必須是有效的UUID'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('備註長度不能超過 200 個字符'),
  
  handleValidationErrors
];

/**
 * 更新訓練動作驗證規則
 */
export const validateUpdateWorkoutExercise = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('備註長度不能超過 200 個字符'),
  
  handleValidationErrors
];

/**
 * 添加組數驗證規則
 */
export const validateAddSet = [
  body('weight')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('重量必須是 0-1000 之間的數字'),
  
  body('reps')
    .isInt({ min: 1, max: 1000 })
    .withMessage('次數必須是 1-1000 之間的整數'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('備註長度不能超過 100 個字符'),
  
  handleValidationErrors
];

/**
 * 更新組數驗證規則
 */
export const validateUpdateSet = [
  body('weight')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('重量必須是 0-1000 之間的數字'),
  
  body('reps')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('次數必須是 1-1000 之間的整數'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('完成狀態必須是布林值'),
  
  body('rest_time')
    .optional()
    .isInt({ min: 0, max: 3600 })
    .withMessage('休息時間必須是 0-3600 秒之間的整數'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('備註長度不能超過 100 個字符'),
  
  handleValidationErrors
];

/**
 * 創建範本驗證規則
 */
export const validateCreateTemplate = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('範本名稱長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('範本名稱只能包含中文、英文、數字、空格和常用符號'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('範本描述長度不能超過 500 個字符'),
  
  body('type')
    .isIn(['strength', 'cardio', 'flexibility', 'hiit', 'powerlifting', 'bodybuilding', 'crossfit', 'yoga', 'pilates', 'functional'])
    .withMessage('範本類型必須是有效的選項'),
  
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('範本難度必須是有效的選項'),
  
  body('visibility')
    .optional()
    .isIn(['private', 'public', 'shared'])
    .withMessage('範本可見性必須是有效的選項'),
  
  body('estimated_duration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('預估時間必須是 1-600 分鐘之間的整數'),
  
  body('target_muscle_groups')
    .optional()
    .isArray()
    .withMessage('目標肌群必須是陣列格式'),
  
  body('target_muscle_groups.*')
    .optional()
    .isIn(['胸部', '背部', '肩部', '腿部', '臀部', '二頭肌', '三頭肌', '核心', '小腿', '前臂'])
    .withMessage('目標肌群必須是有效的選項'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('標籤必須是陣列格式'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('每個標籤長度必須在 1-30 個字符之間'),
  
  handleValidationErrors
];

/**
 * 更新範本驗證規則
 */
export const validateUpdateTemplate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('範本名稱長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('範本名稱只能包含中文、英文、數字、空格和常用符號'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('範本描述長度不能超過 500 個字符'),
  
  body('type')
    .optional()
    .isIn(['strength', 'cardio', 'flexibility', 'hiit', 'powerlifting', 'bodybuilding', 'crossfit', 'yoga', 'pilates', 'functional'])
    .withMessage('範本類型必須是有效的選項'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('範本難度必須是有效的選項'),
  
  body('visibility')
    .optional()
    .isIn(['private', 'public', 'shared'])
    .withMessage('範本可見性必須是有效的選項'),
  
  body('estimated_duration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('預估時間必須是 1-600 分鐘之間的整數'),
  
  body('target_muscle_groups')
    .optional()
    .isArray()
    .withMessage('目標肌群必須是陣列格式'),
  
  body('target_muscle_groups.*')
    .optional()
    .isIn(['胸部', '背部', '肩部', '腿部', '臀部', '二頭肌', '三頭肌', '核心', '小腿', '前臂'])
    .withMessage('目標肌群必須是有效的選項'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('標籤必須是陣列格式'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('每個標籤長度必須在 1-30 個字符之間'),
  
  handleValidationErrors
];

/**
 * 添加範本動作驗證規則
 */
export const validateAddTemplateExercise = [
  body('exercise_id')
    .isUUID()
    .withMessage('動作ID必須是有效的UUID'),
  
  body('target_sets')
    .isInt({ min: 1, max: 50 })
    .withMessage('目標組數必須是 1-50 之間的整數'),
  
  body('target_reps')
    .matches(/^(\d+(-\d+)?|\d+)$/)
    .withMessage('目標次數格式無效，應為數字或範圍（如 "10" 或 "8-12"）'),
  
  body('target_weight')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('目標重量必須是 0-1000 之間的數字'),
  
  body('rest_time')
    .optional()
    .isInt({ min: 0, max: 3600 })
    .withMessage('休息時間必須是 0-3600 秒之間的整數'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('備註長度不能超過 200 個字符'),
  
  handleValidationErrors
];

/**
 * 更新範本動作驗證規則
 */
export const validateUpdateTemplateExercise = [
  body('target_sets')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('目標組數必須是 1-50 之間的整數'),
  
  body('target_reps')
    .optional()
    .matches(/^(\d+(-\d+)?|\d+)$/)
    .withMessage('目標次數格式無效，應為數字或範圍（如 "10" 或 "8-12"）'),
  
  body('target_weight')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('目標重量必須是 0-1000 之間的數字'),
  
  body('rest_time')
    .optional()
    .isInt({ min: 0, max: 3600 })
    .withMessage('休息時間必須是 0-3600 秒之間的整數'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('備註長度不能超過 200 個字符'),
  
  handleValidationErrors
];

/**
 * 套用範本驗證規則
 */
export const validateApplyTemplate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('訓練標題長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('訓練標題只能包含中文、英文、數字、空格和常用符號'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('備註長度不能超過 500 個字符'),
  
  body('scheduled_date')
    .optional()
    .isISO8601()
    .withMessage('預定日期必須是有效的日期格式'),
  
  handleValidationErrors
];

/**
 * 複製範本驗證規則
 */
export const validateDuplicateTemplate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('範本名稱長度必須在 1-100 個字符之間')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/)
    .withMessage('範本名稱只能包含中文、英文、數字、空格和常用符號'),
  
  body('visibility')
    .optional()
    .isIn(['private', 'public', 'shared'])
    .withMessage('範本可見性必須是有效的選項'),
  
  handleValidationErrors
];

/**
 * 範本收藏驗證規則
 */
export const validateToggleFavorite = [
  body('is_favorite')
    .isBoolean()
    .withMessage('收藏狀態必須是布林值'),
  
  handleValidationErrors
];

/**
 * 批量操作範本驗證規則
 */
export const validateBulkTemplateOperation = [
  body('template_ids')
    .isArray({ min: 1 })
    .withMessage('範本ID列表不能為空'),
  
  body('template_ids.*')
    .isUUID()
    .withMessage('每個範本ID必須是有效的UUID'),
  
  body('operation')
    .isIn(['delete', 'favorite', 'unfavorite', 'change_visibility'])
    .withMessage('操作類型必須是有效的選項'),
  
  body('visibility')
    .if(body('operation').equals('change_visibility'))
    .isIn(['private', 'public', 'shared'])
    .withMessage('當操作為更改可見性時，必須提供有效的可見性選項'),
  
  handleValidationErrors
];

/**
 * 儀表板日曆參數驗證規則
 */
export const validateCalendarParams = [
  query('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('年份必須是 2020-2030 之間的整數'),
  
  query('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('月份必須是 1-12 之間的整數'),
  
  handleValidationErrors
];

/**
 * 儀表板進度參數驗證規則
 */
export const validateProgressParams = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'quarter', 'year'])
    .withMessage('時間週期必須是有效的選項: week, month, quarter, year'),
  
  query('metric')
    .optional()
    .isIn(['volume', 'duration', 'workouts', 'strength'])
    .withMessage('指標類型必須是有效的選項: volume, duration, workouts, strength'),
  
  query('start_date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('開始日期格式不正確，應為 YYYY-MM-DD'),
  
  query('end_date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('結束日期格式不正確，應為 YYYY-MM-DD'),
  
  handleValidationErrors
];

/**
 * 儀表板洞察參數驗證規則
 */
export const validateInsightParams = [
  query('type')
    .optional()
    .isIn(['best_time', 'rest_analysis', 'efficiency', 'balance', 'suggestion'])
    .withMessage('洞察類型必須是有效的選項'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('優先級必須是有效的選項: low, medium, high'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('限制數量必須是 1-50 之間的整數'),
  
  handleValidationErrors
];

/**
 * 儀表板指標參數驗證規則
 */
export const validateMetricsParams = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'quarter', 'year'])
    .withMessage('時間週期必須是有效的選項: week, month, quarter, year'),
  
  handleValidationErrors
];

/**
 * 儀表板匯出參數驗證規則
 */
export const validateExportParams = [
  query('format')
    .optional()
    .isIn(['json', 'csv'])
    .withMessage('匯出格式必須是有效的選項: json, csv'),
  
  handleValidationErrors
];

/**
 * 設定驗證規則
 */
export const validateSettings = {
  /**
   * 更新完整設定驗證規則
   */
  updateSettings: [
    body('preferences')
      .optional()
      .isObject()
      .withMessage('偏好設定必須是物件格式'),
    
    body('notifications')
      .optional()
      .isObject()
      .withMessage('通知設定必須是物件格式'),
    
    body('privacy')
      .optional()
      .isObject()
      .withMessage('隱私設定必須是物件格式'),
    
    body('account')
      .optional()
      .isObject()
      .withMessage('帳戶資訊必須是物件格式'),
    
    handleValidationErrors
  ],

  /**
   * 更新偏好設定驗證規則
   */
  updatePreferences: [
    body('unit_system')
      .optional()
      .isIn(['metric', 'imperial'])
      .withMessage('單位系統必須是有效的選項: metric, imperial'),
    
    body('default_rest_time')
      .optional()
      .isInt({ min: 0, max: 3600 })
      .withMessage('預設休息時間必須是 0-3600 秒之間的整數'),
    
    body('theme')
      .optional()
      .isIn(['light', 'dark', 'auto'])
      .withMessage('主題必須是有效的選項: light, dark, auto'),
    
    body('language')
      .optional()
      .isIn(['zh-tw', 'zh-cn', 'en', 'ja'])
      .withMessage('語言必須是有效的選項: zh-tw, zh-cn, en, ja'),
    
    body('timezone')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('時區長度必須在 1-50 個字符之間'),
    
    body('workout_reminders')
      .optional()
      .isBoolean()
      .withMessage('訓練提醒必須是布林值'),
    
    body('reminder_time')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('提醒時間格式必須是 HH:MM'),
    
    body('reminder_days')
      .optional()
      .isArray()
      .withMessage('提醒日期必須是陣列格式'),
    
    body('reminder_days.*')
      .optional()
      .isInt({ min: 0, max: 6 })
      .withMessage('提醒日期必須是 0-6 之間的整數（0=週日，6=週六）'),
    
    body('auto_start_rest_timer')
      .optional()
      .isBoolean()
      .withMessage('自動開始休息計時器必須是布林值'),
    
    body('show_tutorial_tips')
      .optional()
      .isBoolean()
      .withMessage('顯示教學提示必須是布林值'),
    
    body('compact_view')
      .optional()
      .isBoolean()
      .withMessage('緊湊視圖必須是布林值'),
    
    handleValidationErrors
  ],

  /**
   * 更新通知設定驗證規則
   */
  updateNotifications: [
    body('workout_reminders')
      .optional()
      .isBoolean()
      .withMessage('訓練提醒必須是布林值'),
    
    body('achievement_notifications')
      .optional()
      .isBoolean()
      .withMessage('成就通知必須是布林值'),
    
    body('new_feature_notifications')
      .optional()
      .isBoolean()
      .withMessage('新功能通知必須是布林值'),
    
    body('email_notifications')
      .optional()
      .isBoolean()
      .withMessage('電子郵件通知必須是布林值'),
    
    body('push_notifications')
      .optional()
      .isBoolean()
      .withMessage('推送通知必須是布林值'),
    
    body('email_frequency')
      .optional()
      .isIn(['immediate', 'daily', 'weekly', 'monthly'])
      .withMessage('電子郵件頻率必須是有效的選項: immediate, daily, weekly, monthly'),
    
    body('quiet_hours_start')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('安靜時間開始格式必須是 HH:MM'),
    
    body('quiet_hours_end')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('安靜時間結束格式必須是 HH:MM'),
    
    handleValidationErrors
  ],

  /**
   * 更新隱私設定驗證規則
   */
  updatePrivacy: [
    body('profile_visibility')
      .optional()
      .isIn(['public', 'private', 'friends_only'])
      .withMessage('個人資料可見性必須是有效的選項: public, private, friends_only'),
    
    body('workout_history_visibility')
      .optional()
      .isIn(['public', 'private', 'friends_only'])
      .withMessage('訓練歷史可見性必須是有效的選項: public, private, friends_only'),
    
    body('achievements_visibility')
      .optional()
      .isIn(['public', 'private', 'friends_only'])
      .withMessage('成就可見性必須是有效的選項: public, private, friends_only'),
    
    body('allow_friend_requests')
      .optional()
      .isBoolean()
      .withMessage('允許好友請求必須是布林值'),
    
    body('show_online_status')
      .optional()
      .isBoolean()
      .withMessage('顯示線上狀態必須是布林值'),
    
    body('data_analytics_consent')
      .optional()
      .isBoolean()
      .withMessage('資料分析同意必須是布林值'),
    
    body('third_party_integrations')
      .optional()
      .isBoolean()
      .withMessage('第三方整合必須是布林值'),
    
    handleValidationErrors
  ],

  /**
   * 更新個人資料驗證規則
   */
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('姓名長度必須在 1-100 個字符之間')
      .matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/)
      .withMessage('姓名只能包含中文、英文和空格'),
    
    body('birth_date')
      .optional()
      .isISO8601()
      .withMessage('出生日期必須是有效的日期格式'),
    
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('性別必須是有效的選項: male, female, other'),
    
    body('height')
      .optional()
      .isFloat({ min: 50, max: 300 })
      .withMessage('身高必須是 50-300 公分之間的數字'),
    
    body('weight')
      .optional()
      .isFloat({ min: 20, max: 500 })
      .withMessage('體重必須是 20-500 公斤之間的數字'),
    
    body('fitness_level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('健身水平必須是有效的選項: beginner, intermediate, advanced'),
    
    body('fitness_goals')
      .optional()
      .isArray()
      .withMessage('健身目標必須是陣列格式'),
    
    body('fitness_goals.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('每個健身目標長度必須在 1-50 個字符之間'),
    
    body('contact_phone')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage('聯絡電話格式不正確'),
    
    body('emergency_contact_name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('緊急聯絡人姓名長度必須在 1-100 個字符之間'),
    
    body('emergency_contact_phone')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage('緊急聯絡人電話格式不正確'),
    
    body('profile_picture_url')
      .optional()
      .isURL()
      .withMessage('個人照片網址格式不正確'),
    
    handleValidationErrors
  ],

  /**
   * 變更密碼驗證規則
   */
  changePassword: [
    body('current_password')
      .isLength({ min: 1 })
      .withMessage('請輸入當前密碼'),
    
    body('new_password')
      .isLength({ min: 8 })
      .withMessage('新密碼至少需要 8 個字符')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('新密碼必須包含至少一個小寫字母、一個大寫字母和一個數字'),
    
    body('confirm_password')
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error('確認密碼與新密碼不匹配');
        }
        return true;
      }),
    
    handleValidationErrors
  ],

  /**
   * 刪除帳戶驗證規則
   */
  deleteAccount: [
    body('password')
      .isLength({ min: 1 })
      .withMessage('請輸入密碼'),
    
    body('confirmation')
      .equals('DELETE_MY_ACCOUNT')
      .withMessage('請輸入正確的確認字串: DELETE_MY_ACCOUNT'),
    
    body('reason')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('刪除原因長度不能超過 500 個字符'),
    
    body('feedback')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('回饋意見長度不能超過 1000 個字符'),
    
    handleValidationErrors
  ],

  /**
   * 匯出資料驗證規則
   */
  exportData: [
    body('format')
      .isIn(['json', 'csv'])
      .withMessage('匯出格式必須是有效的選項: json, csv'),
    
    body('data_types')
      .isArray({ min: 1 })
      .withMessage('資料類型列表不能為空'),
    
    body('data_types.*')
      .isIn(['workouts', 'exercises', 'templates', 'achievements', 'settings'])
      .withMessage('資料類型必須是有效的選項: workouts, exercises, templates, achievements, settings'),
    
    body('date_range')
      .optional()
      .isObject()
      .withMessage('日期範圍必須是物件格式'),
    
    body('date_range.start_date')
      .optional()
      .isISO8601()
      .withMessage('開始日期必須是有效的日期格式'),
    
    body('date_range.end_date')
      .optional()
      .isISO8601()
      .withMessage('結束日期必須是有效的日期格式'),
    
    handleValidationErrors
  ],

  /**
   * 重置設定驗證規則
   */
  resetSettings: [
    body('setting_types')
      .isArray({ min: 1 })
      .withMessage('設定類型列表不能為空'),
    
    body('setting_types.*')
      .isIn(['preferences', 'notifications', 'privacy'])
      .withMessage('設定類型必須是有效的選項: preferences, notifications, privacy'),
    
    body('confirmation')
      .isBoolean()
      .withMessage('確認標誌必須是布林值')
      .equals('true')
      .withMessage('必須確認重置操作'),
    
    handleValidationErrors
  ],

  /**
   * 恢復設定驗證規則
   */
  restoreSettings: [
    body('backup_id')
      .isUUID()
      .withMessage('備份ID必須是有效的UUID'),
    
    body('setting_types')
      .optional()
      .isArray()
      .withMessage('設定類型必須是陣列格式'),
    
    body('setting_types.*')
      .optional()
      .isIn(['preferences', 'notifications', 'privacy'])
      .withMessage('設定類型必須是有效的選項: preferences, notifications, privacy'),
    
    handleValidationErrors
  ]
};