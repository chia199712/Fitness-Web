# 個人設定 API 文檔

## 概述

個人設定模組提供完整的用戶設定管理功能，包括偏好設定、通知設定、隱私設定、帳戶管理、資料匯出和備份恢復等功能。

## 認證

所有設定相關的 API 端點都需要 Bearer Token 認證：

```
Authorization: Bearer <JWT_TOKEN>
```

## API 端點

### 1. 完整設定管理

#### 取得用戶完整設定

```http
GET /api/settings
```

**回應：**
```json
{
  "success": true,
  "data": {
    "user_id": "user-uuid",
    "preferences": {
      "unit_system": "metric",
      "default_rest_time": 90,
      "theme": "auto",
      "language": "zh-tw",
      "timezone": "Asia/Taipei",
      "workout_reminders": true,
      "reminder_time": "08:00",
      "reminder_days": [1, 3, 5],
      "auto_start_rest_timer": true,
      "show_tutorial_tips": true,
      "compact_view": false
    },
    "notifications": {
      "workout_reminders": true,
      "achievement_notifications": true,
      "new_feature_notifications": true,
      "email_notifications": false,
      "push_notifications": true,
      "email_frequency": "weekly",
      "quiet_hours_start": "22:00",
      "quiet_hours_end": "07:00"
    },
    "privacy": {
      "profile_visibility": "public",
      "workout_history_visibility": "private",
      "achievements_visibility": "public",
      "allow_friend_requests": true,
      "show_online_status": true,
      "data_analytics_consent": true,
      "third_party_integrations": false
    },
    "account": {
      "name": "使用者姓名",
      "email": "user@example.com",
      "birth_date": "1990-01-01",
      "gender": "male",
      "height": 175,
      "weight": 70,
      "fitness_level": "intermediate",
      "fitness_goals": ["增肌", "減脂"],
      "contact_phone": "+886912345678"
    },
    "security": {
      "two_factor_enabled": false,
      "password_last_changed": "2023-01-01T00:00:00.000Z"
    },
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "settings_version": 1
  },
  "message": "成功獲取用戶設定"
}
```

#### 更新用戶完整設定

```http
PUT /api/settings
```

**請求：**
```json
{
  "preferences": {
    "unit_system": "imperial",
    "default_rest_time": 120
  },
  "notifications": {
    "workout_reminders": false
  },
  "privacy": {
    "profile_visibility": "private"
  },
  "account": {
    "name": "新的姓名",
    "height": 180
  }
}
```

### 2. 偏好設定管理

#### 取得偏好設定

```http
GET /api/settings/preferences
```

#### 更新偏好設定

```http
PUT /api/settings/preferences
```

**請求：**
```json
{
  "unit_system": "metric",
  "default_rest_time": 90,
  "theme": "dark",
  "language": "zh-tw",
  "timezone": "Asia/Taipei",
  "workout_reminders": true,
  "reminder_time": "08:00",
  "reminder_days": [1, 3, 5],
  "auto_start_rest_timer": true,
  "show_tutorial_tips": false,
  "compact_view": true
}
```

**偏好設定欄位說明：**
- `unit_system`: 單位系統 (`"metric"` | `"imperial"`)
- `default_rest_time`: 預設休息時間（秒）
- `theme`: 主題模式 (`"light"` | `"dark"` | `"auto"`)
- `language`: 語言 (`"zh-tw"` | `"zh-cn"` | `"en"` | `"ja"`)
- `timezone`: 時區字串
- `workout_reminders`: 是否啟用訓練提醒
- `reminder_time`: 提醒時間 (HH:MM 格式)
- `reminder_days`: 提醒日期陣列 (0-6，0=週日)
- `auto_start_rest_timer`: 自動開始休息計時器
- `show_tutorial_tips`: 顯示教學提示
- `compact_view`: 緊湊視圖模式

### 3. 通知設定管理

#### 取得通知設定

```http
GET /api/settings/notifications
```

#### 更新通知設定

```http
PUT /api/settings/notifications
```

**請求：**
```json
{
  "workout_reminders": true,
  "achievement_notifications": true,
  "new_feature_notifications": false,
  "email_notifications": true,
  "push_notifications": true,
  "email_frequency": "daily",
  "quiet_hours_start": "23:00",
  "quiet_hours_end": "06:00"
}
```

**通知設定欄位說明：**
- `workout_reminders`: 訓練提醒
- `achievement_notifications`: 成就通知
- `new_feature_notifications`: 新功能通知
- `email_notifications`: 電子郵件通知
- `push_notifications`: 推送通知
- `email_frequency`: 郵件頻率 (`"immediate"` | `"daily"` | `"weekly"` | `"monthly"`)
- `quiet_hours_start`: 安靜時間開始 (HH:MM)
- `quiet_hours_end`: 安靜時間結束 (HH:MM)

