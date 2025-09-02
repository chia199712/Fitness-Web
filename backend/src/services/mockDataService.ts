import { 
  mockUsers, 
  mockExercises, 
  mockWorkouts, 
  mockTemplates, 
  mockSettings,
  mockDashboardData 
} from '../data/mockData';

class MockDataService {
  private useMockData = process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

  setUseMockData(enabled: boolean) {
    this.useMockData = enabled;
  }

  getUseMockData(): boolean {
    return this.useMockData;
  }

  // User data
  getMockUsers() {
    return this.useMockData ? mockUsers : [];
  }

  getMockUserById(userId: string) {
    return this.useMockData ? mockUsers.find(user => user.id === userId) : null;
  }

  getMockUserByEmail(email: string) {
    return this.useMockData ? mockUsers.find(user => user.email === email) : null;
  }

  // Exercise data
  getMockExercises() {
    return this.useMockData ? mockExercises : [];
  }

  getMockExerciseById(exerciseId: string) {
    return this.useMockData ? mockExercises.find(exercise => exercise.id === exerciseId) : null;
  }

  getMockExercisesByCategory(category: string) {
    return this.useMockData ? mockExercises.filter(exercise => exercise.category === category) : [];
  }

  getMockExercisesByMuscleGroup(muscleGroup: string) {
    return this.useMockData ? mockExercises.filter(exercise => 
      exercise.muscleGroup.some(muscle => 
        muscle.toLowerCase().includes(muscleGroup.toLowerCase())
      )
    ) : [];
  }

  // Workout data
  getMockWorkouts() {
    return this.useMockData ? mockWorkouts : [];
  }

  getMockWorkoutsByUserId(userId: string) {
    return this.useMockData ? mockWorkouts.filter(workout => workout.user_id === userId) : [];
  }

  getMockWorkoutById(workoutId: string) {
    return this.useMockData ? mockWorkouts.find(workout => workout.id === workoutId) : null;
  }

  getMockRecentWorkouts(userId: string, limit = 5) {
    if (!this.useMockData) return [];
    
    return mockWorkouts
      .filter(workout => workout.user_id === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Template data
  getMockTemplates() {
    return this.useMockData ? mockTemplates : [];
  }

  getMockTemplatesByUserId(userId: string) {
    return this.useMockData ? mockTemplates.filter(template => template.user_id === userId) : [];
  }

  getMockTemplateById(templateId: string) {
    return this.useMockData ? mockTemplates.find(template => template.id === templateId) : null;
  }

  getMockTemplatesByCategory(category: string) {
    return this.useMockData ? mockTemplates.filter(template => template.category === category) : [];
  }

  // Settings data
  getMockSettings() {
    return this.useMockData ? mockSettings : [];
  }

  getMockSettingsByUserId(userId: string) {
    return this.useMockData ? mockSettings.find(setting => setting.user_id === userId) : null;
  }

  // Dashboard data
  getMockDashboardData(userId: string) {
    if (!this.useMockData) return null;
    
    // Return user-specific dashboard data or default data
    if (userId === '1') {
      return mockDashboardData;
    }
    
    // Generate basic dashboard data for other users
    const userWorkouts = this.getMockWorkoutsByUserId(userId);
    const recentWorkouts = this.getMockRecentWorkouts(userId, 3);
    
    return {
      user_id: userId,
      weekly_stats: {
        workouts_completed: userWorkouts.length,
        total_duration: userWorkouts.reduce((sum, w) => sum + w.duration, 0),
        exercises_performed: userWorkouts.reduce((sum, w) => sum + w.exercises.length, 0),
        total_volume: 0,
        average_workout_duration: userWorkouts.length > 0 ? 
          userWorkouts.reduce((sum, w) => sum + w.duration, 0) / userWorkouts.length : 0
      },
      monthly_stats: {
        workouts_completed: userWorkouts.length,
        total_duration: userWorkouts.reduce((sum, w) => sum + w.duration, 0),
        exercises_performed: userWorkouts.reduce((sum, w) => sum + w.exercises.length, 0),
        total_volume: 0,
        average_workout_duration: userWorkouts.length > 0 ? 
          userWorkouts.reduce((sum, w) => sum + w.duration, 0) / userWorkouts.length : 0
      },
      recent_workouts: recentWorkouts,
      progress_charts: {
        weekly_workout_count: [],
        monthly_volume: []
      },
      achievements: []
    };
  }

  // Utility methods for mock data management
  addMockUser(user: any) {
    if (this.useMockData) {
      mockUsers.push({ ...user, id: String(mockUsers.length + 1) });
    }
  }

  addMockWorkout(workout: any) {
    if (this.useMockData) {
      mockWorkouts.push({ ...workout, id: String(mockWorkouts.length + 1) });
    }
  }

  addMockTemplate(template: any) {
    if (this.useMockData) {
      mockTemplates.push({ ...template, id: String(mockTemplates.length + 1) });
    }
  }

  // Search functionality
  searchMockExercises(query: string) {
    if (!this.useMockData) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return mockExercises.filter(exercise => 
      exercise.name.toLowerCase().includes(lowercaseQuery) ||
      exercise.englishName.toLowerCase().includes(lowercaseQuery) ||
      exercise.category.toLowerCase().includes(lowercaseQuery) ||
      exercise.muscleGroup.some(muscle => muscle.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Statistics
  getMockWorkoutStats(userId: string) {
    if (!this.useMockData) return null;
    
    const userWorkouts = this.getMockWorkoutsByUserId(userId);
    const totalWorkouts = userWorkouts.length;
    const totalDuration = userWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    
    // Calculate this week's workouts
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekWorkouts = userWorkouts.filter(workout => 
      new Date(workout.date) >= weekAgo
    );
    
    return {
      total_workouts: totalWorkouts,
      total_duration: totalDuration,
      average_duration: Math.round(avgDuration),
      this_week_workouts: thisWeekWorkouts.length,
      total_exercises: userWorkouts.reduce((sum, workout) => sum + workout.exercises.length, 0)
    };
  }
}

export default new MockDataService();