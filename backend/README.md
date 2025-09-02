# 運動紀錄 App 後端 API

完整的使用者認證系統，基於 JWT 和 Google Sheets 存儲。

## 功能特色

- **JWT 認證**: 安全的 Token 認證機制
- **Google Sheets 存儲**: 使用 Google Sheets 作為資料庫
- **密碼加密**: 使用 bcrypt 加密密碼
- **輸入驗證**: 完整的資料驗證和錯誤處理
- **TypeScript**: 完整的類型安全

## API 端點

### 認證路由 (`/api/auth`)

| 方法 | 端點 | 描述 | 認證需求 |
|------|------|------|----------|
| POST | `/register` | 用戶註冊 | 無 |
| POST | `/login` | 用戶登入 | 無 |
| POST | `/logout` | 用戶登出 | 需要 |
| GET | `/me` | 獲取當前用戶信息 | 需要 |
| POST | `/refresh` | 刷新 JWT Token | 無 |
| PUT | `/profile` | 更新用戶資訊 | 需要 |
| PUT | `/password` | 更改密碼 | 需要 |

### 請求/回應範例

#### 用戶註冊
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "張三"
}
```

#### 用戶登入
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### 獲取用戶信息
```bash
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## 環境設定

1. 複製環境變數範本：
```bash
cp .env.example .env
```

2. 設定以下環境變數：

### 服務器配置
- `PORT`: 服務器端口 (預設: 3001)
- `NODE_ENV`: 環境 (development/production)
- `FRONTEND_URL`: 前端 URL (用於 CORS)

### JWT 配置
- `JWT_SECRET`: JWT 密鑰 (生產環境必須設定)
- `JWT_EXPIRES_IN`: Token 過期時間 (預設: 24h)

### Google Sheets API
- `GOOGLE_SPREADSHEET_ID`: Google 試算表 ID
- `GOOGLE_CLIENT_EMAIL`: 服務帳戶信箱
- `GOOGLE_PRIVATE_KEY`: 服務帳戶私鑰

## 安裝和運行

1. 安裝依賴：
```bash
npm install
```

2. 編譯 TypeScript：
```bash
npm run build
```

3. 開發模式運行：
```bash
npm run dev
```

4. 生產模式運行：
```bash
npm start
```

## 資料結構

### 用戶資料 (Google Sheets)
| 欄位 | 類型 | 描述 |
|------|------|------|
| user_id | string | UUID 用戶 ID |
| email | string | 電子信箱 |
| name | string | 用戶姓名 |
| password_hash | string | 加密後的密碼 |
| created_at | string | 創建時間 (ISO 8601) |
| preferences | string | 用戶偏好設定 (JSON) |

## 安全特色

- **密碼加密**: 使用 bcrypt (預設 12 輪加密)
- **JWT 認證**: 安全的 Token 機制
- **輸入驗證**: 
  - Email 格式驗證
  - 密碼強度檢查 (至少 8 字符，包含大小寫字母和數字)
  - 姓名格式驗證
- **錯誤處理**: 統一的錯誤回應格式
- **CORS 設定**: 僅允許指定的前端域名

## 錯誤處理

所有 API 回應都使用統一格式：

### 成功回應
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 錯誤回應
```json
{
  "success": false,
  "message": "錯誤描述",
  "errors": [
    {
      "field": "email",
      "message": "請輸入有效的電子信箱",
      "value": "invalid-email"
    }
  ]
}
```

## 開發注意事項

1. **環境變數**: 確保在生產環境中設定強密碼的 JWT_SECRET
2. **Google Sheets**: 確保服務帳戶有試算表的編輯權限
3. **CORS**: 根據前端部署 URL 調整 FRONTEND_URL
4. **密碼政策**: 可在 validation.ts 中調整密碼強度要求
5. **Token 過期**: 客戶端需要處理 Token 過期並重新登入

## 目錄結構

```
backend/
├── src/
│   ├── controllers/          # 路由控制器
│   │   └── authController.ts
│   ├── middleware/           # 中間件
│   │   ├── auth.ts          # JWT 認證中間件
│   │   └── validation.ts    # 輸入驗證中間件
│   ├── routes/              # API 路由
│   │   └── auth.ts
│   ├── services/            # 業務邏輯服務
│   │   ├── googleSheets.ts  # Google Sheets 服務
│   │   └── userService.ts   # 用戶服務
│   ├── types/               # TypeScript 類型定義
│   │   └── index.ts
│   ├── utils/               # 工具函數
│   │   └── jwt.ts           # JWT 工具
│   └── app.ts               # 主應用程式
├── .env.example             # 環境變數範本
├── package.json
├── tsconfig.json
└── README.md
```