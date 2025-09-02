# 儀表板模組 API 文檔

## 基本資訊

- **基礎 URL**: `http://localhost:3001/api/dashboard`
- **認證方式**: Bearer Token (JWT)
- **內容類型**: `application/json`
- **版本**: v1.0

## 認證

所有儀表板 API 都需要在請求標頭中包含有效的 JWT token：

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API 端點

### 1. 儀表板總覽

獲取用戶的儀表板總覽資訊，包含用戶基本統計、本週進度、近期成就等。

**端點**: `GET /api/dashboard`

**請求參數**: 無

**回應範例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "張三",
      "streak_days": 7,
      "total_workouts": 45,
      "member_since": "2024-01-15T00:00:00.000Z"
    },
    "current_week": {
      "workouts_completed": 3,
      "total_duration": 180,
      "total_volume": 2500,
      "goal_progress": 75
    },
    "recent_achievements": [
      {
        "achievement_id": "achievement_001",
        "name": "訓練達人 50",
        "description": "完成 50 次訓練",
        "type": "workout_count",
        "status": "completed",
        "icon": "🏋️",
        "unlocked_at": "2024-08-15T10:30:00.000Z"
      }
    ],
    "quick_stats": {
      "this_month_workouts": 12,
      "this_month_volume": 8500,
      "favorite_exercise": "深蹲",
      "avg_workout_duration": 65
    },
    "upcoming_milestones": [
      {
        "type": "訓練次數",
        "current": 45,
        "target": 50,
        "progress": 90
      }
    ]
  },
  "message": "儀表板總覽獲取成功"
}
```

---

### 2. 詳細統計

獲取用戶的詳細訓練統計資訊，包含趨勢分析、肌群分布等。

**端點**: `GET /api/dashboard/stats`

**請求參數**: 無

**回應範例**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_workouts": 45,
      "total_duration": 2700,
      "total_volume": 125000,
      "total_sets": 540,
      "total_reps": 6750,
      "average_workout_duration": 60,
      "current_streak": 7,
      "longest_streak": 14
    },
    "this_week": {
      "workouts": 3,
      "duration": 180,
      "volume": 2500,
      "sets": 36,
      "reps": 450
    },
    "this_month": {
      "workouts": 12,
      "duration": 720,
      "volume": 8500,
      "sets": 144,
      "reps": 1800
    },
    "trends": {
      "workout_frequency": [
        { "period": "2024-07-01", "workouts": 4 },
        { "period": "2024-07-08", "workouts": 3 },
        { "period": "2024-07-15", "workouts": 5 }
      ],
      "volume_progression": [
        { "period": "2024-07-01", "volume": 2200 },
        { "period": "2024-07-08", "volume": 2400 },
        { "period": "2024-07-15", "volume": 2600 }
      ]
    },
    "muscle_group_distribution": [
      { "muscle_group": "胸部", "percentage": 25, "total_sets": 135 },
      { "muscle_group": "背部", "percentage": 20, "total_sets": 108 },
      { "muscle_group": "腿部", "percentage": 30, "total_sets": 162 }
    ],
    "favorite_exercises": [
      {
        "exercise_id": "ex_001",
        "exercise_name": "深蹲",
        "times_performed": 45,
        "total_volume": 12000,
        "avg_weight": 80
      }
    ]
  },
  "message": "統計資訊獲取成功"
}
```

---

### 3. 近期訓練

獲取用戶的近期訓練記錄。

**端點**: `GET /api/dashboard/recent-workouts`

**請求參數**:
- `limit` (可選): 限制返回數量，預設 10，最大 50

**請求範例**:
```
GET /api/dashboard/recent-workouts?limit=5
```

**回應範例**:
```json
{
  "success": true,
  "data": [
    {
      "workout_id": "workout_001",
      "title": "上半身訓練",
      "date": "2024-08-19",
      "duration": 3600,
      "total_volume": 2500,
      "total_sets": 12,
      "status": "completed",
      "exercises_count": 4,
      "highlights": ["新的個人記錄", "高強度訓練"]
    }
  ],
  "message": "近期訓練獲取成功"
}
```

