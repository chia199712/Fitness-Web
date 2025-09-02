# 個人設定模組總結

## 概述

個人設定模組是運動紀錄 App 的核心功能之一，提供全面的用戶設定管理能力。該模組支援偏好設定、通知管理、隱私控制、帳戶安全、資料匯出和備份恢復等功能。

## 主要功能特色

### 1. 多層次設定管理
- **偏好設定**: 單位系統、主題、語言、時區、休息時間等
- **通知設定**: 訓練提醒、成就通知、電子郵件頻率、安靜時間
- **隱私設定**: 資料可見性、好友請求、第三方整合控制
- **帳戶設定**: 個人資料、健身目標、緊急聯絡人
- **安全設定**: 密碼管理、兩步驟驗證、登入歷史

### 2. 資料管理功能
- **資料匯出**: 支援 JSON 和 CSV 格式匯出用戶資料
- **使用統計**: 詳細的使用情況分析和統計
- **設定備份**: 自動和手動備份設定，支援版本管理
- **設定恢復**: 從備份恢復特定或全部設定

### 3. 安全與隱私保護
- **密碼加密**: 使用 bcrypt 進行安全的密碼哈希
- **權限控制**: 嚴格的用戶權限驗證
- **資料脫敏**: 敏感資訊的安全處理
- **審計日誌**: 重要操作的完整記錄

## 技術架構

### 核心組件

#### 1. SettingsService (`src/services/settingsService.ts`)
**主要職責:**
- 設定資料的 CRUD 操作
- 預設設定的建立和管理
- 密碼變更和安全操作
- 資料匯出和備份功能
- 使用統計收集

**核心方法:**
```typescript
// 基本設定管理
getUserSettings(userId: string): Promise<UserSettings>
updatePreferences(userId: string, updates: UpdatePreferencesRequest): Promise<UserPreferences>
updateNotificationSettings(userId: string, updates: UpdateNotificationSettingsRequest): Promise<NotificationSettings>
updatePrivacySettings(userId: string, updates: UpdatePrivacySettingsRequest): Promise<PrivacySettings>
updateAccountInfo(userId: string, updates: UpdateAccountInfoRequest): Promise<AccountInfo>

// 安全功能
changePassword(userId: string, request: ChangePasswordRequest): Promise<boolean>

// 資料管理
exportUserData(userId: string, request: ExportDataRequest): Promise<ExportDataResponse>
deleteAccount(userId: string, request: DeleteAccountRequest): Promise<boolean>

// 備份恢復
createSettingsBackup(userId: string, settings?: UserSettings, type?: 'manual' | 'automatic', description?: string): Promise<SettingsBackup>
restoreSettings(userId: string, request: RestoreSettingsRequest): Promise<UserSettings>
resetSettings(userId: string, request: ResetSettingsRequest): Promise<UserSettings>

// 統計分析
getUsageStatistics(userId: string): Promise<UsageStatistics>
```

#### 2. SettingsController (`src/controllers/settingsController.ts`)
**主要職責:**
- HTTP 請求處理和回應
- 輸入驗證和錯誤處理
- 業務邏輯的協調
- API 端點的實現

**API 端點映射:**
```typescript
GET    /api/settings                    -> getUserSettings()
PUT    /api/settings                    -> updateUserSettings()
GET    /api/settings/preferences        -> getPreferences()
PUT    /api/settings/preferences        -> updatePreferences()
GET    /api/settings/notifications      -> getNotificationSettings()
PUT    /api/settings/notifications      -> updateNotificationSettings()
GET    /api/settings/privacy            -> getPrivacySettings()
PUT    /api/settings/privacy            -> updatePrivacySettings()
GET    /api/settings/profile            -> getProfile()
PUT    /api/settings/profile            -> updateProfile()
GET    /api/settings/security           -> getSecuritySettings()
PUT    /api/settings/password           -> changePassword()
DELETE /api/settings/account            -> deleteAccount()
POST   /api/settings/export             -> exportData()
GET    /api/settings/usage-stats        -> getUsageStatistics()
POST   /api/settings/reset              -> resetSettings()
POST   /api/settings/backup             -> createBackup()
POST   /api/settings/restore            -> restoreSettings()
```

#### 3. 類型定義 (`src/types/index.ts`)
**新增的主要類型:**
```typescript
// 枚舉類型
enum UnitSystem { METRIC, IMPERIAL }
enum ThemeMode { LIGHT, DARK, AUTO }
enum Language { ZH_TW, ZH_CN, EN, JA }
enum PrivacySetting { PUBLIC, PRIVATE, FRIENDS_ONLY }

// 設定介面
interface UserPreferences { ... }
interface NotificationSettings { ... }
interface PrivacySettings { ... }
interface AccountInfo { ... }
interface SecuritySettings { ... }
interface UserSettings { ... }

// 請求類型
interface UpdatePreferencesRequest { ... }
interface ChangePasswordRequest { ... }
interface ExportDataRequest { ... }
interface DeleteAccountRequest { ... }

// 回應類型
interface ExportDataResponse { ... }
interface UsageStatistics { ... }
interface SettingsBackup { ... }
```

#### 4. 驗證中間件 (`src/middleware/validation.ts`)
**驗證規則集合:**
```typescript
export const validateSettings = {
  updateSettings: [...],      // 完整設定更新驗證
  updatePreferences: [...],   // 偏好設定驗證
  updateNotifications: [...], // 通知設定驗證
  updatePrivacy: [...],       // 隱私設定驗證
  updateProfile: [...],       // 個人資料驗證
  changePassword: [...],      // 密碼變更驗證
  deleteAccount: [...],       // 帳戶刪除驗證
  exportData: [...],          // 資料匯出驗證
  resetSettings: [...],       // 設定重置驗證
  restoreSettings: [...]      // 設定恢復驗證
}
```

