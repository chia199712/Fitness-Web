import { useState, useEffect } from 'react';
import type { Exercise, ExerciseFilter, PaginatedResponse } from '../types';
import { exerciseService } from '../services';

interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  categories: string[];
  muscleGroups: string[];
  equipment: string[];
  loadExercises: (filter?: ExerciseFilter, page?: number) => Promise<void>;
  searchExercises: (query: string) => Promise<Exercise[]>;
  setPage: (page: number) => void;
}

export const useExercises = (initialFilter: ExerciseFilter = {}): UseExercisesReturn => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ExerciseFilter>(initialFilter);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);

  useEffect(() => {
    loadFilterOptions();
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFilterOptions = async () => {
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

  const loadExercises = async (newFilter: ExerciseFilter = filter, page: number = pagination.page) => {
    try {
      setLoading(true);
      setError(null);
      setFilter(newFilter);
      
      const response: PaginatedResponse<Exercise> = await exerciseService.getExercises(
        newFilter,
        page,
        12
      );
      
      setExercises(response.data);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load exercises';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchExercises = async (query: string): Promise<Exercise[]> => {
    try {
      setError(null);
      return await exerciseService.searchExercises(query);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search exercises';
      setError(errorMessage);
      return [];
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadExercises(filter, page);
    }
  };

  return {
    exercises,
    loading,
    error,
    pagination,
    categories,
    muscleGroups,
    equipment,
    loadExercises,
    searchExercises,
    setPage,
  };
};