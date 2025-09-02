/**
 * Google Sheets 連接測試腳本
 * 運行此腳本來驗證 Google Sheets API 配置是否正確
 */

require('dotenv').config();

async function testSheetsConnection() {
  console.log('🧪 開始測試 Google Sheets 連接...\n');

  // 檢查環境變數
  console.log('📋 檢查環境變數:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- USE_MOCK_DATA: ${process.env.USE_MOCK_DATA}`);
  console.log(`- GOOGLE_SPREADSHEET_ID: ${process.env.GOOGLE_SPREADSHEET_ID ? '✅ 已設定' : '❌ 未設定'}`);
  console.log(`- GOOGLE_CLIENT_EMAIL: ${process.env.GOOGLE_CLIENT_EMAIL ? '✅ 已設定' : '❌ 未設定'}`);
  console.log(`- GOOGLE_PRIVATE_KEY: ${process.env.GOOGLE_PRIVATE_KEY ? '✅ 已設定' : '❌ 未設定'}\n`);

  // 檢查必要的環境變數
  const requiredEnvVars = [
    'GOOGLE_SPREADSHEET_ID',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_PRIVATE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ 缺少必要的環境變數:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n請參考 GOOGLE_SHEETS_SETUP_GUIDE.md 進行設定\n');
    return;
  }

  // 測試 Google Sheets 服務
  try {
    console.log('🔗 嘗試連接 Google Sheets...');
    
    const { GoogleSheetsService } = require('./dist/services/googleSheetsService');
    const sheetsService = new GoogleSheetsService();
    
    // 測試基本連接
    await sheetsService.initialize();
    console.log('✅ Google Sheets 服務初始化成功');
    
    // 測試讀取試算表資訊
    const spreadsheetInfo = await sheetsService.getSpreadsheetInfo();
    console.log(`✅ 成功連接到試算表: "${spreadsheetInfo.title}"`);
    console.log(`📊 工作表數量: ${spreadsheetInfo.sheets.length}`);
    
    console.log('\n🎉 所有測試通過！您的 Google Sheets 配置正確。\n');
    
  } catch (error) {
    console.log('❌ Google Sheets 連接失敗:');
    console.error(error.message);
    console.log('\n💡 可能的解決方案:');
    console.log('1. 檢查 Spreadsheet ID 是否正確');
    console.log('2. 確認服務帳號已加入 Google Sheets 共用權限');
    console.log('3. 驗證服務帳號金鑰格式是否正確');
    console.log('4. 確認已啟用 Google Sheets API');
    console.log('\n詳細設定請參考 GOOGLE_SHEETS_SETUP_GUIDE.md\n');
  }
}

// 執行測試
testSheetsConnection().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('測試執行失敗:', error);
  process.exit(1);
});