import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [restTimerSound, setRestTimerSound] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [distanceUnit, setDistanceUnit] = useState('m');
  const [defaultRestTime, setDefaultRestTime] = useState(90);
  const [theme, setTheme] = useState('light');
  const [success, setSuccess] = useState<string | null>(null);

  // 從 localStorage 載入設定
  useEffect(() => {
    const savedSettings = localStorage.getItem('fitness-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setRestTimerSound(settings.restTimerSound ?? true);
        setEmailNotifications(settings.emailNotifications ?? true);
        setWeightUnit(settings.weightUnit ?? 'kg');
        setDistanceUnit(settings.distanceUnit ?? 'm');
        setDefaultRestTime(settings.defaultRestTime ?? 90);
        setTheme(settings.theme ?? 'light');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    const settings = {
      restTimerSound,
      emailNotifications,
      weightUnit,
      distanceUnit,
      defaultRestTime,
      theme,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem('fitness-settings', JSON.stringify(settings));
    setSuccess('設定已保存！');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleClearData = () => {
    if (confirm('⚠️ 警告：這將清除所有本地資料！\n\n包括：\n- 訓練記錄\n- 動作歷史\n- 課表模板\n- 設定\n\n您確定要繼續嗎？')) {
      const confirmText = prompt('請輸入 "清除資料" 以確認：');
      if (confirmText === '清除資料') {
        // 清除所有健身相關的本地資料
        localStorage.removeItem('fitness-workouts');
        localStorage.removeItem('fitness-today-workout');
        localStorage.removeItem('fitness-exercise-history');
        localStorage.removeItem('fitness-workout-templates');
        localStorage.removeItem('fitness-user-exercises');
        localStorage.removeItem('fitness-settings');
        
        alert('✅ 所有資料已清除！頁面將重新載入。');
        window.location.reload();
      }
    }
  };

  const handleExportData = () => {
    try {
      const allData = {
        workouts: JSON.parse(localStorage.getItem('fitness-workouts') || '[]'),
        exerciseHistory: JSON.parse(localStorage.getItem('fitness-exercise-history') || '[]'),
        templates: JSON.parse(localStorage.getItem('fitness-workout-templates') || '[]'),
        userExercises: JSON.parse(localStorage.getItem('fitness-user-exercises') || '[]'),
        settings: JSON.parse(localStorage.getItem('fitness-settings') || '{}'),
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess('資料匯出成功！');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      alert('匯出資料失敗：' + (error as Error).message);
    }
  };

  const SettingRow = ({ 
    title, 
    description, 
    children 
  }: { 
    title: string; 
    description: string; 
    children: React.ReactNode; 
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1 pr-4">
        <h3 className="text-sm font-medium text-gray-900 leading-5">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 leading-4">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ 設定</h1>
        <p className="text-gray-600">管理您的應用程式偏好設定</p>
      </div>

      {/* 成功訊息 */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* 訓練設定 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">🏋️ 訓練設定</h2>
        
        <div className="space-y-1">
          <SettingRow
            title="預設休息時間"
            description="新增動作時的預設休息時間（秒）"
          >
            <select 
              value={defaultRestTime}
              onChange={(e) => setDefaultRestTime(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value={60}>60 秒</option>
              <option value={90}>90 秒</option>
              <option value={120}>120 秒</option>
              <option value={180}>180 秒</option>
            </select>
          </SettingRow>

          <SettingRow
            title="重量單位"
            description="顯示重量的預設單位"
          >
            <select 
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="kg">公斤 (kg)</option>
              <option value="lbs">磅 (lbs)</option>
            </select>
          </SettingRow>

          <SettingRow
            title="距離單位"
            description="有氧運動的預設距離單位"
          >
            <select 
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="m">公尺 (m)</option>
              <option value="km">公里 (km)</option>
              <option value="ft">英尺 (ft)</option>
              <option value="mi">英里 (mi)</option>
            </select>
          </SettingRow>
        </div>
      </div>

      {/* 介面設定 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">🎨 介面設定</h2>
        
        <div className="space-y-1">
          <SettingRow
            title="主題"
            description="選擇應用程式的外觀主題"
          >
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="light">淺色主題</option>
              <option value="dark">深色主題</option>
              <option value="auto">跟隨系統</option>
            </select>
          </SettingRow>

          <SettingRow
            title="休息計時器音效"
            description="休息計時結束時播放提醒音"
          >
            <Toggle 
              checked={restTimerSound}
              onChange={setRestTimerSound}
            />
          </SettingRow>

          <SettingRow
            title="通知提醒"
            description="顯示訓練提醒和應用程式通知"
          >
            <Toggle 
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
          </SettingRow>
        </div>
      </div>

      {/* 資料管理 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">💾 資料管理</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex-1 pr-4">
              <h3 className="text-sm font-medium text-gray-900 leading-5">匯出資料</h3>
              <p className="text-sm text-gray-500 mt-1 leading-4">下載您的所有訓練資料為 JSON 檔案</p>
            </div>
            <button 
              onClick={handleExportData}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium"
            >
              📤 匯出
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1 pr-4">
              <h3 className="text-sm font-medium text-red-600 leading-5">清除所有資料</h3>
              <p className="text-sm text-gray-500 mt-1 leading-4">永久刪除所有本地儲存的訓練資料</p>
            </div>
            <button 
              onClick={handleClearData}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
            >
              🗑️ 清除
            </button>
          </div>
        </div>
      </div>

      {/* 保存設定按鈕 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={handleSaveSettings}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
        >
          💾 保存設定
        </button>
      </div>

      {/* 應用程式資訊 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 應用程式資訊</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">版本：</span>
            <span className="text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">最後更新：</span>
            <span className="text-gray-900">{new Date().toLocaleDateString('zh-TW')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">資料儲存：</span>
            <span className="text-gray-900">本地瀏覽器</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">開發者：</span>
            <span className="text-gray-900">Claude Code</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;