#### 5. 路由配置 (`src/routes/settings.ts`)
**路由特性:**
- 所有路由都需要 JWT 認證
- 完整的驗證中間件整合
- RESTful API 設計原則
- 清晰的路由組織結構

## 資料存儲結構

### Google Sheets 表格設計

#### 1. UserSettings 表格
| 欄位 | 類型 | 說明 |
|------|------|------|
| user_id | String | 用戶 UUID |
| preferences | JSON | 偏好設定 JSON 字串 |
| notifications | JSON | 通知設定 JSON 字串 |
| privacy | JSON | 隱私設定 JSON 字串 |
| account | JSON | 帳戶資訊 JSON 字串 |
| security | JSON | 安全設定 JSON 字串 |
| created_at | DateTime | 建立時間 |
| updated_at | DateTime | 更新時間 |
| settings_version | Number | 設定版本號 |

#### 2. SettingsBackups 表格
| 欄位 | 類型 | 說明 |
|------|------|------|
| backup_id | String | 備份 UUID |
| user_id | String | 用戶 UUID |
| settings_snapshot | JSON | 設定快照 |
| backup_date | DateTime | 備份時間 |
| backup_type | String | 備份類型 (manual/automatic) |
| description | String | 備份描述 |

## 實作特色

### 1. 預設值處理
```typescript
// 智能預設設定
const defaultSettings: UserSettings = {
  preferences: {
    unit_system: UnitSystem.METRIC,
    default_rest_time: 90,
    theme: ThemeMode.AUTO,
    language: Language.ZH_TW,
    timezone: 'Asia/Taipei'
    // ... 更多預設值
  },
  // ... 其他設定類別
};
```

### 2. 版本管理
```typescript
// 設定版本控制
settings.settings_version += 1;
settings.updated_at = new Date().toISOString();
```

### 3. 安全密碼處理
```typescript
// 安全的密碼哈希
const saltRounds = 12;
const newPasswordHash = await bcrypt.hash(request.new_password, saltRounds);

// 密碼驗證
const isCurrentPasswordValid = await bcrypt.compare(request.current_password, userData.password_hash);
```

### 4. 資料驗證
```typescript
// 完整的輸入驗證
body('default_rest_time')
  .optional()
  .isInt({ min: 0, max: 3600 })
  .withMessage('預設休息時間必須是 0-3600 秒之間的整數')
```

### 5. 錯誤處理
```typescript
// 統一的錯誤處理模式
try {
  // 業務邏輯
} catch (error: any) {
  console.error('Error details:', error);
  res.status(400).json({
    success: false,
    message: error.message || '操作失敗'
  });
}
```

## 整合點

### 1. 認證系統整合
- 使用現有的 JWT 認證中間件
- 整合 `authenticateToken` 進行用戶驗證
- 支援用戶權限檢查

### 2. Google Sheets 整合
- 使用現有的 `GoogleSheetsService`
- 統一的資料存取介面
- 支援資料的讀取、寫入、更新操作

### 3. 用戶服務整合
- 與現有用戶服務的密碼管理整合
- 支援帳戶刪除和用戶資料清理
- 統一的用戶資料管理

## 使用範例

### 1. 基本設定操作
```javascript
// 取得用戶設定
const settings = await fetch('/api/settings', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 更新偏好設定
await fetch('/api/settings/preferences', {
  method: 'PUT',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    theme: 'dark',
    unit_system: 'metric',
    default_rest_time: 120
  })
});
```

### 2. 安全操作
```javascript
// 變更密碼
await fetch('/api/settings/password', {
  method: 'PUT',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    current_password: 'oldPassword123',
    new_password: 'newPassword123',
    confirm_password: 'newPassword123'
  })
});
```

### 3. 資料管理
```javascript
// 匯出資料
const exportResult = await fetch('/api/settings/export', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    format: 'json',
    data_types: ['workouts', 'settings']
  })
});
```

## 部署注意事項

### 1. 環境變數
確保以下環境變數正確設定：
```bash
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
```

### 2. 依賴套件
```bash
npm install bcrypt @types/bcrypt
```

### 3. Google Sheets 權限
確保服務帳戶有適當的 Google Sheets 讀寫權限。

## 測試建議

### 1. 單元測試
- 設定服務的各個方法
- 驗證規則的正確性
- 錯誤處理的完整性

### 2. 整合測試
- API 端點的完整流程
- 認證和權限控制
- 資料一致性檢查

### 3. 安全測試
- 密碼變更功能
- 權限邊界測試
- 資料洩漏檢查

## 效能考量

### 1. 資料快取
- 考慮實作設定資料的記憶體快取
- 減少對 Google Sheets 的頻繁存取

### 2. 批量操作
- 支援批量設定更新
- 減少網路請求次數

### 3. 資料壓縮
- 大型資料匯出的壓縮處理
- 分頁或分批匯出機制

## 擴展性設計

### 1. 新設定類型
- 易於新增新的設定類別
- 向後相容的版本管理

### 2. 第三方整合
- 預留第三方服務整合介面
- 支援多種資料匯出格式

### 3. 多語言支援
- 完整的國際化支援
- 動態語言切換

## 總結

個人設定模組提供了全面且安全的用戶設定管理功能，具有以下優勢：

1. **功能完整**: 涵蓋所有主要的設定管理需求
2. **安全可靠**: 實作了完整的安全措施和資料保護
3. **易於使用**: 直觀的 API 設計和清晰的文檔
4. **高度整合**: 與現有系統的無縫整合
5. **可擴展性**: 支援未來功能的擴展和改進

該模組為運動紀錄 App 提供了堅實的設定管理基礎，確保用戶能夠完全控制和自訂他們的使用體驗。