import type { 
  DashboardData, 
  PersonalRecord, 
  CalendarData, 
  ProgressData 
} from '../types';
import apiService from './api';

export class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiService.get<DashboardData>('/dashboard');
    return response.data;
  }

  async getPersonalRecords(): Promise<PersonalRecord[]> {
    const response = await apiService.get<PersonalRecord[]>('/dashboard/records');
    return response.data;
  }

  async getWorkoutCalendar(year: number, month: number): Promise<CalendarData[]> {
    const response = await apiService.get<CalendarData[]>(`/dashboard/calendar?year=${year}&month=${month}`);
    return response.data;
  }

  async getProgressData(exerciseId?: string, timeframe = '30d'): Promise<ProgressData[]> {
    const params = new URLSearchParams({ timeframe });
    if (exerciseId) {
      params.append('exerciseId', exerciseId);
    }
    
    const response = await apiService.get<ProgressData[]>(`/dashboard/progress?${params}`);
    return response.data;
  }

  async getWeeklyStats(): Promise<{
    workouts: number;
    exercises: number;
    volume: number;
    duration: number;
  }> {
    const response = await apiService.get('/dashboard/stats/weekly');
    return response.data as {
      workouts: number;
      exercises: number;
      volume: number;
      duration: number;
    };
  }

  async getMonthlyStats(): Promise<{
    workouts: number;
    exercises: number;
    volume: number;
    duration: number;
  }> {
    const response = await apiService.get('/dashboard/stats/monthly');
    return response.data as {
      workouts: number;
      exercises: number;
      volume: number;
      duration: number;
    };
  }

  async getYearlyStats(): Promise<{
    workouts: number;
    exercises: number;
    volume: number;
    duration: number;
  }> {
    const response = await apiService.get('/dashboard/stats/yearly');
    return response.data as {
      workouts: number;
      exercises: number;
      volume: number;
      duration: number;
    };
  }

  async getStreakData(): Promise<{
    currentStreak: number;
    longestStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
  }> {
    const response = await apiService.get('/dashboard/streak');
    return response.data as {
      currentStreak: number;
      longestStreak: number;
      weeklyGoal: number;
      weeklyProgress: number;
    };
  }
}

export const dashboardService = new DashboardService();