---

### 4. 個人記錄

獲取用戶的個人最佳記錄 (PRs)。

**端點**: `GET /api/dashboard/personal-records`

**請求參數**: 無

**回應範例**:
```json
{
  "success": true,
  "data": [
    {
      "pr_id": "pr_001",
      "user_id": "user_001",
      "exercise_id": "ex_001",
      "exercise_name": "深蹲",
      "max_weight": 120,
      "max_reps": 8,
      "max_volume": 960,
      "achieved_at": "2024-08-15T10:30:00.000Z",
      "workout_id": "workout_015",
      "previous_record": {
        "weight": 110,
        "reps": 8,
        "volume": 880,
        "achieved_at": "2024-07-20T10:30:00.000Z"
      }
    }
  ],
  "message": "個人記錄獲取成功"
}
```

---

### 5. 訓練日曆

獲取指定月份的訓練日曆資料。

**端點**: `GET /api/dashboard/calendar`

**請求參數**:
- `year` (必須): 年份，範圍 2020-2030
- `month` (必須): 月份，範圍 1-12

**請求範例**:
```
GET /api/dashboard/calendar?year=2024&month=8
```

**回應範例**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-08-01",
      "workout_count": 1,
      "total_duration": 3600,
      "total_volume": 2500,
      "workouts": [
        {
          "workout_id": "workout_001",
          "title": "上半身訓練",
          "duration": 3600,
          "status": "completed"
        }
      ],
      "is_rest_day": false
    },
    {
      "date": "2024-08-02",
      "workout_count": 0,
      "total_duration": 0,
      "total_volume": 0,
      "workouts": [],
      "is_rest_day": true
    }
  ],
  "message": "訓練日曆獲取成功"
}
```

---

### 6. 成就列表

獲取用戶的成就列表。

**端點**: `GET /api/dashboard/achievements`

**請求參數**: 無

**回應範例**:
```json
{
  "success": true,
  "data": [
    {
      "achievement_id": "achievement_001",
      "name": "訓練達人 50",
      "description": "完成 50 次訓練",
      "type": "workout_count",
      "target_value": 50,
      "current_value": 45,
      "status": "in_progress",
      "icon": "🏋️",
      "reward_points": 100,
      "created_at": "2024-01-15T00:00:00.000Z"
    },
    {
      "achievement_id": "achievement_002",
      "name": "連續訓練 7 天",
      "description": "連續 7 天進行訓練",
      "type": "streak_days",
      "target_value": 7,
      "current_value": 7,
      "status": "completed",
      "icon": "🔥",
      "reward_points": 150,
      "unlocked_at": "2024-08-15T10:30:00.000Z",
      "created_at": "2024-01-15T00:00:00.000Z"
    }
  ],
  "message": "成就列表獲取成功"
}
```

---

### 7. 進度追蹤

獲取用戶的進度追蹤資料。

**端點**: `GET /api/dashboard/progress`

**請求參數**:
- `period` (可選): 時間週期，可選值: `week`、`month`、`quarter`、`year`，預設 `month`
- `metric` (可選): 指標類型，可選值: `volume`、`duration`、`workouts`、`strength`，預設 `volume`
- `start_date` (可選): 開始日期，格式 YYYY-MM-DD
- `end_date` (可選): 結束日期，格式 YYYY-MM-DD

**請求範例**:
```
GET /api/dashboard/progress?period=month&metric=volume
```

**回應範例**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-07-01",
      "total_volume": 2200,
      "total_workouts": 4,
      "average_duration": 60,
      "strength_index": 85,
      "consistency_score": 90
    },
    {
      "date": "2024-08-01",
      "total_volume": 2500,
      "total_workouts": 5,
      "average_duration": 65,
      "strength_index": 88,
      "consistency_score": 95
    }
  ],
  "message": "進度追蹤獲取成功"
}
```

