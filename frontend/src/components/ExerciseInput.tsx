import React, { useState, useEffect } from 'react';
import { 
  findExerciseMuscleGroups, 
  getExerciseSuggestions, 
  MUSCLE_GROUPS, 
  isUnknownExercise,
  getAllMuscleGroupOptions,
  saveUserDefinedExercise
} from '../data/exercises';
import RestRecommendation from './RestRecommendation';

interface SuggestionType {
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}
import ExerciseHistory from './ExerciseHistory';
import { saveExerciseToHistory, type ExerciseRecord } from '../utils/exerciseHistory';

interface ExerciseInputProps {
  onExerciseAdd: (exercise: {
    name: string;
    muscleGroups: string[];
    sets: number;
    reps: number;
    weight: number;
    restTime?: number;
  }) => void;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ onExerciseAdd }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(20);
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUnknown, setIsUnknown] = useState(false);
  const [showMuscleGroupSelector, setShowMuscleGroupSelector] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [rememberExercise, setRememberExercise] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (exerciseName.length > 1) {
      const exerciseSuggestions = getExerciseSuggestions(exerciseName);
      setSuggestions(exerciseSuggestions);
      setShowSuggestions(exerciseSuggestions.length > 0);
      
      // 即時識別肌群
      const identifiedGroups = findExerciseMuscleGroups(exerciseName);
      const unknown = isUnknownExercise(exerciseName);
      
      setMuscleGroups(identifiedGroups);
      setIsUnknown(unknown);
      
      if (unknown) {
        setShowMuscleGroupSelector(true);
        setSelectedMuscleGroups([]);
      } else {
        setShowMuscleGroupSelector(false);
        setSelectedMuscleGroups(identifiedGroups);
      }
    } else {
      setShowSuggestions(false);
      setMuscleGroups([]);
      setIsUnknown(false);
      setShowMuscleGroupSelector(false);
      setSelectedMuscleGroups([]);
    }
  }, [exerciseName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName.trim()) {
      alert('請輸入動作名稱');
      return;
    }

    // 檢查是否是未知動作且未選擇肌群
    if (isUnknown && selectedMuscleGroups.length === 0) {
      alert('請為這個動作選擇至少一個肌群');
      return;
    }

    const finalMuscleGroups = isUnknown ? selectedMuscleGroups : muscleGroups;

    // 如果是未知動作且用戶選擇記住，保存到用戶資料庫
    if (isUnknown && rememberExercise && selectedMuscleGroups.length > 0) {
      const newExercise = {
        id: `user-${Date.now()}`,
        name: exerciseName,
        primaryMuscles: selectedMuscleGroups.slice(0, 2), // 前兩個作為主要肌群
        secondaryMuscles: selectedMuscleGroups.slice(2), // 其餘作為次要肌群
        category: '用戶自定義',
        equipment: [],
        difficulty: 'intermediate' as const
      };
      
      saveUserDefinedExercise(newExercise);
    }

    const exercise = {
      name: exerciseName,
      muscleGroups: finalMuscleGroups,
      sets,
      reps,
      weight,
      restTime
    };

    // 保存到動作歷史
    saveExerciseToHistory(exercise);
    
    onExerciseAdd(exercise);
    
    // 重置表單
    resetForm();
  };

  const resetForm = () => {
    setExerciseName('');
    setSets(3);
    setReps(10);
    setWeight(20);
    setRestTime(90);
    setMuscleGroups([]);
    setIsUnknown(false);
    setShowMuscleGroupSelector(false);
    setSelectedMuscleGroups([]);
    setRememberExercise(false);
  };

  const handleHistorySelect = (exercise: ExerciseRecord) => {
    setExerciseName(exercise.name);
    setSets(exercise.sets);
    setReps(exercise.reps);
    setWeight(exercise.weight);
    setRestTime(exercise.restTime || 90);
    setMuscleGroups(exercise.muscleGroups);
    setIsUnknown(false);
    setShowMuscleGroupSelector(false);
    setSelectedMuscleGroups(exercise.muscleGroups);
  };

  const selectSuggestion = (suggestion: SuggestionType) => {
    setExerciseName(suggestion.name);
    setMuscleGroups([...suggestion.primaryMuscles, ...suggestion.secondaryMuscles]);
    setShowSuggestions(false);
    setIsUnknown(false);
    setShowMuscleGroupSelector(false);
  };

  const toggleMuscleGroup = (groupKey: string) => {
    setSelectedMuscleGroups(prev => {
      if (prev.includes(groupKey)) {
        return prev.filter(g => g !== groupKey);
      } else {
        return [...prev, groupKey];
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">📝 添加訓練動作</h3>
        <button
          type="button"
          onClick={() => setShowHistory(true)}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          📚 選擇歷史動作
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 動作名稱輸入 */}
        <div className="relative">
          <label htmlFor="exercise-name" className="block text-sm font-medium text-gray-700 mb-1">
            動作名稱
          </label>
          <input
            id="exercise-name"
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="例如：臥推、深蹲、硬舉..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          {/* 動作建議下拉 */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">
                    {suggestion.primaryMuscles.map((m: string) => MUSCLE_GROUPS[m as keyof typeof MUSCLE_GROUPS]).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 識別的肌群顯示 */}
        {muscleGroups.length > 0 && !isUnknown && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center">
              <span className="text-blue-600 mr-2">🎯</span>
              <span className="text-sm font-medium text-blue-900">系統自動識別肌群：</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {muscleGroups.map((group, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS] || group}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 未知動作 - 手動選擇肌群 */}
        {isUnknown && showMuscleGroupSelector && (
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
            <div className="flex items-center mb-3">
              <span className="text-orange-600 mr-2">❓</span>
              <span className="text-sm font-medium text-orange-900">
                未知動作：請手動選擇訓練的肌群
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {getAllMuscleGroupOptions().map(({ key, value, description }) => (
                <label
                  key={key}
                  className={`cursor-pointer p-3 rounded-lg border-2 transition-colors text-center ${
                    selectedMuscleGroups.includes(key)
                      ? 'border-orange-500 bg-orange-100 text-orange-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedMuscleGroups.includes(key)}
                    onChange={() => toggleMuscleGroup(key)}
                  />
                  <div className="font-medium text-sm">{value}</div>
                  {description && (
                    <div className="text-xs text-gray-500 mt-1">{description}</div>
                  )}
                </label>
              ))}
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberExercise}
                  onChange={(e) => setRememberExercise(e.target.checked)}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-orange-800">
                  💾 記住這個動作，下次自動識別
                </span>
              </label>
            </div>

            {selectedMuscleGroups.length > 0 && (
              <div className="mt-3 p-2 bg-orange-100 rounded">
                <span className="text-sm font-medium text-orange-900">已選擇：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMuscleGroups.map((group) => (
                    <span
                      key={group}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-200 text-orange-800"
                    >
                      {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 訓練參數輸入 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
              組數
            </label>
            <input
              id="sets"
              type="number"
              min="1"
              max="20"
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
              次數
            </label>
            <input
              id="reps"
              type="number"
              min="1"
              max="100"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              重量 (kg)
            </label>
            <input
              id="weight"
              type="number"
              min="0"
              max="500"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 組間休息時間 */}
        <div>
          <label htmlFor="rest-time" className="block text-sm font-medium text-gray-700 mb-1">
            ⏱️ 組間休息時間 (秒)
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="rest-time"
              type="number"
              min="30"
              max="600"
              step="15"
              value={restTime}
              onChange={(e) => setRestTime(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setRestTime(60)}
                className={`px-3 py-1 text-xs rounded ${
                  restTime === 60 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                60s
              </button>
              <button
                type="button"
                onClick={() => setRestTime(90)}
                className={`px-3 py-1 text-xs rounded ${
                  restTime === 90 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                90s
              </button>
              <button
                type="button"
                onClick={() => setRestTime(120)}
                className={`px-3 py-1 text-xs rounded ${
                  restTime === 120 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                120s
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            推薦：力量訓練 90-120s，肌耐力訓練 30-60s
          </div>
        </div>

        {/* 計算顯示 */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">預計訓練容積：</span>
            <span className="ml-2 text-lg font-bold text-blue-600">
              {(sets * reps * weight).toLocaleString()} kg
            </span>
          </div>
        </div>

        {/* 休息時間推薦 */}
        {exerciseName && !isUnknown && muscleGroups.length > 0 && (
          <RestRecommendation
            exerciseName={exerciseName}
            muscleGroups={muscleGroups}
            weight={weight}
            reps={reps}
          />
        )}

        {/* 提交按鈕 */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          ➕ 添加到今日訓練
        </button>
      </form>
      
      {/* 動作歷史選擇模組框 */}
      {showHistory && (
        <ExerciseHistory
          onExerciseSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default ExerciseInput;