### 4. 隱私設定管理

#### 取得隱私設定

```http
GET /api/settings/privacy
```

#### 更新隱私設定

```http
PUT /api/settings/privacy
```

**請求：**
```json
{
  "profile_visibility": "friends_only",
  "workout_history_visibility": "private",
  "achievements_visibility": "public",
  "allow_friend_requests": true,
  "show_online_status": false,
  "data_analytics_consent": true,
  "third_party_integrations": false
}
```

**隱私設定欄位說明：**
- `profile_visibility`: 個人資料可見性 (`"public"` | `"private"` | `"friends_only"`)
- `workout_history_visibility`: 訓練歷史可見性
- `achievements_visibility`: 成就可見性
- `allow_friend_requests`: 允許好友請求
- `show_online_status`: 顯示線上狀態
- `data_analytics_consent`: 資料分析同意
- `third_party_integrations`: 第三方整合

### 5. 個人資料管理

#### 取得個人資料

```http
GET /api/settings/profile
```

#### 更新個人資料

```http
PUT /api/settings/profile
```

**請求：**
```json
{
  "name": "使用者姓名",
  "birth_date": "1990-01-01",
  "gender": "female",
  "height": 165,
  "weight": 55,
  "fitness_level": "advanced",
  "fitness_goals": ["減脂", "增肌", "提升耐力"],
  "contact_phone": "+886987654321",
  "emergency_contact_name": "緊急聯絡人",
  "emergency_contact_phone": "+886123456789",
  "profile_picture_url": "https://example.com/avatar.jpg"
}
```

**個人資料欄位說明：**
- `name`: 姓名
- `birth_date`: 出生日期 (ISO 8601 格式)
- `gender`: 性別 (`"male"` | `"female"` | `"other"`)
- `height`: 身高（公分）
- `weight`: 體重（公斤）
- `fitness_level`: 健身水平 (`"beginner"` | `"intermediate"` | `"advanced"`)
- `fitness_goals`: 健身目標陣列
- `contact_phone`: 聯絡電話
- `emergency_contact_name`: 緊急聯絡人姓名
- `emergency_contact_phone`: 緊急聯絡人電話
- `profile_picture_url`: 個人照片網址

### 6. 安全設定管理

#### 取得安全設定

```http
GET /api/settings/security
```

**回應：**
```json
{
  "success": true,
  "data": {
    "two_factor_enabled": false,
    "password_last_changed": "2023-01-01T00:00:00.000Z",
    "active_sessions_count": 3,
    "recent_login_count": 5
  },
  "message": "成功獲取安全設定"
}
```

#### 變更密碼

```http
PUT /api/settings/password
```

**請求：**
```json
{
  "current_password": "currentPassword123",
  "new_password": "newPassword123",
  "confirm_password": "newPassword123"
}
```

**密碼要求：**
- 至少 8 個字符
- 包含至少一個小寫字母
- 包含至少一個大寫字母
- 包含至少一個數字

### 7. 帳戶管理

#### 刪除帳戶

```http
DELETE /api/settings/account
```

**請求：**
```json
{
  "password": "userPassword123",
  "confirmation": "DELETE_MY_ACCOUNT",
  "reason": "不再需要此服務",
  "feedback": "希望能改善某些功能"
}
```

**注意：** 
- `confirmation` 必須完全等於 `"DELETE_MY_ACCOUNT"`
- 帳戶刪除為軟刪除，30天內可恢復
- 所有相關數據將被標記為已刪除

### 8. 資料管理

#### 匯出用戶資料

```http
POST /api/settings/export
```

**請求：**
```json
{
  "format": "json",
  "data_types": ["workouts", "exercises", "templates", "achievements", "settings"],
  "date_range": {
    "start_date": "2023-01-01",
    "end_date": "2023-12-31"
  }
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "export_id": "export-uuid",
    "download_url": "/exports/user_data_12345_1234567890.json",
    "expires_at": "2023-01-02T00:00:00.000Z",
    "file_size": 1024,
    "format": "json"
  },
  "message": "資料匯出成功"
}
```

**匯出參數說明：**
- `format`: 匯出格式 (`"json"` | `"csv"`)
- `data_types`: 要匯出的資料類型陣列
- `date_range`: 日期範圍（可選）

#### 取得使用統計

```http
GET /api/settings/usage-stats
```

