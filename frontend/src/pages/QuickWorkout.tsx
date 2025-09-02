import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExerciseInput from '../components/ExerciseInput';
import RestTimer from '../components/RestTimer';
import WorkoutTemplates from '../components/WorkoutTemplates';
import { MUSCLE_GROUPS } from '../data/exercises';
import { type ExerciseRecord } from '../utils/exerciseHistory';

interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: number;
  weight: number;
  restTime?: number;
  timestamp: string;
  actualRestTimes?: number[];
}

const QuickWorkout: React.FC = () => {
  const [todayWorkout, setTodayWorkout] = useState<WorkoutExercise[]>([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentRestData, setCurrentRestData] = useState<{
    duration: number;
    exerciseName: string;
    exerciseId: string;
  } | null>(null);
  const [restStartTime, setRestStartTime] = useState<number>(0);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleExerciseAdd = (exercise: {
    name: string;
    muscleGroups: string[];
    sets: number;
    reps: number;
    weight: number;
    restTime?: number;
  }) => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      ...exercise,
      actualRestTimes: [],
      timestamp: new Date().toISOString(),
    };

    setTodayWorkout(prev => [...prev, newExercise]);
    
    if (!workoutStarted) {
      setWorkoutStarted(true);
    }

    // 保存到localStorage
    const updatedWorkout = [...todayWorkout, newExercise];
    localStorage.setItem('fitness-today-workout', JSON.stringify(updatedWorkout));

    // 如果有設定休息時間且不是第一個動作，啟動休息計時器
    if (exercise.restTime && exercise.restTime > 0 && todayWorkout.length > 0) {
      setCurrentRestData({
        duration: exercise.restTime,
        exerciseName: exercise.name,
        exerciseId: newExercise.id
      });
      setRestStartTime(Date.now());
      setShowRestTimer(true);
    }
  };

  const removeExercise = (id: string) => {
    const updatedWorkout = todayWorkout.filter(ex => ex.id !== id);
    setTodayWorkout(updatedWorkout);
    localStorage.setItem('fitness-today-workout', JSON.stringify(updatedWorkout));
  };

  const handleRestComplete = () => {
    if (currentRestData) {
      const actualRestTime = Math.round((Date.now() - restStartTime) / 1000);
      
      // 更新該動作的實際休息時間
      setTodayWorkout(prev => {
        const updated = prev.map(ex => {
          if (ex.id === currentRestData.exerciseId) {
            return {
              ...ex,
              actualRestTimes: [...(ex.actualRestTimes || []), actualRestTime]
            };
          }
          return ex;
        });
        localStorage.setItem('fitness-today-workout', JSON.stringify(updated));
        return updated;
      });
    }
    
    setShowRestTimer(false);
    setCurrentRestData(null);
  };

  const handleRestSkip = () => {
    handleRestComplete();
  };

  const handleTemplateSelect = (exercises: ExerciseRecord[]) => {
    // 清空當前訓練
    setTodayWorkout([]);
    
    // 添加模板中的所有動作
    const newWorkout: WorkoutExercise[] = exercises.map(ex => ({
      id: `${Date.now()}-${Math.random()}`,
      name: ex.name,
      muscleGroups: ex.muscleGroups,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      restTime: ex.restTime,
      actualRestTimes: [],
      timestamp: new Date().toISOString()
    }));
    
    setTodayWorkout(newWorkout);
    setWorkoutStarted(true);
    
    // 保存到localStorage
    localStorage.setItem('fitness-today-workout', JSON.stringify(newWorkout));
    
    alert(`🎉 已載入 ${exercises.length} 個動作的訓練模板！`);
  };

  const handleCopyPreviousWorkout = () => {
    try {
      const workouts = JSON.parse(localStorage.getItem('fitness-workouts') || '[]');
      if (workouts.length === 0) {
        alert('還沒有過往的訓練記錄');
        return;
      }
      
      const lastWorkout = workouts[workouts.length - 1];
      const exercises: ExerciseRecord[] = lastWorkout.exercises.map((ex: ExerciseRecord) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: ex.name,
        muscleGroups: ex.muscleGroups,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        restTime: ex.restTime,
        date: new Date().toISOString(),
        frequency: 1,
        lastUsed: new Date().toISOString()
      }));
      
      handleTemplateSelect(exercises);
    } catch (error) {
      console.error('Error copying previous workout:', error);
      alert('複製過往訓練失敗');
    }
  };

  const finishWorkout = () => {
    if (todayWorkout.length === 0) {
      alert('請至少添加一個動作才能完成訓練');
      return;
    }

    // 保存到訓練歷史
    const workoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercises: todayWorkout,
      totalVolume: todayWorkout.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0),
      duration: 0, // 可以加入計時功能
    };

    // 獲取現有的訓練歷史
    const existingWorkouts = localStorage.getItem('fitness-workouts');
    const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
    workouts.push(workoutSession);
    localStorage.setItem('fitness-workouts', JSON.stringify(workouts));

    // 清除今日訓練
    setTodayWorkout([]);
    setWorkoutStarted(false);
    localStorage.removeItem('fitness-today-workout');

    alert('🎉 訓練完成！數據已保存，可以在數據分析頁面查看統計。');
  };

  const getTotalVolume = () => {
    return todayWorkout.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);
  };

  const getMuscleGroupStats = () => {
    const muscleGroupCount: Record<string, number> = {};
    todayWorkout.forEach(exercise => {
      exercise.muscleGroups.forEach(group => {
        muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
      });
    });
    return muscleGroupCount;
  };

  const getRestTimeStats = () => {
    const restTimes = todayWorkout.flatMap(ex => ex.actualRestTimes || []);
    if (restTimes.length === 0) return null;
    
    const avgRest = Math.round(restTimes.reduce((sum, time) => sum + time, 0) / restTimes.length);
    const minRest = Math.min(...restTimes);
    const maxRest = Math.max(...restTimes);
    
    return { avgRest, minRest, maxRest, totalRests: restTimes.length };
  };

  // 加載保存的今日訓練
  React.useEffect(() => {
    const savedWorkout = localStorage.getItem('fitness-today-workout');
    if (savedWorkout) {
      try {
        const workout = JSON.parse(savedWorkout);
        setTodayWorkout(workout);
        if (workout.length > 0) {
          setWorkoutStarted(true);
        }
      } catch (error) {
        console.error('Error loading saved workout:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏋️ 快速訓練</h1>
            <p className="text-gray-600">
              {workoutStarted ? '訓練進行中...' : '開始您的訓練，系統會自動識別動作肌群'}
            </p>
            
            {/* 快速操作按鈕 */}
            {!workoutStarted && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📋 使用課表模板
                </button>
                <button
                  onClick={handleCopyPreviousWorkout}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔄 複製上次訓練
                </button>
              </div>
            )}
          </div>
          <Link
            to="/analytics"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            📊 查看數據分析
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：動作輸入 */}
        <div>
          <ExerciseInput onExerciseAdd={handleExerciseAdd} />
        </div>

        {/* 右側：今日訓練總覽 */}
        <div className="space-y-6">
          {/* 訓練統計 */}
          {workoutStarted && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 今日統計</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{todayWorkout.length}</div>
                  <div className="text-sm text-blue-800">動作數量</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{getTotalVolume().toLocaleString()}</div>
                  <div className="text-sm text-green-800">總容積 (kg)</div>
                </div>
              </div>
              
              {/* 休息時間統計 */}
              {getRestTimeStats() && (
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-purple-900 mb-2">⏱️ 休息時間統計</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-purple-700">
                      平均: <span className="font-medium">{getRestTimeStats()!.avgRest}s</span>
                    </div>
                    <div className="text-purple-700">
                      總次數: <span className="font-medium">{getRestTimeStats()!.totalRests}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 肌群分布 */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">🎯 訓練肌群</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(getMuscleGroupStats()).map(([group, count]) => (
                    <span
                      key={group}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS] || group} ({count})
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={finishWorkout}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                ✅ 完成訓練
              </button>
            </div>
          )}

          {/* 今日動作列表 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 今日動作</h3>
            
            {todayWorkout.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💪</div>
                <p>還沒有添加任何動作</p>
                <p className="text-sm">在左側輸入您的第一個訓練動作</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayWorkout.map((exercise) => (
                  <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {exercise.sets} 組 × {exercise.reps} 次 × {exercise.weight} kg
                          {exercise.restTime && (
                            <span className="ml-2 text-purple-600">⏱️ {exercise.restTime}s</span>
                          )}
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          容積: {(exercise.sets * exercise.reps * exercise.weight).toLocaleString()} kg
                        </div>
                        {exercise.actualRestTimes && exercise.actualRestTimes.length > 0 && (
                          <div className="text-xs text-purple-600 mt-1">
                            實際休息: {exercise.actualRestTimes.map(time => `${time}s`).join(', ')}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exercise.muscleGroups.map((group, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS] || group}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700 ml-4"
                        title="移除動作"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 休息計時器模態框 */}
      {showRestTimer && currentRestData && (
        <RestTimer
          duration={currentRestData.duration}
          exerciseName={currentRestData.exerciseName}
          onComplete={handleRestComplete}
          onSkip={handleRestSkip}
        />
      )}
      
      {/* 課表模板選擇模態框 */}
      {showTemplates && (
        <WorkoutTemplates
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default QuickWorkout;