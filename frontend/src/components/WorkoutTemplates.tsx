import React, { useState, useEffect } from 'react';
import {
  getWorkoutTemplates,
  deleteWorkoutTemplate,
  createTemplateFromWorkout,
  getRecommendedTags,
  type WorkoutTemplate,
  type ExerciseRecord
} from '../utils/exerciseHistory';
import { MUSCLE_GROUPS } from '../data/exercises';
import type { Workout } from '../types';

interface WorkoutTemplatesProps {
  onTemplateSelect: (exercises: ExerciseRecord[]) => void;
  onClose: () => void;
}

const WorkoutTemplates: React.FC<WorkoutTemplatesProps> = ({ onTemplateSelect, onClose }) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [pastWorkouts, setPastWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');
  const [templateName, setTemplateName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    loadTemplates();
    loadPastWorkouts();
  }, []);

  const loadTemplates = () => {
    setTemplates(getWorkoutTemplates());
  };

  const loadPastWorkouts = () => {
    try {
      const workouts = JSON.parse(localStorage.getItem('fitness-workouts') || '[]');
      setPastWorkouts(workouts.slice(-30)); // 最近30次訓練
    } catch (error) {
      console.error('Error loading past workouts:', error);
    }
  };

  const handleUseTemplate = (template: WorkoutTemplate) => {
    // Convert template to exercises
    onTemplateSelect(template.exercises);
    onClose();
  };

  const handleCreateTemplate = async () => {
    if (!selectedWorkout || !templateName.trim()) {
      alert('請選擇訓練日期和輸入模板名稱');
      return;
    }

    try {
      createTemplateFromWorkout(selectedWorkout, templateName.trim());
      loadTemplates();
      setShowCreateTemplate(false);
      setSelectedWorkout('');
      setTemplateName('');
      alert('✅ 課表模板創建成功！');
    } catch (error) {
      alert('❌ 創建失敗：' + (error as Error).message);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('確定要刪除這個課表模板嗎？')) {
      deleteWorkoutTemplate(templateId);
      loadTemplates();
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 標題 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">📋 訓練課表模板</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateTemplate(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              ➕ 創建模板
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 搜索和篩選 */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-4">
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

        {/* 模板列表 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.description && (
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        使用
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        刪除
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>動作數量：{template.exercises.length}</span>
                      <span>預估時間：{formatDuration(template.estimatedDuration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>總容積：{template.totalVolume.toLocaleString()} kg</span>
                      <span>使用次數：{template.useCount}</span>
                    </div>
                  </div>

                  {/* 肌群標籤 */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {getUniqueMuscelGroups(template.exercises).slice(0, 4).map(group => (
                      <span
                        key={group}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS] || group}
                      </span>
                    ))}
                    {getUniqueMuscelGroups(template.exercises).length > 4 && (
                      <span className="text-xs text-gray-500">+{getUniqueMuscelGroups(template.exercises).length - 4}</span>
                    )}
                  </div>

                  {/* 動作預覽 */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">動作預覽：</div>
                    <div className="text-xs text-gray-700">
                      {template.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                      {template.exercises.length > 3 && ` 等${template.exercises.length}個動作`}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    創建於 {formatDate(template.createdDate)}
                    {template.lastUsed && ` • 上次使用 ${formatDate(template.lastUsed)}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>還沒有課表模板</p>
              <p className="text-sm">點擊上方「創建模板」來保存您的訓練課表</p>
            </div>
          )}
        </div>

        {/* 創建模板模態框 */}
        {showCreateTemplate && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">創建訓練模板</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    選擇歷史訓練
                  </label>
                  <select
                    value={selectedWorkout}
                    onChange={(e) => setSelectedWorkout(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">請選擇...</option>
                    {pastWorkouts.map(workout => (
                      <option key={workout.id} value={workout.date}>
                        {formatDate(workout.date)} - {workout.exercises.length}個動作 - {workout.totalVolume?.toLocaleString() || 0}kg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    模板名稱
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="例如：胸背日、腿部訓練..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateTemplate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  創建模板
                </button>
                <button
                  onClick={() => setShowCreateTemplate(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTemplates;