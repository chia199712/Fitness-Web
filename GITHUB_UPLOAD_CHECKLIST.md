# 📋 GitHub 上傳檢查清單

## ✅ 可以上傳的檔案

### 📄 文檔檔案
```
✅ README.md
✅ LICENSE
✅ GOOGLE_SHEETS_SETUP_GUIDE.md
✅ docs/DEPLOYMENT_GUIDE.md
✅ GITHUB_UPLOAD_CHECKLIST.md
```

### 🖼️ 截圖和圖片
```
✅ docs/screenshots/dashboard.jpg
✅ docs/screenshots/analytics.jpg  
✅ docs/screenshots/workout-log.jpg
✅ docs/screenshots/exercise-library.jpg
```

### ⚙️ 配置檔案
```
✅ .gitignore
✅ backend/.env.example            # 範本檔案 (不含真實密鑰)
✅ backend/package.json
✅ backend/tsconfig.json
✅ frontend/package.json
✅ frontend/vite.config.ts
✅ frontend/tailwind.config.js
```

### 💻 程式碼檔案
```
✅ backend/src/**/*.ts             # 所有 TypeScript 原始碼
✅ frontend/src/**/*.ts
✅ frontend/src/**/*.tsx
✅ backend/test-sheets-connection.js
```

### 🧪 測試檔案
```
✅ backend/tests/**/*.test.ts
✅ frontend/src/**/*.test.ts
```

---

## ❌ 絕對不可上傳的檔案

### 🔐 敏感配置檔案
```
❌ backend/.env                    # 包含真實 API 金鑰和密碼
❌ **/*.env                        # 任何環境變數檔案
❌ **/.env.local
❌ **/.env.production
```

### 🗝️ 金鑰和認證檔案
```
❌ **/*service-account*.json       # Google Service Account 金鑰
❌ **/*private-key*.pem
❌ **/*certificate*.crt
❌ **/*keyfile*
❌ **/*credentials*
```

### 📁 系統和建置檔案
```
❌ node_modules/                   # 依賴包資料夾
❌ dist/                          # 建置輸出
❌ build/
❌ .next/
❌ coverage/
```

### 💾 數據庫和日誌檔案
```
❌ *.db                           # 數據庫檔案
❌ *.sqlite
❌ *.log                          # 日誌檔案
❌ logs/
```

### 🖥️ 開發環境檔案
```
❌ .DS_Store                      # macOS 系統檔案
❌ Thumbs.db                      # Windows 系統檔案
❌ .vscode/settings.json          # 個人 IDE 設定
❌ .idea/                         # IntelliJ 設定
```

### 📸 原始圖片檔案
```
❌ 圖片/                          # 原始截圖資料夾
❌ **/*messageImage_*
```

---

## 🛡️ 安全檢查步驟

### 1. 檢查 .env 檔案
```bash
# 確認 .env 檔案不會被上傳
git status
# 應該顯示 .env 被忽略
```

### 2. 掃描敏感字串
```bash
# 搜尋可能的敏感資訊
grep -r "password" --exclude-dir=node_modules .
grep -r "secret" --exclude-dir=node_modules .
grep -r "private_key" --exclude-dir=node_modules .
```

### 3. 檢查 .gitignore
```bash
# 確認 .gitignore 包含必要規則
cat .gitignore
```

### 4. 測試忽略規則
```bash
# 添加測試檔案確認被忽略
touch .env
echo "TEST_SECRET=123" > .env
git status
# .env 應該不在 untracked files 列表中
```

---

## 🚀 上傳前最後檢查

### ✅ 檢查清單
- [ ] `.env` 檔案已加入 `.gitignore`
- [ ] 所有真實密鑰已從程式碼中移除
- [ ] `.env.example` 只包含範例值
- [ ] `README.md` 不包含任何真實 API 金鑰
- [ ] 原始圖片資料夾已被忽略
- [ ] `node_modules` 資料夾已被忽略

### 🔍 最終驗證指令
```bash
# 查看即將提交的檔案
git add .
git status

# 檢查是否有敏感檔案
git diff --cached | grep -i "password\|secret\|private_key"
```

---

## 💡 上傳建議

1. **分批上傳**：先上傳文檔和配置，再上傳程式碼
2. **檢查兩次**：每次 commit 前都要檢查敏感資料
3. **使用 branch**：在分支上測試，確認無誤再合併到 main
4. **定期清理**：定期檢查並清理不需要的檔案

---

🔒 **記住：一旦上傳到 GitHub，檔案歷史就會永久保存，即使後來刪除也可能被找到！**