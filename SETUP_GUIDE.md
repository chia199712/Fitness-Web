# Fitness App 設置指南

## 目前狀態
✅ **前端建置** - 正常運作  
✅ **後端建置** - 正常運作  
✅ **開發伺服器** - 可啟動  
✅ **API 整合** - 基礎配置完成  
⚠️ **Google Sheets 整合** - 需要憑證配置  

## 快速啟動

### 1. 啟動後端伺服器
```bash
cd backend
npm start
```
伺服器將在 http://localhost:3000 啟動

### 2. 啟動前端開發伺服器
```bash
cd frontend  
npm run dev
```
前端將在 http://localhost:5173 啟動

### 3. 健康檢查
```bash
curl http://localhost:3000/health
```

## Google Sheets 配置（可選）

目前應用使用 Google Sheets 作為資料庫。要完全啟用資料功能：

### 1. 建立 Google Service Account
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 建立服務帳戶憑證
5. 下載 JSON 憑證檔案

### 2. 建立 Google Sheets
1. 建立新的 Google Sheets 文檔
2. 記錄 Sheets ID（URL 中的長字串）
3. 與服務帳戶共享文檔（編輯權限）

### 3. 更新環境變數
在 `backend/.env` 中更新：
```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json
GOOGLE_SHEETS_ID=your-google-sheets-id
```

## 功能狀態

### ✅ 完成的功能
- **建置系統** - 前後端都能正常編譯
- **開發環境** - 熱重載開發伺服器
- **API 架構** - RESTful API 端點
- **認證系統** - JWT 認證機制
- **TypeScript 支援** - 完整的型別安全
- **React 前端** - 現代化 React 應用
- **路由系統** - React Router 導航

### ⚠️ 需要配置的部分
- **Google Sheets 憑證** - 資料儲存功能
- **生產環境配置** - 環境變數優化

### 🔄 開發中的功能
- **使用者介面** - 各頁面功能完善
- **資料視覺化** - 儀表板圖表
- **訓練記錄** - 完整的健身追蹤

## 開發指令

### 後端
```bash
npm run dev     # 開發模式（熱重載）
npm run build   # 建置生產版本
npm start       # 啟動生產伺服器
npm test        # 執行測試
```

### 前端  
```bash
npm run dev     # 開發伺服器
npm run build   # 建置生產版本
npm run preview # 預覽生產版本
```

## 專案特色

### 技術堆疊
- **後端**: Node.js + Express + TypeScript
- **前端**: React + TypeScript + Vite
- **樣式**: Tailwind CSS
- **資料庫**: Google Sheets（獨特架構）
- **認證**: JWT Token
- **建置工具**: Vite + TypeScript

### 架構優勢
- 完整的 TypeScript 支援
- 現代化的 React 開發
- RESTful API 設計
- 響應式使用者介面
- 模組化程式碼結構