import { useState, useEffect } from 'react';
import type { Workout, WorkoutFilter, PaginatedResponse, WorkoutForm } from '../types';
import { workoutService } from '../services';

interface UseWorkoutsReturn {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  loadWorkouts: (filter?: WorkoutFilter, page?: number) => Promise<void>;
  createWorkout: (workoutData: WorkoutForm) => Promise<Workout>;
  updateWorkout: (id: string, workoutData: Partial<WorkoutForm>) => Promise<Workout>;
  deleteWorkout: (id: string) => Promise<void>;
  setPage: (page: number) => void;
}

export const useWorkouts = (initialFilter: WorkoutFilter = {}): UseWorkoutsReturn => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<WorkoutFilter>(initialFilter);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    loadWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWorkouts = async (newFilter: WorkoutFilter = filter, page: number = pagination.page) => {
    try {
      setLoading(true);
      setError(null);
      setFilter(newFilter);
      
      const response: PaginatedResponse<Workout> = await workoutService.getWorkouts(
        newFilter,
        page,
        10
      );
      
      setWorkouts(response.data);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workouts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (workoutData: WorkoutForm): Promise<Workout> => {
    try {
      setError(null);
      const newWorkout = await workoutService.createWorkout(workoutData);
      
      // Refresh the list
      await loadWorkouts(filter, pagination.page);
      
      return newWorkout;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workout';
      setError(errorMessage);
      throw err;
    }
  };

  const updateWorkout = async (id: string, workoutData: Partial<WorkoutForm>): Promise<Workout> => {
    try {
      setError(null);
      const updatedWorkout = await workoutService.updateWorkout(id, workoutData);
      
      // Update the workout in the current list
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === id ? updatedWorkout : workout
        )
      );
      
      return updatedWorkout;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update workout';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteWorkout = async (id: string): Promise<void> => {
    try {
      setError(null);
      await workoutService.deleteWorkout(id);
      
      // Remove from current list
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      
      // If we're on the last page and it becomes empty, go to previous page
      if (workouts.length === 1 && pagination.page > 1) {
        await loadWorkouts(filter, pagination.page - 1);
      } else {
        // Refresh the current page
        await loadWorkouts(filter, pagination.page);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete workout';
      setError(errorMessage);
      throw err;
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadWorkouts(filter, page);
    }
  };

  return {
    workouts,
    loading,
    error,
    pagination,
    loadWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    setPage,
  };
};