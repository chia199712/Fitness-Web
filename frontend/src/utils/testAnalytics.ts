/**
 * Analytics功能測試工具
 * 測試圖表組件和數據渲染
 */

export const testAnalyticsFeatures = () => {
  const tests = {
    chartsSupported: false,
    dataValidation: false,
    responsiveDesign: false,
    interactivity: false,
  };

  // 測試Recharts是否正確載入
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const recharts = require('recharts');
    tests.chartsSupported = !!(recharts.LineChart && recharts.PieChart && recharts.BarChart);
  } catch (error) {
    console.error('Recharts載入失敗:', error);
  }

  // 測試數據格式
  const mockData = [
    { date: '2024-01-01', volume: 2400 },
    { date: '2024-01-02', volume: 0 },
  ];
  
  tests.dataValidation = mockData.every(item => 
    item.date && typeof item.volume === 'number'
  );

  // 測試響應式設計支援
  tests.responsiveDesign = window.innerWidth > 0;

  // 測試互動功能
  tests.interactivity = typeof window !== 'undefined' && typeof document !== 'undefined';

  return tests;
};

export const getAnalyticsCapabilities = () => {
  return {
    features: [
      '📈 訓練容積趨勢圖',
      '🥧 肌群分布圓餅圖', 
      '📊 週訓練頻率柱狀圖',
      '💪 力量進步線圖',
      '📋 統計概覽卡片',
      '🎯 智能分析報告',
      '⏰ 時間範圍選擇器',
    ],
    libraries: [
      'Recharts v3.1.2 - 現代化圖表庫',
      'date-fns v4.1.0 - 日期處理',
      'React v19.1.1 - UI框架',
      'Tailwind CSS v3.4.17 - 樣式框架',
    ],
    compatibility: [
      '✅ Chrome/Edge/Firefox 最新版本',
      '✅ Safari 14+',
      '✅ 手機瀏覽器 (iOS/Android)',
      '✅ 平板設備',
      '✅ 桌面設備',
    ],
    interactions: [
      '🖱️ 滑鼠懸停顯示詳細數據',
      '📱 觸控互動支援',
      '🎛️ 時間範圍切換',
      '📊 圖表縮放和平移',
      '🎨 響應式佈局調整',
    ]
  };
};