**回應：**
```json
{
  "success": true,
  "data": {
    "total_workouts": 150,
    "total_workout_time": 7500,
    "total_exercises_performed": 45,
    "most_used_exercises": [
      {
        "exercise_id": "exercise-uuid",
        "exercise_name": "深蹲",
        "times_used": 50
      }
    ],
    "workout_frequency": {
      "monday": 20,
      "tuesday": 15,
      "wednesday": 25,
      "thursday": 18,
      "friday": 22,
      "saturday": 30,
      "sunday": 20
    },
    "monthly_activity": [
      {
        "month": "2023-01",
        "workout_count": 12,
        "total_time": 600
      }
    ],
    "achievement_count": 8,
    "data_storage_usage": 5.2,
    "account_age_days": 365
  },
  "message": "成功獲取使用統計"
}
```

### 9. 設定管理

#### 重置設定

```http
POST /api/settings/reset
```

**請求：**
```json
{
  "setting_types": ["preferences", "notifications"],
  "confirmation": true
}
```

**設定類型：**
- `"preferences"`: 偏好設定
- `"notifications"`: 通知設定
- `"privacy"`: 隱私設定

#### 建立設定備份

```http
POST /api/settings/backup
```

**請求：**
```json
{
  "description": "手動備份 - 重大設定變更前"
}
```

#### 恢復設定

```http
POST /api/settings/restore
```

**請求：**
```json
{
  "backup_id": "backup-uuid",
  "setting_types": ["preferences", "notifications"]
}
```

**注意：**
- 如果不指定 `setting_types`，將恢復所有設定（除安全設定外）
- 恢復前會自動建立當前設定的備份

## 錯誤處理

### 常見錯誤回應

#### 認證錯誤 (401)
```json
{
  "success": false,
  "message": "未授權的請求"
}
```

#### 驗證錯誤 (400)
```json
{
  "success": false,
  "message": "輸入驗證失敗",
  "errors": [
    {
      "field": "default_rest_time",
      "message": "預設休息時間必須是 0-3600 秒之間的整數",
      "value": -10
    }
  ]
}
```

#### 業務邏輯錯誤 (400)
```json
{
  "success": false,
  "message": "當前密碼錯誤"
}
```

#### 資源不存在 (404)
```json
{
  "success": false,
  "message": "用戶設定不存在"
}
```

#### 服務器錯誤 (500)
```json
{
  "success": false,
  "message": "獲取設定失敗"
}
```

## 資料驗證規則

### 偏好設定驗證
- `unit_system`: 必須是 `"metric"` 或 `"imperial"`
- `default_rest_time`: 0-3600 秒之間的整數
- `theme`: 必須是 `"light"`, `"dark"`, 或 `"auto"`
- `language`: 必須是支援的語言代碼
- `reminder_time`: HH:MM 格式 (24小時制)
- `reminder_days`: 0-6 之間的整數陣列

### 個人資料驗證
- `name`: 1-100 字符，只能包含中文、英文和空格
- `height`: 50-300 公分之間的數字
- `weight`: 20-500 公斤之間的數字
- `birth_date`: 有效的 ISO 8601 日期格式
- `contact_phone`: 有效的電話號碼格式

### 密碼驗證
- 最少 8 個字符
- 包含至少一個小寫字母 (a-z)
- 包含至少一個大寫字母 (A-Z)
- 包含至少一個數字 (0-9)

## 安全考量

1. **密碼加密**: 使用 bcrypt 進行密碼哈希，鹽輪數為 12
2. **資料脫敏**: 敏感資訊（如登入歷史）在回應中被過濾
3. **權限控制**: 用戶只能操作自己的設定
4. **審計日誌**: 重要操作（如密碼變更、帳戶刪除）會被記錄
5. **軟刪除**: 帳戶刪除採用軟刪除，保留恢復可能性

## 使用範例

### JavaScript 範例

```javascript
// 取得用戶設定
const getSettings = async () => {
  const response = await fetch('/api/settings', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};

// 更新偏好設定
const updatePreferences = async (preferences) => {
  const response = await fetch('/api/settings/preferences', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preferences)
  });
  return await response.json();
};

// 變更密碼
const changePassword = async (passwordData) => {
  const response = await fetch('/api/settings/password', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(passwordData)
  });
  return await response.json();
};
```

### cURL 範例

```bash
# 取得用戶設定
curl -X GET "http://localhost:3001/api/settings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 更新通知設定
curl -X PUT "http://localhost:3001/api/settings/notifications" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workout_reminders": true,
    "email_notifications": false
  }'

# 匯出資料
curl -X POST "http://localhost:3001/api/settings/export" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "json",
    "data_types": ["workouts", "settings"]
  }'
```

## 版本資訊

- **API 版本**: 1.0.0
- **最後更新**: 2024-01-01
- **相容性**: 支援現有的用戶認證系統

## 支援與回饋

如有任何問題或建議，請透過以下方式聯繫：
- 技術支援: [support@example.com](mailto:support@example.com)
- 文檔回饋: [docs@example.com](mailto:docs@example.com)