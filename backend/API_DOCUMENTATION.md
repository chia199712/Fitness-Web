# Fitness App Backend API 文檔

## 目錄
1. [認證模組 (Authentication Module)](#認證模組)
2. [動作庫模組 (Exercise Library Module)](#動作庫模組)
3. [訓練日誌模組 (Workout Logging Module)](#訓練日誌模組)

---

## 認證模組

### 基礎 URL
```
http://localhost:3001/api/auth
```

詳細認證 API 請參考認證文檔。

---

## 動作庫模組 (Exercise Library Module)

### 概述
動作庫模組提供完整的健身動作管理功能，包括系統內建動作和用戶自訂動作的 CRUD 操作。

### 基礎 URL
```
http://localhost:3001/api/exercises
```

### 認證
所有動作 API 端點都需要 JWT 認證。請在請求標頭中包含：
```
Authorization: Bearer <your_jwt_token>
```

---

## API 端點

### 1. 取得動作列表
**GET** `/api/exercises`

支援搜尋和篩選的動作列表

#### 查詢參數
- `search` (string, optional): 搜尋關鍵字（搜尋動作名稱、肌群、分類）
- `category` (string, optional): 動作分類篩選
- `primary_muscle` (string, optional): 主要肌群篩選
- `is_system` (boolean, optional): 是否只顯示系統動作
- `page` (number, optional): 頁碼，預設為 1
- `limit` (number, optional): 每頁數量，預設為 20

#### 範例請求
```bash
GET /api/exercises?search=深蹲&category=複合動作&page=1&limit=10
```

#### 回應範例
```json
{
  "success": true,
  "data": [
    {
      "exercise_id": "uuid-string",
      "name": "深蹲",
      "primary_muscle": "腿部",
      "secondary_muscles": "臀部,核心",
      "category": "複合動作",
      "description": "基礎下肢力量訓練動作",
      "instructions": "雙腳與肩同寬，蹲下時膝蓋不超過腳尖，保持背部挺直",
      "is_system": true,
      "user_id": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

---

### 2. 取得單一動作
**GET** `/api/exercises/:id`

根據動作 ID 取得特定動作詳細資訊

#### 路徑參數
- `id` (string): 動作 ID

#### 回應範例
```json
{
  "success": true,
  "data": {
    "exercise_id": "uuid-string",
    "name": "深蹲",
    "primary_muscle": "腿部",
    "secondary_muscles": "臀部,核心",
    "category": "複合動作",
    "description": "基礎下肢力量訓練動作",
    "instructions": "雙腳與肩同寬，蹲下時膝蓋不超過腳尖，保持背部挺直",
    "is_system": true,
    "user_id": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. 創建自訂動作
**POST** `/api/exercises`

創建新的自訂動作

#### 請求主體
```json
{
  "name": "我的自訂深蹲",
  "primary_muscle": "腿部",
  "secondary_muscles": "臀部,核心",
  "category": "複合動作",
  "description": "我的自訂動作描述",
  "instructions": "詳細的動作說明"
}
```

#### 必填欄位
- `name`: 動作名稱
- `primary_muscle`: 主要肌群
- `category`: 動作分類

#### 可選欄位
- `secondary_muscles`: 次要肌群
- `description`: 動作描述
- `instructions`: 動作說明

---

### 4. 更新動作
**PUT** `/api/exercises/:id`

更新現有動作（僅能更新自己創建的動作）

#### 請求主體
```json
{
  "name": "更新的動作名稱",
  "description": "更新的描述"
}
```

---

### 5. 刪除動作
**DELETE** `/api/exercises/:id`

刪除動作（僅能刪除自己創建的動作）

---

### 6. 初始化系統動作
**POST** `/api/exercises/init`

初始化系統內建動作（管理員功能）

#### 回應範例
```json
{
  "success": true,
  "message": "系統動作初始化成功"
}
```

---

### 7. 取得用戶自訂動作
**GET** `/api/exercises/user/custom`

取得當前用戶的所有自訂動作

---

### 8. 取得動作統計
**GET** `/api/exercises/stats/summary`

取得動作庫統計資訊

#### 回應範例
```json
{
  "success": true,
  "data": {
    "total": 15,
    "system": 10,
    "custom": 5
  }
}
```

---

### 9. 取得肌群列表
**GET** `/api/exercises/data/muscle-groups`

取得可用的肌群選項

#### 回應範例
```json
{
  "success": true,
  "data": [
    "胸部", "背部", "肩部", "腿部", "臀部", 
    "二頭肌", "三頭肌", "核心", "小腿", "前臂"
  ]
}
```

---

### 10. 取得動作分類列表
**GET** `/api/exercises/data/categories`

取得可用的動作分類選項

#### 回應範例
```json
{
  "success": true,
  "data": [
    "複合動作", "單關節動作", "有氧運動", 
    "伸展運動", "核心訓練", "爆發力訓練"
  ]
}
```

---

## 資料模型

### Exercise 動作模型
```typescript
interface Exercise {
  exercise_id: string;          // 動作 ID
  name: string;                 // 動作名稱
  primary_muscle: string;       // 主要肌群
  secondary_muscles?: string;   // 次要肌群（逗號分隔）
  category: string;             // 動作分類
  description?: string;         // 動作描述
  instructions?: string;        // 動作說明
  is_system: boolean;          // 是否為系統內建動作
  user_id?: string;            // 創建者 ID（自訂動作）
  created_at: string;          // 創建時間
}
```

---

## 系統內建動作

系統預設包含以下 10 個基礎健身動作：

1. **深蹲** - 腿部/複合動作
2. **臥推** - 胸部/複合動作
3. **硬舉** - 背部/複合動作
4. **引體向上** - 背部/複合動作
5. **肩推** - 肩部/複合動作
6. **划船** - 背部/複合動作
7. **二頭肌彎舉** - 二頭肌/單關節動作
8. **三頭肌下壓** - 三頭肌/單關節動作
9. **側平舉** - 肩部/單關節動作
10. **腿舉** - 腿部/複合動作

---

## 錯誤處理

### 常見錯誤回應

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "需要登入才能訪問此資源"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "沒有權限修改此動作"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "找不到指定的動作"
}
```

#### 409 Conflict
```json
{
  "success": false,
  "message": "動作名稱已存在"
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "message": "輸入驗證失敗",
  "errors": [
    {
      "field": "name",
      "message": "動作名稱長度必須在 1-100 個字符之間",
      "value": ""
    }
  ]
}
```

---

## 使用範例

### 1. 搜尋深蹲相關動作
```bash
curl -X GET "http://localhost:3001/api/exercises?search=深蹲" \
  -H "Authorization: Bearer your_jwt_token"
```

### 2. 創建自訂動作
```bash
curl -X POST "http://localhost:3001/api/exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "name": "保加利亞分腿蹲",
    "primary_muscle": "腿部",
    "secondary_muscles": "臀部,核心",
    "category": "複合動作",
    "description": "單腿訓練動作",
    "instructions": "後腳放在椅子上，前腿下蹲"
  }'
```

### 3. 篩選胸部動作
```bash
curl -X GET "http://localhost:3001/api/exercises?primary_muscle=胸部" \
  -H "Authorization: Bearer your_jwt_token"
```

---

## 部署注意事項

1. **Google Sheets 配置**: 確保 Google Sheets API 已正確配置
2. **環境變數**: 設定必要的環境變數（GOOGLE_SPREADSHEET_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY）
3. **資料庫初始化**: 首次部署後執行初始化端點來建立系統動作
4. **權限設定**: 系統動作受保護，不能被一般用戶修改或刪除

---

## 訓練日誌模組 (Workout Logging Module)

### 概述
訓練日誌模組是運動紀錄 App 的核心功能，提供完整的訓練記錄、動作管理、組數記錄和統計分析功能。支援即時訓練記錄、歷史數據查詢和詳細的訓練統計。

### 基礎 URL
```
http://localhost:3001/api/workouts
```

### 認證
所有訓練 API 端點都需要 JWT 認證。請在請求標頭中包含：
```
Authorization: Bearer <your_jwt_token>
```

---

## 訓練管理 API

### 1. 獲取訓練記錄列表
**GET** `/api/workouts`

獲取用戶的訓練記錄列表，支援篩選和分頁。

#### 查詢參數
- `start_date` (string, optional): 開始日期 (YYYY-MM-DD)
- `end_date` (string, optional): 結束日期 (YYYY-MM-DD)
- `status` (string, optional): 訓練狀態 (active/paused/completed/cancelled)
- `search` (string, optional): 搜尋關鍵字（搜尋訓練標題、備註）
- `page` (number, optional): 頁碼，預設為 1
- `limit` (number, optional): 每頁數量，預設為 20

#### 範例請求
```bash
GET /api/workouts?status=completed&start_date=2024-01-01&page=1&limit=10
```

#### 回應範例
```json
{
  "success": true,
  "data": {
    "workouts": [
      {
        "workout_id": "uuid-string",
        "user_id": "user-uuid",
        "title": "胸部訓練",
        "date": "2024-01-15",
        "start_time": "2024-01-15T10:00:00.000Z",
        "end_time": "2024-01-15T11:30:00.000Z",
        "duration": 5400,
        "status": "completed",
        "total_volume": 2500.5,
        "total_sets": 12,
        "total_reps": 156,
        "notes": "今天狀態很好",
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T11:30:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10
  },
  "message": "成功獲取訓練記錄列表"
}
```

### 2. 獲取單一訓練詳情
**GET** `/api/workouts/:id`

獲取指定訓練的詳細資訊，包含所有動作和組數記錄。

#### 回應範例
```json
{
  "success": true,
  "data": {
    "workout_id": "uuid-string",
    "title": "胸部訓練",
    "date": "2024-01-15",
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T11:30:00.000Z",
    "duration": 5400,
    "status": "completed",
    "total_volume": 2500.5,
    "total_sets": 12,
    "total_reps": 156,
    "exercises": [
      {
        "workout_exercise_id": "we-uuid",
        "exercise_id": "exercise-uuid",
        "order": 1,
        "notes": "感覺很好",
        "exercise": {
          "name": "臥推",
          "primary_muscle": "胸部",
          "category": "複合動作"
        },
        "sets": [
          {
            "set_id": "set-uuid",
            "set_number": 1,
            "weight": 80,
            "reps": 12,
            "completed": true,
            "rest_time": 120,
            "notes": "熱身組",
            "completed_at": "2024-01-15T10:15:00.000Z"
          }
        ]
      }
    ]
  },
  "message": "成功獲取訓練詳情"
}
```

### 3. 開始新訓練
**POST** `/api/workouts`

創建並開始一個新的訓練。

#### 請求體
```json
{
  "title": "胸部訓練",
  "template_id": "template-uuid", // 選填，套用訓練模板
  "notes": "今天要練胸部"
}
```

#### 回應範例
```json
{
  "success": true,
  "data": {
    "workout_id": "new-workout-uuid",
    "title": "胸部訓練",
    "status": "active",
    "start_time": "2024-01-15T10:00:00.000Z",
    "duration": 0,
    "total_volume": 0,
    "total_sets": 0,
    "total_reps": 0
  },
  "message": "成功開始新訓練"
}
```

### 4. 更新訓練資訊
**PUT** `/api/workouts/:id`

更新訓練的基本資訊。

#### 請求體
```json
{
  "title": "胸部+三頭肌訓練",
  "notes": "加練三頭肌",
  "status": "paused"
}
```

### 5. 刪除訓練
**DELETE** `/api/workouts/:id`

刪除指定的訓練記錄及其所有相關數據。

---

## 訓練動作管理 API

### 6. 添加動作到訓練
**POST** `/api/workouts/:id/exercises`

將動作添加到指定的訓練中。

#### 請求體
```json
{
  "exercise_id": "exercise-uuid",
  "notes": "今天要做重一點"
}
```

#### 回應範例
```json
{
  "success": true,
  "data": {
    "workout_exercise_id": "we-uuid",
    "workout_id": "workout-uuid",
    "exercise_id": "exercise-uuid",
    "order": 1,
    "notes": "今天要做重一點"
  },
  "message": "成功添加動作到訓練"
}
```

### 7. 更新訓練動作
**PUT** `/api/workouts/:id/exercises/:exerciseId`

更新訓練中指定動作的資訊。

#### 請求體
```json
{
  "notes": "調整重量"
}
```

### 8. 移除訓練動作
**DELETE** `/api/workouts/:id/exercises/:exerciseId`

從訓練中移除指定的動作及其所有組數記錄。

---

## 組數記錄管理 API

### 9. 添加組數
**POST** `/api/workouts/:id/exercises/:exerciseId/sets`

為指定的訓練動作添加組數記錄。

#### 請求體
```json
{
  "weight": 80.5,
  "reps": 12,
  "notes": "感覺不錯"
}
```

#### 回應範例
```json
{
  "success": true,
  "data": {
    "set_id": "set-uuid",
    "workout_exercise_id": "we-uuid",
    "set_number": 1,
    "weight": 80.5,
    "reps": 12,
    "completed": true,
    "notes": "感覺不錯",
    "completed_at": "2024-01-15T10:15:00.000Z"
  },
  "message": "成功添加組數"
}
```

### 10. 更新組數
**PUT** `/api/workouts/:id/exercises/:exerciseId/sets/:setId`

更新指定的組數記錄。

#### 請求體
```json
{
  "weight": 82.5,
  "reps": 10,
  "completed": true,
  "rest_time": 120,
  "notes": "加重了"
}
```

### 11. 刪除組數
**DELETE** `/api/workouts/:id/exercises/:exerciseId/sets/:setId`

刪除指定的組數記錄。

---

## 訓練控制 API

### 12. 完成訓練
**POST** `/api/workouts/:id/finish`

完成指定的訓練，計算最終統計數據。

#### 回應範例
```json
{
  "success": true,
  "data": {
    "workout_id": "workout-uuid",
    "status": "completed",
    "end_time": "2024-01-15T11:30:00.000Z",
    "duration": 5400,
    "total_volume": 2500.5,
    "total_sets": 12,
    "total_reps": 156
  },
  "message": "成功完成訓練"
}
```

---

## 統計分析 API

### 13. 獲取訓練統計
**GET** `/api/workouts/stats`

獲取用戶的訓練統計數據。

#### 查詢參數
- `start_date` (string, optional): 統計開始日期
- `end_date` (string, optional): 統計結束日期

#### 回應範例
```json
{
  "success": true,
  "data": {
    "total_workouts": 25,
    "total_duration": 50400,
    "total_volume": 12750.5,
    "total_sets": 300,
    "total_reps": 3600,
    "average_workout_duration": 2016,
    "favorite_exercises": [
      {
        "exercise_id": "exercise-uuid",
        "name": "臥推",
        "count": 15
      }
    ],
    "monthly_volume": [
      {
        "month": "2024-01",
        "volume": 5500.5
      }
    ]
  },
  "message": "成功獲取訓練統計"
}
```

---

## 訓練狀態管理

### 訓練狀態說明
- `active`: 進行中的訓練
- `paused`: 暫停的訓練
- `completed`: 已完成的訓練
- `cancelled`: 已取消的訓練

### 訓練流程
1. **開始訓練**: `POST /api/workouts` → 狀態變為 `active`
2. **添加動作**: `POST /api/workouts/:id/exercises`
3. **記錄組數**: `POST /api/workouts/:id/exercises/:exerciseId/sets`
4. **完成訓練**: `POST /api/workouts/:id/finish` → 狀態變為 `completed`

---

## 使用範例

### 完整訓練流程範例

```bash
# 1. 開始新訓練
curl -X POST "http://localhost:3001/api/workouts" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "胸部訓練",
    "notes": "今天專練胸部"
  }'

# 2. 添加臥推動作
curl -X POST "http://localhost:3001/api/workouts/workout-uuid/exercises" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "exercise_id": "bench-press-uuid",
    "notes": "主要動作"
  }'

# 3. 記錄第一組
curl -X POST "http://localhost:3001/api/workouts/workout-uuid/exercises/bench-press-uuid/sets" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 80,
    "reps": 12,
    "notes": "熱身組"
  }'

# 4. 完成訓練
curl -X POST "http://localhost:3001/api/workouts/workout-uuid/finish" \
  -H "Authorization: Bearer your_jwt_token"
```

---

## 開發注意事項

### 訓練模組開發重點
- 路由順序很重要：`/stats` 必須在 `/:id` 之前定義
- 所有訓練操作都需要認證
- 用戶只能操作自己的訓練記錄
- 支援即時統計計算和更新
- 複雜的關聯資料處理（訓練→動作→組數）
- 訓練狀態管理和流程控制
- 詳細的輸入驗證確保資料完整性

### 資料一致性
- 刪除訓練時自動刪除相關的動作和組數記錄
- 刪除訓練動作時自動刪除相關的組數記錄
- 自動重新計算訓練統計數據
- 即時更新訓練狀態和持續時間

### 效能考量
- 支援分頁查詢避免大量資料傳輸
- 索引優化提升查詢效能
- 快取常用統計數據
- 非同步處理複雜統計計算

---

## 系統整合

### Google Sheets 資料結構
訓練模組使用三個主要工作表：

1. **Workouts**: 儲存訓練基本資訊
2. **WorkoutExercises**: 儲存訓練中的動作關聯
3. **Sets**: 儲存組數記錄詳情

### 與其他模組的整合
- **認證模組**: 提供用戶認證和權限控制
- **動作庫模組**: 提供動作資訊和驗證
- **模板模組**: 支援訓練模板套用（未來功能）

### 部署注意事項
1. 確保 Google Sheets API 已正確配置
2. 訓練相關工作表會自動初始化
3. 設定適當的資料備份策略
4. 監控系統效能和資料完整性