import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MUSCLE_GROUPS } from '../data/exercises';
import type { Workout, PersonalRecord } from '../types';

interface FavoriteExercise {
  name: string;
  muscleGroups: string[];
  frequency: number;
}

interface TemplateInfo {
  id: string;
  name: string;
}

interface ExerciseSet {
  reps: number;
  weight?: number;
}

interface ExerciseData {
  sets: ExerciseSet[];
  muscleGroups: string[];
}

interface WorkoutData {
  date: string;
  exercises: ExerciseData[];
}

interface PersonalRecordData {
  exercise_name: string;
  new_max: number;
  achieved_date: string;
}

interface TodayWorkoutExercise {
  sets: number;
  reps: number;
  weight: number;
  muscleGroups: string[];
}

interface DashboardDataState {
  weeklyWorkouts: number;
  totalVolume: number;
  totalExercises: number;
  totalDuration: number;
  recentWorkouts: Workout[];
  personalRecords: PersonalRecord[];
  todayWorkout: TodayWorkoutExercise[];
  favoriteExercises: FavoriteExercise[];
  templates: TemplateInfo[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDataState>({
    weeklyWorkouts: 0,
    totalVolume: 0,
    totalExercises: 0,
    totalDuration: 0,
    recentWorkouts: [],
    personalRecords: [],
    todayWorkout: [],
    favoriteExercises: [],
    templates: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 從API獲取數據
      const response = await fetch('http://localhost:3001/api/dashboard');
      if (response.ok) {
        const result = await response.json();
        const data = result.data;

        // 轉換API數據為前端格式
        const recentWorkouts = data.recent_workouts || [];
        const personalRecords = data.personal_records || [];

        setDashboardData({
          weeklyWorkouts: data.weekly_stats?.workouts_completed || 0,
          totalVolume: data.weekly_stats?.total_volume || 0,
          totalExercises: data.weekly_stats?.exercises_performed || 0,
          totalDuration: Math.round((data.weekly_stats?.total_duration || 0) / 60), // 轉換為分鐘
          recentWorkouts: recentWorkouts.map((workout: WorkoutData) => ({
            id: '',
            userId: '',
            name: '',
            date: workout.date,
            exercises: [],
            createdAt: '',
            updatedAt: '',
            totalVolume: workout.exercises?.reduce((sum: number, ex: ExerciseData) => 
              sum + ex.sets.reduce((setSum: number, set: ExerciseSet) => 
                setSum + (set.reps * (set.weight || 0)), 0), 0) || 0
          } as Workout)),
          personalRecords: personalRecords.map((pr: PersonalRecordData) => ({
            id: '',
            exerciseId: '',
            exerciseName: pr.exercise_name,
            type: 'weight' as const,
            value: pr.new_max,
            date: pr.achieved_date,
            workoutId: ''
          })),
          todayWorkout: [],
          favoriteExercises: data.favorite_exercises || [],
          templates: data.templates || []
        });
      } else {
        throw new Error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // 錯誤時初始化空數據
      setDashboardData({
        weeklyWorkouts: 0,
        totalVolume: 0,
        totalExercises: 0,
        totalDuration: 0,
        recentWorkouts: [],
        personalRecords: [],
        todayWorkout: [],
        favoriteExercises: [],
        templates: []
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTodayProgress = () => {
    if (dashboardData.todayWorkout.length === 0) return null;
    
    const totalVolume = dashboardData.todayWorkout.reduce((sum: number, ex: TodayWorkoutExercise) => 
      sum + (ex.sets * ex.reps * ex.weight), 0
    );
    
    return {
      exercises: dashboardData.todayWorkout.length,
      volume: totalVolume
    };
  };

  const todayProgress = getTodayProgress();

  return (
    <div className="space-y-6">
      {/* 歡迎標題 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              🏋️ 歡迎回來！
            </h1>
            <p className="text-blue-100">
              {todayProgress 
                ? `今日已完成 ${todayProgress.exercises} 個動作，總容積 ${todayProgress.volume.toLocaleString()} kg`
                : '準備好開始今天的訓練了嗎？'
              }
            </p>
          </div>
          <div className="text-6xl opacity-20">💪</div>
        </div>
      </div>

      {/* 今日訓練進度 */}
      {todayProgress && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">🔥 今日訓練進度</h3>
            <Link 
              to="/workout" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              繼續訓練 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{todayProgress.exercises}</div>
              <div className="text-sm text-green-800">動作數量</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{todayProgress.volume.toLocaleString()}</div>
              <div className="text-sm text-blue-800">總容積 (kg)</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(dashboardData.todayWorkout.length * 3.5)}
              </div>
              <div className="text-sm text-purple-800">預估時間 (分)</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(dashboardData.todayWorkout.flatMap((ex: TodayWorkoutExercise) => ex.muscleGroups)).size}
              </div>
              <div className="text-sm text-orange-800">訓練肌群</div>
            </div>
          </div>
        </div>
      )}

      {/* 統計總覽 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-600">{dashboardData.weeklyWorkouts}</div>
              <div className="text-sm text-gray-600">本週訓練</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">⚖️</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">{dashboardData.totalVolume.toLocaleString()}</div>
              <div className="text-sm text-gray-600">總容積 (kg)</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🏃</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-600">{dashboardData.totalExercises}</div>
              <div className="text-sm text-gray-600">動作種類</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-600">{dashboardData.totalDuration}</div>
              <div className="text-sm text-gray-600">總時間 (分)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 最近訓練 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">📝 最近訓練</h3>
            <Link to="/workouts" className="text-blue-600 hover:text-blue-800 text-sm">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData.recentWorkouts.length > 0 ? (
              dashboardData.recentWorkouts.map((workout, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {workout.exercises?.length || 0} 個動作
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(workout.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {workout.totalVolume?.toLocaleString() || 0} kg
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((workout.exercises?.length || 0) * 3.5)} 分鐘
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-sm">還沒有訓練記錄</p>
              </div>
            )}
          </div>
        </div>

        {/* 個人記錄 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">🏆 個人記錄</h3>
            <Link to="/analytics" className="text-blue-600 hover:text-blue-800 text-sm">
              查看分析 →
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData.personalRecords.length > 0 ? (
              dashboardData.personalRecords.map((record, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">{formatDate(record.date)}</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{record.weight}kg</div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm">開始訓練建立記錄</p>
              </div>
            )}
          </div>
        </div>

        {/* 常用動作 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">⭐ 常用動作</h3>
            <Link to="/exercises" className="text-blue-600 hover:text-blue-800 text-sm">
              動作庫 →
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData.favoriteExercises.length > 0 ? (
              dashboardData.favoriteExercises.map((exercise, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{exercise.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exercise.muscleGroups.slice(0, 2).map((group: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS] || group}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-purple-600">
                    {exercise.frequency} 次
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm">開始訓練建立記錄</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 快速操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/workout" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏋️</div>
            <div className="font-semibold">開始訓練</div>
            <div className="text-sm opacity-90 mt-1">立即開始新的訓練</div>
          </Link>
          
          <Link 
            to="/templates" 
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
            <div className="font-semibold">課表模板</div>
            <div className="text-sm opacity-90 mt-1">
              {dashboardData.templates.length > 0 
                ? `${dashboardData.templates.length} 個模板可用`
                : '創建訓練模板'
              }
            </div>
          </Link>
          
          <Link 
            to="/analytics" 
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <div className="font-semibold">數據分析</div>
            <div className="text-sm opacity-90 mt-1">查看訓練數據統計</div>
          </Link>
          
          <Link 
            to="/exercises" 
            className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💪</div>
            <div className="font-semibold">動作庫</div>
            <div className="text-sm opacity-90 mt-1">
              {dashboardData.totalExercises > 0 
                ? `${dashboardData.totalExercises} 個動作記錄`
                : '瀏覽所有訓練動作'
              }
            </div>
          </Link>
        </div>
      </div>

      {/* 訓練建議 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6 border border-green-200">
        <div className="flex items-start">
          <div className="text-3xl mr-4">💡</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">今日訓練建議</h3>
            <div className="text-gray-700">
              {dashboardData.weeklyWorkouts === 0 ? (
                <p>開始您的第一次訓練！建議從基礎動作開始，注意動作標準。</p>
              ) : dashboardData.weeklyWorkouts < 3 ? (
                <p>本週還可以增加 {3 - dashboardData.weeklyWorkouts} 次訓練。保持規律運動習慣！</p>
              ) : (
                <p>本週訓練頻率很棒！記得適當休息，讓肌肉充分恢復。</p>
              )}
            </div>
            {dashboardData.favoriteExercises.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium">推薦動作：</span>
                {dashboardData.favoriteExercises.slice(0, 3).map(ex => ex.name).join('、')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;