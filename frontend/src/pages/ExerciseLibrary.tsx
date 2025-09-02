import React, { useState, useEffect } from 'react';
import { exerciseService } from '../services';
import type { Exercise, ExerciseFilter, PaginatedResponse } from '../types';

const ExerciseLibrary: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ExerciseFilter>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pagination.page]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, muscleGroupsData, equipmentData] = await Promise.all([
        exerciseService.getCategories(),
        exerciseService.getMuscleGroups(),
        exerciseService.getEquipment(),
      ]);

      setCategories(categoriesData);
      setMuscleGroups(muscleGroupsData);
      setEquipment(equipmentData);
    } catch (err: unknown) {
      console.error('Failed to load filter options:', err);
    }
  };

  const loadExercises = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Exercise> = await exerciseService.getExercises(
        filter,
        pagination.page,
        12
      );
      
      setExercises(response.data);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '載入動作失敗';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: Partial<ExerciseFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilter({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">動作庫</h1>
        <p className="text-gray-600">瀏覽和探索適合您訓練的動作</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              搜尋
            </label>
            <input
              type="text"
              id="search"
              value={filter.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="搜尋動作..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              分類
            </label>
            <select
              id="category"
              value={filter.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有分類</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Muscle Groups */}
          <div>
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-1">
              肌群
            </label>
            <select
              id="muscleGroup"
              value={filter.muscleGroups?.[0] || ''}
              onChange={(e) => handleFilterChange({ 
                muscleGroups: e.target.value ? [e.target.value] : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有肌群</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
              器材
            </label>
            <select
              id="equipment"
              value={filter.equipment?.[0] || ''}
              onChange={(e) => handleFilterChange({ 
                equipment: e.target.value ? [e.target.value] : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有器材</option>
              {equipment.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(filter.search || filter.category || filter.muscleGroups?.length || filter.equipment?.length) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            清除所有篩選
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Exercise Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {exercise.imageUrl && (
                  <div className="w-full h-32 bg-gray-200 rounded-md mb-4 overflow-hidden">
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.name}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">分類：</span> {exercise.category}
                  </div>
                  <div>
                    <span className="font-medium">肌群：</span>{' '}
                    {exercise.muscleGroups.join(', ')}
                  </div>
                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <div>
                      <span className="font-medium">器材：</span>{' '}
                      {exercise.equipment.join(', ')}
                    </div>
                  )}
                </div>

                {exercise.instructions && (
                  <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                    {exercise.instructions}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  {exercise.videoUrl && (
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      觀看影片
                    </a>
                  )}
                  
                  <button
                    onClick={() => {
                      // This would typically open a modal or navigate to add exercise to workout
                      console.log('Add exercise to workout:', exercise.id);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    新增至訓練
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {filter.search || filter.category || filter.muscleGroups?.length || filter.equipment?.length
                ? '找不到符合篩選條件的動作'
                : '沒有可用的動作'}
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              清除篩選
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              上一頁
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              下一頁
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * 12 + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * 12, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;