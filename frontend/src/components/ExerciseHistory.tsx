import React, { useState, useEffect } from 'react';
import { 
  getMostUsedExercises, 
  getRecentExercises,
  searchExerciseHistory,
  type ExerciseRecord 
} from '../utils/exerciseHistory';
import { MUSCLE_GROUPS } from '../data/exercises';

interface ExerciseHistoryProps {
  onExerciseSelect: (exercise: ExerciseRecord) => void;
  onClose: () => void;
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({ onExerciseSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'frequent' | 'search'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentExercises, setRecentExercises] = useState<ExerciseRecord[]>([]);
  const [frequentExercises, setFrequentExercises] = useState<ExerciseRecord[]>([]);
  const [searchResults, setSearchResults] = useState<ExerciseRecord[]>([]);

  useEffect(() => {
    setRecentExercises(getRecentExercises(15));
    setFrequentExercises(getMostUsedExercises(15));
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSearchResults(searchExerciseHistory(searchQuery));
      setActiveTab('search');
    }
  }, [searchQuery]);

  const handleExerciseSelect = (exercise: ExerciseRecord) => {
    onExerciseSelect(exercise);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric'
    });
  };

  const ExerciseCard = ({ exercise }: { exercise: ExerciseRecord }) => (
    <div 
      onClick={() => handleExerciseSelect(exercise)}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
        <div className="text-right">
          <div className="text-sm text-gray-500">使用 {exercise.frequency} 次</div>
          <div className="text-xs text-gray-400">{formatDate(exercise.lastUsed)}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {exercise.sets} 組 × {exercise.reps} 次 × {exercise.weight} kg
          {exercise.restTime && (
            <span className="ml-2 text-purple-600">⏱️ {exercise.restTime}s</span>
          )}
        </div>
        <div className="text-sm font-medium text-blue-600">
          {(exercise.sets * exercise.reps * exercise.weight).toLocaleString()} kg
        </div>
      </div>
      
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
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'recent':
        return recentExercises.length > 0 ? (
          <div className="space-y-3">
            {recentExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>還沒有動作記錄</p>
            <p className="text-sm">開始訓練後會自動記錄</p>
          </div>
        );

      case 'frequent':
        return frequentExercises.length > 0 ? (
          <div className="space-y-3">
            {frequentExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏆</div>
            <p>還沒有常用動作</p>
            <p className="text-sm">多練習幾次會出現在這裡</p>
          </div>
        );

      case 'search':
        return searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>找不到符合的動作</p>
            <p className="text-sm">試試其他關鍵字</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* 標題 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">📚 動作歷史記錄</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 搜索框 */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索動作名稱或肌群..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* 標籤頁 */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'recent', label: '最近使用', icon: '🕒' },
            { key: 'frequent', label: '最常使用', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'recent' | 'frequent')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 內容區域 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderContent()}
        </div>

        {/* 底部提示 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            💡 點擊動作可以快速添加到當前訓練，參數會自動填入上次使用的數值
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHistory;