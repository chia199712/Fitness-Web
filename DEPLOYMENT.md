# 部署指南

## 快速部署

### 1. 本地開發部署
```bash
# 後端
cd backend
npm install
npm run dev

# 前端 (新終端)
cd frontend
npm install
npm run dev
```

### 2. 生產環境部署

#### 後端部署
```bash
cd backend
npm install
npm run build
npm start
```

#### 前端部署
```bash
cd frontend
npm install
npm run build
# 將 dist/ 目錄部署到靜態文件服務器
```

### 3. 環境變數配置
複製 `backend/.env.example` 到 `backend/.env` 並設定：
- Google Sheets 憑證
- JWT Secret
- 其他配置項目

## 技術架構
- **前端**: React + TypeScript + Vite + TailwindCSS
- **後端**: Node.js + Express + TypeScript
- **數據存儲**: Google Sheets API
- **認證**: JWT

更多詳細信息請參考 README.md 和 LOCAL_SETUP_GUIDE.md