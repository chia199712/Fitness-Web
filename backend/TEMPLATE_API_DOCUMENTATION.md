# 範本管理 API 文檔

## 概述

範本管理 API 提供了創建、管理和使用訓練範本的完整功能。範本是預先定義的訓練計畫，包含一系列動作、目標組數、次數等設定，可以重複使用。

## 基礎URL

```
http://localhost:3001/api/templates
```

## 認證

除了公開端點外，所有 API 端點都需要在請求標頭中包含有效的 JWT token：

```
Authorization: Bearer <your-jwt-token>
```

## 範本數據結構

### Template（範本）

```typescript
interface Template {
  template_id: string;          // 範本唯一標識符
  user_id: string;             // 創建者用戶ID
  name: string;                // 範本名稱
  description?: string;        // 範本描述
  type: TemplateType;          // 範本類型
  difficulty: TemplateDifficulty; // 難度等級
  visibility: TemplateVisibility; // 可見性設定
  estimated_duration: number;  // 預估時間（分鐘）
  target_muscle_groups?: string; // 目標肌群（JSON字符串）
  tags?: string;               // 標籤（JSON字符串）
  use_count: number;           // 使用次數
  rating: number;              // 評分
  rating_count: number;        // 評分次數
  last_used_at?: string;       // 最後使用時間
  is_favorite: boolean;        // 是否收藏
  created_at: string;          // 創建時間
  updated_at: string;          // 更新時間
}
```

### TemplateExercise（範本動作）

```typescript
interface TemplateExercise {
  template_exercise_id: string; // 範本動作唯一標識符
  template_id: string;         // 所屬範本ID
  exercise_id: string;         // 動作ID
  target_sets: number;         // 目標組數
  target_reps: string;         // 目標次數（如 "10" 或 "8-12"）
  target_weight?: number;      // 目標重量
  rest_time?: number;          // 休息時間（秒）
  order: number;               // 動作順序
  notes?: string;              // 備註
  created_at: string;          // 創建時間
}
```

### 枚舉類型

```typescript
enum TemplateType {
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

enum TemplateDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

enum TemplateVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  SHARED = 'shared'
}
```

## API 端點

### 1. 範本列表管理

#### 取得範本列表
- **GET** `/api/templates`
- **描述**: 取得範本列表，支援篩選和排序
- **認證**: 需要
- **查詢參數**:
  - `search` (string): 搜尋關鍵字
  - `type` (TemplateType): 範本類型
  - `difficulty` (TemplateDifficulty): 難度等級
  - `visibility` (TemplateVisibility): 可見性
  - `user_id` (string): 指定用戶ID
  - `is_favorite` (boolean): 是否收藏
  - `tags` (string): 標籤列表，用逗號分隔
  - `sort_by` (string): 排序欄位 (name|created_at|use_count|rating|last_used_at)
  - `sort_order` (string): 排序方向 (asc|desc)
  - `page` (number): 頁碼
  - `limit` (number): 每頁數量