---

### 8. 訓練洞察

獲取智能訓練洞察和建議。

**端點**: `GET /api/dashboard/insights`

**請求參數**:
- `type` (可選): 洞察類型，可選值: `best_time`、`rest_analysis`、`efficiency`、`balance`、`suggestion`
- `priority` (可選): 優先級，可選值: `low`、`medium`、`high`
- `limit` (可選): 限制返回數量，預設 10，範圍 1-50

**請求範例**:
```
GET /api/dashboard/insights?type=best_time&limit=3
```

**回應範例**:
```json
{
  "success": true,
  "data": [
    {
      "insight_id": "insight_001",
      "type": "best_time",
      "title": "最佳訓練時間",
      "description": "您在 18:00 時訓練表現最佳，平均重量比其他時間高 15%",
      "data": {
        "hour": "18",
        "performance_improvement": 0.15
      },
      "priority": "medium",
      "created_at": "2024-08-19T10:00:00.000Z"
    },
    {
      "insight_id": "insight_002",
      "type": "balance",
      "title": "注意訓練平衡性",
      "description": "肩部的訓練比例較低，建議增加相關動作",
      "data": {
        "undertrainedMuscles": ["肩部"]
      },
      "priority": "medium",
      "created_at": "2024-08-19T10:00:00.000Z"
    }
  ],
  "message": "訓練洞察獲取成功"
}
```

---

### 9. 快速摘要

獲取儀表板的快速摘要資訊。

**端點**: `GET /api/dashboard/summary`

**請求參數**: 無

**回應範例**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "user": {
        "name": "張三",
        "streak_days": 7,
        "total_workouts": 45,
        "member_since": "2024-01-15T00:00:00.000Z"
      },
      "current_week": {
        "workouts_completed": 3,
        "total_duration": 180,
        "total_volume": 2500,
        "goal_progress": 75
      },
      "quick_stats": {
        "this_month_workouts": 12,
        "this_month_volume": 8500,
        "favorite_exercise": "深蹲",
        "avg_workout_duration": 65
      }
    },
    "recent_workouts": [
      {
        "workout_id": "workout_001",
        "title": "上半身訓練",
        "date": "2024-08-19",
        "duration": 3600,
        "total_volume": 2500,
        "total_sets": 12,
        "status": "completed",
        "exercises_count": 4,
        "highlights": ["高強度訓練"]
      }
    ],
    "recent_achievements": [
      {
        "achievement_id": "achievement_002",
        "name": "連續訓練 7 天",
        "status": "completed",
        "icon": "🔥",
        "unlocked_at": "2024-08-15T10:30:00.000Z"
      }
    ],
    "insights": [
      {
        "insight_id": "insight_001",
        "type": "best_time",
        "title": "最佳訓練時間",
        "description": "您在 18:00 時訓練表現最佳",
        "priority": "high"
      }
    ]
  },
  "message": "儀表板摘要獲取成功"
}
```

---

### 10. 關鍵指標

獲取特定週期的關鍵指標。

**端點**: `GET /api/dashboard/metrics`

**請求參數**:
- `period` (可選): 時間週期，可選值: `week`、`month`、`quarter`、`year`，預設 `month`

**請求範例**:
```
GET /api/dashboard/metrics?period=month
```

**回應範例**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "workouts": 12,
    "total_volume": 8500,
    "total_duration": 720,
    "total_sets": 144,
    "total_reps": 1800,
    "average_workout_duration": 60,
    "current_streak": 7,
    "trends": {
      "workout_frequency": [
        { "period": "2024-07-01", "workouts": 4 },
        { "period": "2024-07-08", "workouts": 3 },
        { "period": "2024-07-15", "workouts": 5 },
        { "period": "2024-07-22", "workouts": 4 }
      ],
      "volume_progression": [
        { "period": "2024-07-01", "volume": 2200 },
        { "period": "2024-07-08", "volume": 2400 },
        { "period": "2024-07-15", "volume": 2600 },
        { "period": "2024-07-22", "volume": 2300 }
      ]
    }
  },
  "message": "關鍵指標獲取成功"
}
```

