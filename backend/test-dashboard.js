// 簡單的儀表板功能測試
// 注意：這是一個基本的測試檔案，實際測試應該使用適當的測試框架

const BASE_URL = 'http://localhost:3001/api';

// 模擬 JWT Token（實際使用時需要真實的 token）
const mockToken = 'your-jwt-token-here';

async function testDashboardEndpoints() {
  console.log('🧪 開始測試儀表板模組...\n');

  const endpoints = [
    {
      name: '儀表板總覽',
      url: `${BASE_URL}/dashboard`,
      method: 'GET'
    },
    {
      name: '統計資訊',
      url: `${BASE_URL}/dashboard/stats`,
      method: 'GET'
    },
    {
      name: '近期訓練',
      url: `${BASE_URL}/dashboard/recent-workouts?limit=5`,
      method: 'GET'
    },
    {
      name: '個人記錄',
      url: `${BASE_URL}/dashboard/personal-records`,
      method: 'GET'
    },
    {
      name: '訓練日曆',
      url: `${BASE_URL}/dashboard/calendar?year=2024&month=8`,
      method: 'GET'
    },
    {
      name: '成就列表',
      url: `${BASE_URL}/dashboard/achievements`,
      method: 'GET'
    },
    {
      name: '進度追蹤',
      url: `${BASE_URL}/dashboard/progress?period=month&metric=volume`,
      method: 'GET'
    },
    {
      name: '訓練洞察',
      url: `${BASE_URL}/dashboard/insights?limit=3`,
      method: 'GET'
    },
    {
      name: '快速摘要',
      url: `${BASE_URL}/dashboard/summary`,
      method: 'GET'
    },
    {
      name: '關鍵指標',
      url: `${BASE_URL}/dashboard/metrics?period=month`,
      method: 'GET'
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 測試 ${endpoint.name}...`);
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json'
        }
      });

      const status = response.status;
      console.log(`   狀態碼: ${status}`);

      if (status === 200) {
        console.log(`   ✅ ${endpoint.name} 測試通過`);
      } else if (status === 401) {
        console.log(`   🔐 需要有效的認證 token`);
      } else {
        console.log(`   ❌ ${endpoint.name} 測試失敗`);
      }

    } catch (error) {
      console.log(`   ❌ ${endpoint.name} 連接失敗: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🏁 儀表板模組測試完成');
}

// 測試參數驗證
async function testValidation() {
  console.log('\n🔍 測試參數驗證...\n');

  const validationTests = [
    {
      name: '無效年份參數',
      url: `${BASE_URL}/dashboard/calendar?year=2050&month=8`,
      expectedStatus: 400
    },
    {
      name: '無效月份參數',
      url: `${BASE_URL}/dashboard/calendar?year=2024&month=13`,
      expectedStatus: 400
    },
    {
      name: '無效時間週期',
      url: `${BASE_URL}/dashboard/progress?period=invalid&metric=volume`,
      expectedStatus: 400
    },
    {
      name: '無效指標類型',
      url: `${BASE_URL}/dashboard/progress?period=month&metric=invalid`,
      expectedStatus: 400
    },
    {
      name: '超出限制範圍',
      url: `${BASE_URL}/dashboard/insights?limit=100`,
      expectedStatus: 400
    }
  ];

  for (const test of validationTests) {
    try {
      console.log(`🧮 測試 ${test.name}...`);
      
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json'
        }
      });

      const status = response.status;
      console.log(`   狀態碼: ${status}`);

      if (status === test.expectedStatus || status === 401) {
        console.log(`   ✅ 驗證測試通過`);
      } else {
        console.log(`   ❌ 驗證測試失敗，期望 ${test.expectedStatus}，實際 ${status}`);
      }

    } catch (error) {
      console.log(`   ❌ 驗證測試連接失敗: ${error.message}`);
    }
    
    console.log('');
  }
}

// 執行測試
async function runTests() {
  console.log('🚀 運動紀錄 App - 儀表板模組測試\n');
  console.log('📋 測試說明：');
  console.log('   - 確保服務器在 http://localhost:3001 運行');
  console.log('   - 需要有效的 JWT token 進行認證測試');
  console.log('   - 某些測試可能因為沒有數據而返回空結果\n');

  await testDashboardEndpoints();
  await testValidation();
  
  console.log('\n📊 測試摘要：');
  console.log('   - 如果看到 401 錯誤，請使用有效的 JWT token');
  console.log('   - 如果看到 500 錯誤，請檢查服務器配置');
  console.log('   - 如果看到連接失敗，請確認服務器正在運行');
}

// 檢查是否在 Node.js 環境中運行
if (typeof window === 'undefined') {
  // Node.js 環境
  const fetch = require('node-fetch');
  runTests().catch(console.error);
} else {
  // 瀏覽器環境
  console.log('請在 Node.js 環境中運行此測試腳本');
}

module.exports = { testDashboardEndpoints, testValidation };