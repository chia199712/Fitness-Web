import type { 
  Workout, 
  WorkoutTemplate, 
  WorkoutForm, 
  WorkoutFilter, 
  PaginatedResponse,
  WorkoutSession,
  ExerciseSet 
} from '../types';
import apiService from './api';

export class WorkoutService {
  // Workouts CRUD
  async createWorkout(workoutData: WorkoutForm): Promise<Workout> {
    const response = await apiService.post<Workout>('/workouts', workoutData);
    return response.data;
  }

  async getWorkouts(filter?: WorkoutFilter, page = 1, limit = 10): Promise<PaginatedResponse<Workout>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filter,
    });
    
    const response = await apiService.get<PaginatedResponse<Workout>>(`/workouts?${params}`);
    return response.data;
  }

  async getWorkoutById(id: string): Promise<Workout> {
    const response = await apiService.get<Workout>(`/workouts/${id}`);
    return response.data;
  }

  async updateWorkout(id: string, workoutData: Partial<WorkoutForm>): Promise<Workout> {
    const response = await apiService.put<Workout>(`/workouts/${id}`, workoutData);
    return response.data;
  }

  async deleteWorkout(id: string): Promise<void> {
    await apiService.delete(`/workouts/${id}`);
  }

  // Workout Templates CRUD
  async createTemplate(templateData: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<WorkoutTemplate> {
    const response = await apiService.post<WorkoutTemplate>('/templates', templateData);
    return response.data;
  }

  async getTemplates(page = 1, limit = 10): Promise<PaginatedResponse<WorkoutTemplate>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiService.get<PaginatedResponse<WorkoutTemplate>>(`/templates?${params}`);
    return response.data;
  }

  async getTemplateById(id: string): Promise<WorkoutTemplate> {
    const response = await apiService.get<WorkoutTemplate>(`/templates/${id}`);
    return response.data;
  }

  async updateTemplate(id: string, templateData: Partial<WorkoutTemplate>): Promise<WorkoutTemplate> {
    const response = await apiService.put<WorkoutTemplate>(`/templates/${id}`, templateData);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    await apiService.delete(`/templates/${id}`);
  }

  // Create workout from template
  async createWorkoutFromTemplate(templateId: string, date: string): Promise<Workout> {
    const response = await apiService.post<Workout>(`/templates/${templateId}/create-workout`, { date });
    return response.data;
  }

  // Statistics
  async getWorkoutStats(): Promise<{
    totalWorkouts: number;
    totalExercises: number;
    totalSets: number;
    averageWorkoutDuration: number;
    weeklyWorkouts: number;
    monthlyWorkouts: number;
  }> {
    const response = await apiService.get('/workouts/stats');
    return response.data as {
      totalWorkouts: number;
      totalExercises: number;
      totalSets: number;
      averageWorkoutDuration: number;
      weeklyWorkouts: number;
      monthlyWorkouts: number;
    };
  }

  // Live workout session management
  async startWorkoutSession(name: string, templateId?: string): Promise<WorkoutSession> {
    const response = await apiService.post<WorkoutSession>('/workouts/session/start', {
      name,
      templateId
    });
    return response.data;
  }

  async getActiveSession(): Promise<WorkoutSession | null> {
    try {
      const response = await apiService.get<WorkoutSession>('/workouts/session/active');
      return response.data;
    } catch {
      return null;
    }
  }

  async updateSession(sessionId: string, data: Partial<WorkoutSession>): Promise<WorkoutSession> {
    const response = await apiService.put<WorkoutSession>(`/workouts/session/${sessionId}`, data);
    return response.data;
  }

  async addExerciseToSession(sessionId: string, exerciseId: string): Promise<WorkoutSession> {
    const response = await apiService.post<WorkoutSession>(`/workouts/session/${sessionId}/exercises`, {
      exerciseId
    });
    return response.data;
  }

  async addSetToExercise(sessionId: string, exerciseId: string, setData: Omit<ExerciseSet, 'id'>): Promise<WorkoutSession> {
    const response = await apiService.post<WorkoutSession>(
      `/workouts/session/${sessionId}/exercises/${exerciseId}/sets`,
      setData
    );
    return response.data;
  }

  async updateSet(sessionId: string, exerciseId: string, setId: string, setData: Partial<ExerciseSet>): Promise<WorkoutSession> {
    const response = await apiService.put<WorkoutSession>(
      `/workouts/session/${sessionId}/exercises/${exerciseId}/sets/${setId}`,
      setData
    );
    return response.data;
  }

  async deleteSet(sessionId: string, exerciseId: string, setId: string): Promise<WorkoutSession> {
    const response = await apiService.delete<WorkoutSession>(
      `/workouts/session/${sessionId}/exercises/${exerciseId}/sets/${setId}`
    );
    return response.data;
  }

  async finishWorkoutSession(sessionId: string, notes?: string): Promise<Workout> {
    const response = await apiService.post<Workout>(`/workouts/session/${sessionId}/finish`, {
      notes
    });
    return response.data;
  }

  async cancelWorkoutSession(sessionId: string): Promise<void> {
    await apiService.delete(`/workouts/session/${sessionId}`);
  }
}

export const workoutService = new WorkoutService();