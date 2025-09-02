import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutService } from '../services';
import type { Workout, WorkoutFilter, PaginatedResponse } from '../types';

const WorkoutLog: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<WorkoutFilter>({});
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    loadWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pagination.page]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Workout> = await workoutService.getWorkouts(
        filter,
        pagination.page,
        10
      );
      
      setWorkouts(response.data);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '載入訓練記錄失敗';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('您確定要刪除這個訓練記錄嗎？')) {
      return;
    }

    try {
      await workoutService.deleteWorkout(id);
      await loadWorkouts(); // Reload the list
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '刪除訓練記錄失敗';
      setError(errorMessage);
    }
  };

  const handleFilterChange = (newFilter: Partial<WorkoutFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && workouts.length === 0) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">訓練記錄</h1>
            <p className="text-gray-600">追蹤和回顧您的訓練課程</p>
          </div>
          <Link
            to="/workouts/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            + 新增訓練
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              搜尋訓練記錄
            </label>
            <input
              type="text"
              id="search"
              value={filter.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="搜尋名稱..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              開始日期
            </label>
            <input
              type="date"
              id="startDate"
              value={filter.startDate || ''}
              onChange={(e) => handleFilterChange({ startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              結束日期
            </label>
            <input
              type="date"
              id="endDate"
              value={filter.endDate || ''}
              onChange={(e) => handleFilterChange({ endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Workout List */}
      <div className="bg-white rounded-lg shadow-sm">
        {workouts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {workouts.map((workout) => (
              <div key={workout.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{workout.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(workout.date).toLocaleDateString('zh-TW', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                      <span>{workout.exercises.length} 個動作</span>
                      {workout.duration && <span>{workout.duration} 分鐘</span>}
                      <span>
                        {workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)} 組
                      </span>
                    </div>
                    
                    {workout.notes && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{workout.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/workouts/${workout.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      查看
                    </Link>
                    <Link
                      to={`/workouts/${workout.id}/edit`}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      編輯
                    </Link>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {filter.search || filter.startDate || filter.endDate
                ? '找不到符合篩選條件的訓練記錄'
                : '還沒有訓練記錄'}
            </p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              記錄您的首次訓練
            </Link>
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
                顯示 <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> 至{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * 10, pagination.total)}
                </span>{' '}
                共 <span className="font-medium">{pagination.total}</span> 項結果
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

export default WorkoutLog;