# 🚀 Fitness Tracker App 部署指南

本指南詳細說明如何將 Fitness Tracker App 部署到不同的雲端平台。

## 📋 部署前準備

### 必要條件
- ✅ 已完成 Google Sheets API 設定
- ✅ 本地測試運行正常
- ✅ 已準備好所有環境變數
- ✅ GitHub 帳號

### 環境變數清單
```env
# 服務器配置
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# 數據配置
USE_MOCK_DATA=false

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Google Sheets API
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# 其他
BCRYPT_SALT_ROUNDS=12
```

## 🌐 部署選項

### 選項 1：Vercel + Railway (推薦)

#### 部署前端到 Vercel

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **連接 Vercel**
   - 前往 [Vercel Dashboard](https://vercel.com/dashboard)
   - 點擊 "New Project"
   - 選擇您的 GitHub 倉庫
   - 設定專案路徑為 `frontend`

3. **配置建構設定**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

4. **設定環境變數**
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```

#### 部署後端到 Railway

1. **前往 Railway**
   - 訪問 [Railway](https://railway.app/)
   - 使用 GitHub 登入

2. **創建新專案**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **配置根目錄**
   - 在專案設定中設定 `Root Directory` 為 `backend`

4. **設定環境變數**
   在 Railway 專案中的 Variables 頁面添加：
   ```env
   PORT=$PORT
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   USE_MOCK_DATA=false
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=24h
   GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=your-private-key-with-newlines
   BCRYPT_SALT_ROUNDS=12
   ```

5. **配置建構腳本**
   確保 `package.json` 包含：
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/app.js"
     }
   }
   ```

### 選項 2：Netlify + Render

#### 部署前端到 Netlify

1. **建構配置**
   在專案根目錄創建 `netlify.toml`：
   ```toml
   [build]
     base = "frontend/"
     publish = "frontend/dist/"
     command = "npm run build"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **部署步驟**
   - 前往 [Netlify](https://www.netlify.com/)
   - 拖曳 `frontend/dist` 資料夾到部署區域
   - 或連接 GitHub 倉庫自動部署

#### 部署後端到 Render

1. **創建 Web Service**
   - 前往 [Render](https://render.com/)
   - 創建新的 "Web Service"
   - 連接 GitHub 倉庫

2. **配置設定**
   ```yaml
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && npm start
   Root Directory: /
   ```

### 選項 3：全端 Heroku 部署

#### 準備 Heroku 部署

1. **安裝 Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **創建應用**
   ```bash
   heroku create your-fitness-app
   ```

3. **設定環境變數**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set USE_MOCK_DATA=false
   heroku config:set JWT_SECRET=your-secret
   # ... 其他環境變數
   ```

4. **配置 package.json**
   在根目錄創建：
   ```json
   {
     "name": "fitness-tracker-app",
     "version": "1.0.0",
     "scripts": {
       "heroku-postbuild": "cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build",
       "start": "cd backend && npm start"
     }
   }
   ```

## 🔒 安全最佳實踐

### 環境變數安全
1. **絕對不要**提交 `.env` 檔案到 Git
2. 使用強隨機 JWT SECRET
3. 定期輪換 Google Service Account 金鑰
4. 設定 CORS 白名單

### 生產環境檢查清單
- [ ] `NODE_ENV=production`
- [ ] `USE_MOCK_DATA=false` 
- [ ] 強密碼和金鑰
- [ ] HTTPS 啟用
- [ ] 錯誤處理和日誌記錄
- [ ] API 速率限制

## 🔧 故障排除

### 常見部署問題

#### 1. 建構失敗
```bash
# 檢查 Node.js 版本
node --version  # 應為 16+

# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install
```

#### 2. Google Sheets 連接失敗
```bash
# 測試本地連接
npm run test:sheets

# 檢查環境變數格式
echo $GOOGLE_PRIVATE_KEY | head -1  # 應該看到 "-----BEGIN PRIVATE KEY-----"
```

#### 3. CORS 錯誤
確保後端 CORS 配置包含前端域名：
```javascript
const allowedOrigins = [
  'https://your-frontend-domain.com',
  'https://your-frontend-domain.vercel.app'
];
```

#### 4. 環境變數未載入
檢查平台特定的環境變數設定方式：
- Vercel: Project Settings > Environment Variables
- Railway: Project > Variables
- Netlify: Site settings > Environment variables

## 📊 監控和維護

### 效能監控
1. **設定應用監控**
   - Vercel Analytics
   - Railway 內建監控
   - Google Sheets API 配額監控

2. **日誌監控**
   ```javascript
   // 在生產環境添加結構化日誌
   console.log(JSON.stringify({
     timestamp: new Date().toISOString(),
     level: 'info',
     message: 'User login',
     userId: user.id
   }));
   ```

### 備份策略
1. **Google Sheets 自動備份**
   - 定期下載 CSV 備份
   - 使用 Google Drive 版本歷史

2. **應用程式碼備份**
   - Git 版本控制
   - 定期標籤發布版本

## 🆙 更新和維護

### 滾動更新
```bash
# 1. 更新程式碼
git add .
git commit -m "Update: description"
git push origin main

# 2. 平台會自動重新部署
# Vercel/Netlify: 自動從 Git 觸發
# Railway/Render: 自動重新建構

# 3. 驗證部署
curl https://your-api-domain.com/health
```

### 版本管理
```bash
# 創建發布標籤
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 💰 成本預估

### 免費額度
- **Vercel**: 免費版足夠個人使用
- **Railway**: $5/月起，包含合理使用額度
- **Google Sheets API**: 每日 100 requests 免費
- **Netlify**: 免費版 100GB 頻寬

### 建議配置
- **個人使用**: Vercel (前端) + Railway (後端) ≈ $5/月
- **小團隊**: 升級到 Pro 版本 ≈ $20/月
- **企業級**: 考慮專用數據庫解決方案

---

🎉 **恭喜！** 您的 Fitness Tracker App 現在已經成功部署到雲端了！

如有部署問題，請參考各平台的官方文檔或開啟 GitHub Issue。