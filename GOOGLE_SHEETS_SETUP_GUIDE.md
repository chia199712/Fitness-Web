# Google Sheets 數據存儲設置指南

## 概述
您的健身應用使用 Google Sheets 作為數據存儲後端。以下是完整的設置步驟：

## 步驟 1：創建 Google Sheets 文檔

1. 前往 [Google Sheets](https://sheets.google.com/)
2. 點擊 "+ 空白" 創建新的試算表
3. 將試算表重新命名為 `FitnessApp-Database`
4. 複製瀏覽器 URL 中的 Spreadsheet ID
   - URL 格式：`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0`
   - 複製 `{SPREADSHEET_ID}` 部分

## 步驟 2：設定 Google Cloud Console

### 2.1 創建專案
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊專案選擇器，然後點擊 "新增專案"
3. 輸入專案名稱（例如：`fitness-app`）
4. 點擊 "建立"

### 2.2 啟用 APIs
1. 在側邊選單中點擊 "APIs 和服務" > "程式庫"
2. 搜尋並啟用以下 APIs：
   - Google Sheets API
   - Google Drive API

### 2.3 創建服務帳號
1. 前往 "APIs 和服務" > "憑證"
2. 點擊 "+ 建立憑證" > "服務帳號"
3. 填寫服務帳號詳細資訊：
   - 服務帳號名稱：`fitness-app-service`
   - 描述：`Fitness App Google Sheets Access`
4. 點擊 "建立並繼續"
5. 在角色部分，選擇 "編輯者" 角色
6. 點擊 "完成"

### 2.4 創建服務帳號金鑰
1. 在憑證頁面中，找到剛創建的服務帳號
2. 點擊服務帳號名稱進入詳細資訊
3. 點擊 "金鑰" 分頁
4. 點擊 "新增金鑰" > "建立新的金鑰"
5. 選擇 "JSON" 格式
6. 點擊 "建立" - 會自動下載 JSON 檔案

## 步驟 3：設定 Google Sheets 權限

1. 打開下載的 JSON 金鑰檔案
2. 找到 `client_email` 欄位的值（類似：`fitness-app-service@your-project.iam.gserviceaccount.com`）
3. 回到您的 Google Sheets 文檔
4. 點擊右上角的 "共用" 按鈕
5. 將服務帳號的 email 地址加入，並給予 "編輯者" 權限
6. 取消勾選 "通知使用者"
7. 點擊 "共用"

## 步驟 4：配置環境變數

1. 開啟 `backend/.env` 檔案
2. 從 JSON 金鑰檔案中提取以下資訊：

```env
GOOGLE_SPREADSHEET_ID=您的-Spreadsheet-ID
GOOGLE_CLIENT_EMAIL=服務帳號的email地址
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n完整的私鑰內容\n-----END PRIVATE KEY-----"
```

### 注意事項：
- `GOOGLE_PRIVATE_KEY` 必須包含完整的 BEGIN 和 END 標記
- 私鑰中的換行符必須用 `\n` 表示
- 整個私鑰要用雙引號包圍

## 步驟 5：測試連接

1. 重新啟動後端服務器：
```bash
cd backend
npm run dev
```

2. 檢查終端輸出，確認沒有 Google Sheets 連接錯誤

## 數據結構

應用會自動在 Google Sheets 中創建以下工作表：
- `Users` - 用戶資料
- `Exercises` - 動作庫
- `Workouts` - 訓練記錄
- `WorkoutExercises` - 訓練動作關聯
- `Sets` - 組數記錄
- `Templates` - 訓練模板
- `Settings` - 用戶設定

## 故障排除

### 常見錯誤：
1. **403 權限錯誤**：檢查服務帳號是否已加入 Google Sheets 共用權限
2. **私鑰格式錯誤**：確保私鑰包含完整的標記且換行符正確
3. **Spreadsheet ID 錯誤**：確認從正確的 URL 複製了 Spreadsheet ID

### 測試連接：
```bash
# 後端目錄下執行
npm run test:sheets
```

## 安全建議

1. 不要將 `.env` 檔案提交到版本控制
2. 定期輪換服務帳號金鑰
3. 使用最小權限原則設定服務帳號角色
4. 監控 Google Cloud Console 中的 API 使用情況