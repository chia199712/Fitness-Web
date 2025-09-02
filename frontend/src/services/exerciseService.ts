import type { Exercise, ExerciseFilter, PaginatedResponse } from '../types';
import apiService from './api';

export class ExerciseService {
  async getExercises(filter?: ExerciseFilter, page = 1, limit = 20): Promise<PaginatedResponse<Exercise>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filter parameters
    if (filter?.search) {
      params.append('search', filter.search);
    }
    if (filter?.category) {
      params.append('category', filter.category);
    }
    if (filter?.muscleGroups?.length) {
      filter.muscleGroups.forEach(group => params.append('muscleGroups', group));
    }
    if (filter?.equipment?.length) {
      filter.equipment.forEach(eq => params.append('equipment', eq));
    }

    const response = await apiService.get<PaginatedResponse<Exercise>>(`/exercises?${params}`);
    return response.data;
  }

  async getExerciseById(id: string): Promise<Exercise> {
    const response = await apiService.get<Exercise>(`/exercises/${id}`);
    return response.data;
  }

  async createExercise(exerciseData: Omit<Exercise, 'id'>): Promise<Exercise> {
    const response = await apiService.post<Exercise>('/exercises', exerciseData);
    return response.data;
  }

  async updateExercise(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    const response = await apiService.put<Exercise>(`/exercises/${id}`, exerciseData);
    return response.data;
  }

  async deleteExercise(id: string): Promise<void> {
    await apiService.delete(`/exercises/${id}`);
  }

  async getCategories(): Promise<string[]> {
    const response = await apiService.get<string[]>('/exercises/categories');
    return response.data;
  }

  async getMuscleGroups(): Promise<string[]> {
    const response = await apiService.get<string[]>('/exercises/muscle-groups');
    return response.data;
  }

  async getEquipment(): Promise<string[]> {
    const response = await apiService.get<string[]>('/exercises/equipment');
    return response.data;
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    const response = await apiService.get<Exercise[]>(`/exercises/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getAllExercises(): Promise<Exercise[]> {
    // Get all exercises without pagination for simple use cases
    const response = await apiService.get<PaginatedResponse<Exercise>>('/exercises?limit=1000');
    return response.data.data;
  }
}

export const exerciseService = new ExerciseService();