**響應示例**:
```json
{
  "success": true,
  "data": [
    {
      "template_id": "uuid",
      "user_id": "uuid",
      "name": "上半身力量訓練",
      "description": "專注於上半身肌群的力量訓練",
      "type": "strength",
      "difficulty": "intermediate",
      "visibility": "public",
      "estimated_duration": 60,
      "target_muscle_groups": "[\"胸部\", \"背部\", \"肩部\"]",
      "tags": "[\"力量\", \"上半身\"]",
      "use_count": 15,
      "rating": 4.5,
      "rating_count": 8,
      "last_used_at": "2024-01-15T10:30:00.000Z",
      "is_favorite": false,
      "created_at": "2024-01-01T09:00:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 取得我的範本
- **GET** `/api/templates/my`
- **描述**: 取得當前用戶創建的範本
- **認證**: 需要
- **查詢參數**: 同範本列表

#### 取得收藏範本
- **GET** `/api/templates/favorites`
- **描述**: 取得當前用戶收藏的範本
- **認證**: 需要
- **查詢參數**: `page`, `limit`

#### 取得公開範本
- **GET** `/api/templates/public`
- **描述**: 取得所有公開範本
- **認證**: 可選
- **查詢參數**: 同範本列表

#### 取得熱門範本
- **GET** `/api/templates/popular`
- **描述**: 取得使用次數最多的公開範本
- **認證**: 不需要
- **查詢參數**: `limit` (number): 限制數量，預設10

### 2. 範本詳情管理

#### 取得範本詳情
- **GET** `/api/templates/:id`
- **描述**: 取得指定範本的詳細資訊，包含所有動作
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

**響應示例**:
```json
{
  "success": true,
  "data": {
    "template_id": "uuid",
    "user_id": "uuid",
    "name": "上半身力量訓練",
    "description": "專注於上半身肌群的力量訓練",
    "type": "strength",
    "difficulty": "intermediate",
    "visibility": "public",
    "estimated_duration": 60,
    "target_muscle_groups": ["胸部", "背部", "肩部"],
    "tags": ["力量", "上半身"],
    "use_count": 15,
    "rating": 4.5,
    "rating_count": 8,
    "last_used_at": "2024-01-15T10:30:00.000Z",
    "is_favorite": false,
    "created_at": "2024-01-01T09:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "exercises": [
      {
        "template_exercise_id": "uuid",
        "template_id": "uuid",
        "exercise_id": "uuid",
        "target_sets": 3,
        "target_reps": "8-12",
        "target_weight": 80,
        "rest_time": 120,
        "order": 1,
        "notes": "注意姿勢",
        "created_at": "2024-01-01T09:00:00.000Z",
        "exercise": {
          "exercise_id": "uuid",
          "name": "臥推",
          "primary_muscle": "胸部",
          "secondary_muscles": "三頭肌,前三角肌",
          "category": "複合動作",
          "description": "胸部主要訓練動作",
          "instructions": "躺平於臥推椅上...",
          "is_system": true,
          "created_at": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

### 3. 範本 CRUD 操作

#### 創建範本
- **POST** `/api/templates`
- **描述**: 創建新的訓練範本
- **認證**: 需要

**請求體**:
```json
{
  "name": "上半身力量訓練",
  "description": "專注於上半身肌群的力量訓練",
  "type": "strength",
  "difficulty": "intermediate",
  "visibility": "private",
  "estimated_duration": 60,
  "target_muscle_groups": ["胸部", "背部", "肩部"],
  "tags": ["力量", "上半身"]
}
```

#### 更新範本
- **PUT** `/api/templates/:id`
- **描述**: 更新指定範本的基本資訊
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

**請求體**: 同創建範本，所有欄位都是可選的

#### 刪除範本
- **DELETE** `/api/templates/:id`
- **描述**: 刪除指定範本及其所有動作
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

### 4. 範本動作管理

#### 添加動作到範本
- **POST** `/api/templates/:id/exercises`
- **描述**: 為範本添加新的動作
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

**請求體**:
```json
{
  "exercise_id": "uuid",
  "target_sets": 3,
  "target_reps": "8-12",
  "target_weight": 80,
  "rest_time": 120,
  "notes": "注意姿勢"
}
```

#### 更新範本動作
- **PUT** `/api/templates/:id/exercises/:exerciseId`
- **描述**: 更新範本中的指定動作
- **認證**: 需要
- **路徑參數**: 
  - `id` - 範本ID
  - `exerciseId` - 範本動作ID

**請求體**: 同添加動作，所有欄位都是可選的

#### 移除範本動作
- **DELETE** `/api/templates/:id/exercises/:exerciseId`
- **描述**: 從範本中移除指定動作
- **認證**: 需要
- **路徑參數**: 
  - `id` - 範本ID
  - `exerciseId` - 範本動作ID

### 5. 範本操作功能

#### 套用範本開始訓練
- **POST** `/api/templates/:id/apply`
- **描述**: 使用範本創建新的訓練記錄
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

**請求體**:
```json
{
  "title": "今日上半身訓練",
  "notes": "按照範本進行訓練",
  "scheduled_date": "2024-01-20T09:00:00.000Z"
}
```

**響應示例**:
```json
{
  "success": true,
  "data": {
    "workout_id": "uuid"
  },
  "message": "範本套用成功，訓練已開始"
}
```

#### 複製範本
- **POST** `/api/templates/:id/duplicate`
- **描述**: 複製範本創建新的範本
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

**請求體**:
```json
{
  "name": "上半身力量訓練 (副本)",
  "visibility": "private"
}
```

#### 切換收藏狀態
- **POST** `/api/templates/:id/favorite`
- **描述**: 切換範本的收藏狀態
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

**請求體**:
```json
{
  "is_favorite": true
}
```

### 6. 統計和建議

#### 取得範本統計
- **GET** `/api/templates/stats`
- **描述**: 取得用戶的範本使用統計
- **認證**: 需要

**響應示例**:
```json
{
  "success": true,
  "data": {
    "total_templates": 15,
    "public_templates": 3,
    "private_templates": 12,
    "favorite_templates": 5,
    "most_used_template": {
      "template_id": "uuid",
      "name": "上半身力量訓練",
      "use_count": 25
    },
    "recent_templates": [
      {
        "template_id": "uuid",
        "name": "上半身力量訓練",
        "last_used_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "template_types": [
      {
        "type": "strength",
        "count": 8
      },
      {
        "type": "cardio",
        "count": 4
      }
    ]
  }
}
```

#### 取得動作建議
- **GET** `/api/templates/:id/suggestions`
- **描述**: 根據範本類型和內容取得動作建議
- **認證**: 需要
- **路徑參數**: `id` - 範本ID

### 7. 批量操作

#### 批量操作範本
- **POST** `/api/templates/bulk`
- **描述**: 對多個範本執行批量操作
- **認證**: 需要

**請求體**:
```json
{
  "template_ids": ["uuid1", "uuid2", "uuid3"],
  "operation": "favorite",
  "visibility": "public"
}
```

**操作類型**:
- `delete`: 刪除範本
- `favorite`: 設為收藏
- `unfavorite`: 取消收藏
- `change_visibility`: 更改可見性（需要提供visibility參數）

## 錯誤處理

所有 API 端點都遵循統一的錯誤響應格式：

```json
{
  "success": false,
  "error": "錯誤描述",
  "message": "用戶友好的錯誤信息"
}
```

### 常見錯誤碼

- **400**: 請求參數錯誤或驗證失敗
- **401**: 未授權，需要登入
- **403**: 權限不足
- **404**: 資源不存在
- **409**: 資源衝突
- **500**: 服務器內部錯誤

## 使用示例

### 創建並使用範本的完整流程

1. **創建範本**:
```javascript
const createTemplate = async () => {
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      name: '上半身力量訓練',
      type: 'strength',
      difficulty: 'intermediate',
      estimated_duration: 60
    })
  });
  return await response.json();
};
```

2. **添加動作到範本**:
```javascript
const addExercise = async (templateId, exerciseId) => {
  const response = await fetch(`/api/templates/${templateId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      exercise_id: exerciseId,
      target_sets: 3,
      target_reps: '8-12',
      target_weight: 80
    })
  });
  return await response.json();
};
```

3. **套用範本開始訓練**:
```javascript
const applyTemplate = async (templateId) => {
  const response = await fetch(`/api/templates/${templateId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      title: '今日訓練'
    })
  });
  return await response.json();
};
```

## 注意事項

1. **權限控制**: 用戶只能修改和刪除自己創建的範本
2. **可見性**: 
   - `private`: 只有創建者可見
   - `public`: 所有用戶可見和使用
   - `shared`: 通過特定鏈接分享
3. **數據驗證**: 所有輸入都會進行嚴格的數據驗證
4. **性能考慮**: 使用分頁來處理大量數據
5. **緩存**: 熱門範本會被緩存以提高性能

## 更新日誌

- **v1.0.0**: 初始版本，包含完整的範本管理功能
- 支援範本的 CRUD 操作
- 支援範本動作管理
- 支援範本套用和複製
- 支援收藏和統計功能
- 支援批量操作