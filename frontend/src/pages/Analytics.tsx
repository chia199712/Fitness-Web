import React, { useState, useEffect, useCallback } from 'react';
import type { Workout, WorkoutExercise } from '../types';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
// import { format } from 'date-fns';
// import { MUSCLE_GROUPS } from '../data/exercises';

// Analytics component props can be added here when needed

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all' | 'week' | 'month' | 'quarter'>('month');
  const [hasWorkoutData, setHasWorkoutData] = useState(false);
  // const [realWorkoutData, setRealWorkoutData] = useState<any[]>([]);

  const checkForRealWorkoutData = useCallback(() => {
    // 檢查 localStorage 是否有訓練記錄
    const storedWorkouts = localStorage.getItem('fitness-workouts');
    const storedSets = localStorage.getItem('fitness-workout-sets');
    
    if (storedWorkouts || storedSets) {
      try {
        const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
        const sets = storedSets ? JSON.parse(storedSets) : [];
        
        if (workouts.length > 0 || sets.length > 0) {
          setHasWorkoutData(true);
          processRealWorkoutData();
          return;
        }
      } catch (error) {
        console.error('Error parsing workout data:', error);
      }
    }
    
    setHasWorkoutData(false);
  }, []);

  useEffect(() => {
    // 檢查本地存儲或API是否有真實的訓練數據
    checkForRealWorkoutData();
  }, [checkForRealWorkoutData]);

  const processRealWorkoutData = () => {
    // 處理真實的訓練數據，計算容積、肌群分布等
    // const processedData = workouts.map(workout => {
    //   const workoutSets = sets.filter(set => set.workoutId === workout.id);
    //   const totalVolume = workoutSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    //   
    //   return {
    //     date: workout.date,
    //     volume: totalVolume,
    //     sets: workoutSets.length,
    //     exercises: workout.exercises?.length || 0,
    //   };
    // });
    
    // setRealWorkoutData(processedData);
  };

  // 模擬訓練容積數據
  const volumeData = [
    { date: '2024-01-01', volume: 2400, sets: 16, exercises: 6 },
    { date: '2024-01-02', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-03', volume: 3200, sets: 20, exercises: 8 },
    { date: '2024-01-04', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-05', volume: 2800, sets: 18, exercises: 7 },
    { date: '2024-01-06', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-07', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-08', volume: 2600, sets: 17, exercises: 6 },
    { date: '2024-01-09', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-10', volume: 3400, sets: 22, exercises: 9 },
    { date: '2024-01-11', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-12', volume: 2900, sets: 19, exercises: 7 },
    { date: '2024-01-13', volume: 0, sets: 0, exercises: 0 },
    { date: '2024-01-14', volume: 0, sets: 0, exercises: 0 },
  ];

  // 肌群分布數據
  const muscleGroupData = [
    { name: '胸部', value: 25, color: '#FF6B6B' },
    { name: '背部', value: 22, color: '#4ECDC4' },
    { name: '腿部', value: 20, color: '#45B7D1' },
    { name: '肩膀', value: 15, color: '#96CEB4' },
    { name: '手臂', value: 12, color: '#FFEAA7' },
    { name: '核心', value: 6, color: '#DDA0DD' },
  ];

  // 週訓練頻率數據
  const weeklyFrequency = [
    { day: '週一', workouts: 8, color: '#FF6B6B' },
    { day: '週二', workouts: 5, color: '#4ECDC4' },
    { day: '週三', workouts: 9, color: '#45B7D1' },
    { day: '週四', workouts: 6, color: '#96CEB4' },
    { day: '週五', workouts: 7, color: '#FFEAA7' },
    { day: '週六', workouts: 4, color: '#DDA0DD' },
    { day: '週日', workouts: 2, color: '#FFB74D' },
  ];

  // 進步追蹤數據
  const progressData = [
    { date: '1月', benchPress: 70, squat: 90, deadlift: 100 },
    { date: '2月', benchPress: 72, squat: 95, deadlift: 105 },
    { date: '3月', benchPress: 75, squat: 100, deadlift: 110 },
    { date: '4月', benchPress: 78, squat: 105, deadlift: 115 },
    { date: '5月', benchPress: 80, squat: 110, deadlift: 120 },
    { date: '6月', benchPress: 82, squat: 112, deadlift: 125 },
  ];

  // 休息時間分析數據
  const getRestTimeAnalytics = () => {
    const workouts = JSON.parse(localStorage.getItem('fitness-workouts') || '[]');
    const restTimeData: { date: string; avgRest: number; totalRests: number }[] = [];
    const restDistribution: { range: string; count: number; color: string }[] = [];
    
    let allRestTimes: number[] = [];
    
    workouts.forEach((workout: Workout) => {
      const exerciseRestTimes = workout.exercises?.flatMap((ex: WorkoutExercise) => (ex as WorkoutExercise & { actualRestTimes?: number[] }).actualRestTimes || []) || [];
      allRestTimes = [...allRestTimes, ...exerciseRestTimes];
      
      if (exerciseRestTimes.length > 0) {
        const avgRest = Math.round(exerciseRestTimes.reduce((sum: number, time: number) => sum + time, 0) / exerciseRestTimes.length);
        restTimeData.push({
          date: workout.date,
          avgRest,
          totalRests: exerciseRestTimes.length
        });
      }
    });
    
    // 計算休息時間分布
    const ranges = [
      { min: 0, max: 60, label: '< 1分鐘', color: '#FF6B6B' },
      { min: 60, max: 90, label: '1-1.5分鐘', color: '#FFEAA7' },
      { min: 90, max: 120, label: '1.5-2分鐘', color: '#96CEB4' },
      { min: 120, max: 180, label: '2-3分鐘', color: '#4ECDC4' },
      { min: 180, max: Infinity, label: '> 3分鐘', color: '#45B7D1' }
    ];
    
    ranges.forEach(range => {
      const count = allRestTimes.filter(time => time >= range.min && time < range.max).length;
      if (count > 0) {
        restDistribution.push({
          range: range.label,
          count,
          color: range.color
        });
      }
    });
    
    return {
      restTimeData: restTimeData.slice(-7), // 最近7次訓練
      restDistribution,
      avgRestTime: allRestTimes.length > 0 ? Math.round(allRestTimes.reduce((sum, time) => sum + time, 0) / allRestTimes.length) : 0,
      totalRestPeriods: allRestTimes.length
    };
  };
  
  const restAnalytics = getRestTimeAnalytics();

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number | string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`日期: ${label}`}</p>
          {payload.map((entry: { color: string; name: string; value: number | string }, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${entry.name === 'volume' ? 'kg' : entry.name === 'sets' ? '組' : '個'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = (props: Record<string, any>) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 如果沒有訓練數據，顯示空狀態
  if (!hasWorkoutData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 訓練數據分析</h1>
          <p className="text-gray-600">深入了解您的訓練表現和進步軌跡</p>
        </div>
        
        {/* 空狀態 */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">📈</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">還沒有訓練數據</h3>
            <p className="text-gray-600 mb-6">
              開始您的第一次訓練，我們將為您生成詳細的數據分析和進步追蹤！
            </p>
            <div className="space-y-4">
              <a 
                href="/workout" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                🏋️ 開始第一次訓練
              </a>
              <div className="text-sm text-gray-500">
                或者先瀏覽 <a href="/exercises" className="text-blue-600 hover:underline">動作庫</a> 了解可用的訓練動作
              </div>
            </div>
          </div>
          
          {/* 功能預覽 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">📈</div>
              <h4 className="font-semibold text-gray-900 mb-2">訓練容積追蹤</h4>
              <p className="text-sm text-gray-600">追蹤每日訓練容積變化，優化訓練強度</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">🥧</div>
              <h4 className="font-semibold text-gray-900 mb-2">肌群分布分析</h4>
              <p className="text-sm text-gray-600">自動識別動作肌群，確保訓練平衡</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">💪</div>
              <h4 className="font-semibold text-gray-900 mb-2">力量進步曲線</h4>
              <p className="text-sm text-gray-600">追蹤個人記錄突破，見證實力成長</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和時間範圍選擇器 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 訓練數據分析</h1>
            <p className="text-gray-600">深入了解您的訓練表現和進步軌跡</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex space-x-2">
              {[
                { key: 'week', label: '本週' },
                { key: 'month', label: '本月' },
                { key: 'quarter', label: '本季' },
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key as '7d' | '30d' | '90d' | 'all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    timeRange === range.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 統計概覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">總訓練容積</p>
              <p className="text-3xl font-bold">24,800kg</p>
              <p className="text-blue-100 text-sm mt-1">↗️ +12% 較上月</p>
            </div>
            <div className="text-4xl opacity-80">💪</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">總訓練次數</p>
              <p className="text-3xl font-bold">18次</p>
              <p className="text-green-100 text-sm mt-1">🎯 達成目標</p>
            </div>
            <div className="text-4xl opacity-80">🏋️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">平均休息時間</p>
              <p className="text-3xl font-bold">{restAnalytics.avgRestTime}s</p>
              <p className="text-purple-100 text-sm mt-1">⏱️ {restAnalytics.avgRestTime < 60 ? '快節奏' : restAnalytics.avgRestTime < 120 ? '平衡發展' : '力量導向'}</p>
            </div>
            <div className="text-4xl opacity-80">⏱️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">休息次數</p>
              <p className="text-3xl font-bold">{restAnalytics.totalRestPeriods}</p>
              <p className="text-orange-100 text-sm mt-1">💤 組間休息</p>
            </div>
            <div className="text-4xl opacity-80">💤</div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 訓練容積趨勢圖 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 訓練容積趨勢</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                  name="訓練容積"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 肌群分布圓餅圖 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🥧 肌群訓練分布</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '佔比']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 休息時間趨勢 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">⏱️ 休息時間趨勢</h3>
          {restAnalytics.restTimeData.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={restAnalytics.restTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
                  />
                  <YAxis label={{ value: '休息時間(秒)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}秒`, '平均休息時間']}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('zh-TW')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgRest" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">⏱️</div>
              <p>還沒有休息時間數據</p>
            </div>
          )}
        </div>

        {/* 休息時間分布 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 休息時間分布</h3>
          {restAnalytics.restDistribution.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={restAnalytics.restDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: Record<string, any>) => {
                      const { range, percent } = props;
                      return `${range} ${(percent ? (percent * 100).toFixed(0) : 0)}%`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {restAnalytics.restDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}次`, '次數']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>還沒有休息時間數據</p>
            </div>
          )}
          
          {/* 休息時間建議 */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">💡 休息時間建議</h4>
            <div className="text-sm text-purple-800 space-y-1">
              <div>• 力量訓練：90-120秒</div>
              <div>• 肌耐力訓練：30-60秒</div>
              <div>• 大重量複合動作：120-180秒</div>
            </div>
          </div>
        </div>

        {/* 週訓練頻率 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📅 週訓練頻率</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={weeklyFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}次`, '訓練次數']} />
                <Bar dataKey="workouts" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 力量進步追蹤 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💪 力量進步追蹤</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}kg`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="benchPress" 
                  stroke="#FF6B6B" 
                  strokeWidth={3}
                  name="臥推"
                  dot={{ fill: '#FF6B6B', r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="squat" 
                  stroke="#4ECDC4" 
                  strokeWidth={3}
                  name="深蹲"
                  dot={{ fill: '#4ECDC4', r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="deadlift" 
                  stroke="#45B7D1" 
                  strokeWidth={3}
                  name="硬舉"
                  dot={{ fill: '#45B7D1', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 詳細分析 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 詳細分析報告</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">🎯 本月亮點</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                臥推個人記錄突破：80kg (+2kg)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                月訓練目標達成：18/16 次
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                腿部訓練頻率提升：25%
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📈</span>
                總訓練容積增長：12%
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">⚠️ 改善建議</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">⚡</span>
                增加週末訓練頻率
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">⚡</span>
                平衡肩膀和手臂訓練比例
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">⚡</span>
                考慮增加核心訓練時間
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">💡</span>
                保持當前訓練強度
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;