---

### 11. 刷新快取

刷新用戶的儀表板快取。

**端點**: `POST /api/dashboard/refresh-cache`

**請求參數**: 無

**回應範例**:
```json
{
  "success": true,
  "message": "快取刷新成功"
}
```

---

### 12. 匯出數據

匯出用戶的儀表板數據。

**端點**: `GET /api/dashboard/export`

**請求參數**:
- `format` (可選): 匯出格式，可選值: `json`、`csv`，預設 `json`

**請求範例**:
```
GET /api/dashboard/export?format=json
```

**回應**: 
- JSON 格式：返回完整的儀表板數據
- CSV 格式：返回 CSV 文件（功能待實現）

---

## 錯誤處理

### 錯誤回應格式
```json
{
  "success": false,
  "message": "錯誤描述",
  "error": "詳細錯誤信息"
}
```

### 常見錯誤碼

#### 400 Bad Request
參數驗證失敗，包含詳細的驗證錯誤信息：
```json
{
  "success": false,
  "message": "輸入驗證失敗",
  "errors": [
    {
      "field": "year",
      "message": "年份必須是 2020-2030 之間的整數",
      "value": "2050"
    }
  ]
}
```

#### 401 Unauthorized
認證失敗：
```json
{
  "success": false,
  "message": "未授權訪問"
}
```

#### 404 Not Found
資源不存在：
```json
{
  "success": false,
  "message": "找不到請求的資源"
}
```

#### 500 Internal Server Error
服務器內部錯誤：
```json
{
  "success": false,
  "message": "服務器內部錯誤",
  "error": "具體錯誤信息"
}
```

---

## 使用範例

### JavaScript (Fetch API)
```javascript
// 獲取儀表板總覽
async function getDashboardOverview() {
  try {
    const response = await fetch('/api/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('儀表板總覽：', data.data);
    } else {
      console.error('錯誤：', data.message);
    }
  } catch (error) {
    console.error('請求失敗：', error);
  }
}

// 獲取訓練日曆
async function getTrainingCalendar(year, month) {
  try {
    const response = await fetch(`/api/dashboard/calendar?year=${year}&month=${month}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('訓練日曆：', data.data);
    } else {
      console.error('錯誤：', data.message);
    }
  } catch (error) {
    console.error('請求失敗：', error);
  }
}
```

### cURL
```bash
# 獲取儀表板總覽
curl -X GET "http://localhost:3001/api/dashboard" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 獲取訓練日曆
curl -X GET "http://localhost:3001/api/dashboard/calendar?year=2024&month=8" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 獲取訓練洞察
curl -X GET "http://localhost:3001/api/dashboard/insights?priority=high&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 快取機制

儀表板 API 使用多層快取策略來提升性能：

- **儀表板總覽**: 5 分鐘快取
- **統計資訊**: 10 分鐘快取  
- **訓練日曆**: 30 分鐘快取
- **訓練洞察**: 1 小時快取

快取會在以下情況自動失效：
- 新增或完成訓練
- 創建新的個人記錄
- 達成新的成就
- 手動刷新快取

---

## 效能考量

1. **分頁**: 對於可能返回大量數據的端點，使用 `limit` 參數控制返回數量
2. **批量請求**: 使用 `/summary` 端點獲取多種資料，減少 HTTP 請求數量
3. **快取**: 合理利用快取機制，避免頻繁請求相同資料
4. **條件查詢**: 使用適當的查詢參數過濾不需要的資料

---

## 更新日誌

### v1.0 (2024-08-19)
- 初始版本發布
- 實現所有核心儀表板功能
- 支援完整的統計分析和洞察功能
- 實現快取機制和效能最佳化