import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import {
  getWorkoutTemplates,
  deleteWorkoutTemplate,
  // createTemplateFromWorkout,
  getRecommendedTags,
  type WorkoutTemplate,
  type ExerciseRecord
} from '../utils/exerciseHistory';
import { MUSCLE_GROUPS } from '../data/exercises';

interface WorkoutData {
  id: string;
  date: string;
  exercises: ExerciseRecord[];
  totalVolume: number;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [pastWorkouts, setPastWorkouts] = useState<WorkoutData[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTemplates(getWorkoutTemplates());
    
    try {
      const workouts = JSON.parse(localStorage.getItem('fitness-workouts') || '[]');
      setPastWorkouts(workouts.slice(-30));
    } catch (error) {
      console.error('Error loading past workouts:', error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!selectedWorkout || !templateName.trim()) {
      alert('請選擇訓練日期和輸入模板名稱');
      return;
    }

    try {
      const targetWorkout = pastWorkouts.find(w => w.date === selectedWorkout);
      if (!targetWorkout) {
        throw new Error('找不到指定的訓練記錄');
      }

      const template = {
        name: templateName.trim(),
        description: templateDescription.trim() || `從 ${selectedWorkout} 的訓練創建`,
        exercises: targetWorkout.exercises.map((ex: ExerciseRecord) => ({
          ...ex,
          id: `exercise-${Date.now()}-${Math.random()}`,
          date: new Date().toISOString(),
          frequency: 1,
          lastUsed: new Date().toISOString()
        })),
        totalVolume: targetWorkout.totalVolume,
        estimatedDuration: Math.round(targetWorkout.exercises.length * 3.5),
        tags: selectedTags.length > 0 ? selectedTags : targetWorkout.exercises.flatMap((ex: ExerciseRecord) => ex.muscleGroups),
        lastUsed: new Date().toISOString()
      };

      // 保存模板
      const templates = getWorkoutTemplates();
      const newTemplate: WorkoutTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        createdDate: new Date().toISOString(),
        useCount: 0
      };
      
      templates.unshift(newTemplate);
      localStorage.setItem('fitness-workout-templates', JSON.stringify(templates.slice(0, 20)));
      
      loadData();
      setShowCreateModal(false);
      resetForm();
      alert('✅ 課表模板創建成功！');
    } catch (error) {
      alert('❌ 創建失敗：' + (error as Error).message);
    }
  };

  const resetForm = () => {
    setSelectedWorkout('');
    setTemplateName('');
    setTemplateDescription('');
    setSelectedTags([]);
  };

  const handleUseTemplate = (template: WorkoutTemplate) => {
    // Note: useWorkoutTemplate should be called at component level, not in event handler
    // Converting template to exercises for now
    if (template) {
      // 設置當日訓練
      const workoutExercises = template.exercises.map(ex => ({
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
      
      localStorage.setItem('fitness-today-workout', JSON.stringify(workoutExercises));
      alert(`🎉 已載入「${template.name}」模板到今日訓練！`);
      window.location.href = '/workout';
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('確定要刪除這個課表模板嗎？')) {
      deleteWorkoutTemplate(templateId);
      loadData();
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || template.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小時${mins}分鐘` : `${mins}分鐘`;
  };

  const getUniqueMuscelGroups = (exercises: ExerciseRecord[]) => {
    const groups = new Set<string>();
    exercises.forEach(ex => ex.muscleGroups.forEach(group => groups.add(group)));
    return Array.from(groups);
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 訓練課表模板</h1>
            <p className="text-gray-600">保存和重複使用您最愛的訓練課表，提升訓練效率</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            ➕ 創建新模板
          </button>
        </div>
      </div>

      {/* 搜索和篩選 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索模板名稱或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有標籤</option>
            {getRecommendedTags().map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 模板網格 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                {/* 模板標題和統計 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      title="使用此模板"
                    >
                      使用
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      title="刪除模板"
                    >
                      刪除
                    </button>
                  </div>
                </div>

                {/* 統計信息 */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-blue-600">{template.exercises.length}</div>
                    <div className="text-blue-800">動作數量</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-green-600">{formatDuration(template.estimatedDuration)}</div>
                    <div className="text-green-800">預估時間</div>
                  </div>
                </div>

                {/* 詳細信息 */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>總容積：</span>
                    <span className="font-medium">{template.totalVolume.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>使用次數：</span>
                    <span className="font-medium">{template.useCount} 次</span>
                  </div>
                </div>

                {/* 肌群標籤 */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">訓練肌群：</div>
                  <div className="flex flex-wrap gap-1">
                    {getUniqueMuscelGroups(template.exercises).slice(0, 4).map(group => (
                      <span
                        key={group}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS] || group}
                      </span>
                    ))}
                    {getUniqueMuscelGroups(template.exercises).length > 4 && (
                      <span className="text-xs text-gray-500">+{getUniqueMuscelGroups(template.exercises).length - 4}</span>
                    )}
                  </div>
                </div>

                {/* 動作預覽 */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">動作預覽：</div>
                  <div className="space-y-1">
                    {template.exercises.slice(0, 3).map((ex, index) => (
                      <div key={index} className="text-xs text-gray-600 flex justify-between">
                        <span>{ex.name}</span>
                        <span>{ex.sets}x{ex.reps} @ {ex.weight}kg</span>
                      </div>
                    ))}
                    {template.exercises.length > 3 && (
                      <div className="text-xs text-gray-500">... 還有 {template.exercises.length - 3} 個動作</div>
                    )}
                  </div>
                </div>

                {/* 創建時間 */}
                <div className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  創建於 {formatDate(template.createdDate)}
                  {template.lastUsed && (
                    <span> • 上次使用 {formatDate(template.lastUsed)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">還沒有課表模板</h3>
            <p className="text-gray-600 mb-6">創建模板來保存您最愛的訓練課表</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              創建第一個模板
            </button>
          </div>
        )}
      </div>

      {/* 創建模板模態框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">📋 創建訓練模板</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* 選擇歷史訓練 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    選擇歷史訓練 *
                  </label>
                  <select
                    value={selectedWorkout}
                    onChange={(e) => setSelectedWorkout(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">請選擇一次訓練...</option>
                    {pastWorkouts.map(workout => (
                      <option key={workout.id} value={workout.date}>
                        {formatDate(workout.date)} - {workout.exercises.length}個動作 - {workout.totalVolume.toLocaleString()}kg
                      </option>
                    ))}
                  </select>
                </div>

                {/* 模板名稱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模板名稱 *
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="例如：胸背日、腿部訓練、推日..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 模板描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模板描述 (可選)
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="描述這個訓練模板的特點或適用場景..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 標籤選擇 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    訓練標籤 (可選)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {getRecommendedTags().map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleCreateTemplate}
                  disabled={!selectedWorkout || !templateName.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  創建模板
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;