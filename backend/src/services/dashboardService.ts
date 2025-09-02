// Google Sheets integration removed - dependencies not available
import {
  DashboardOverview,
  DashboardStats,
  RecentWorkout,
  PersonalRecord,
  Achievement,
  AchievementType,
  AchievementStatus,
  WorkoutInsight,
  ProgressTracking,
  CalendarItem,
  CalendarParams,
  ProgressParams,
  InsightParams,
  DashboardCache,
  WorkoutStatus,
  WorkoutWithDetails
} from '../types';
import workoutService from './workoutService';
import exerciseService from './exerciseService';
import userService from './userService';

class DashboardService {
  // Google Sheets integration removed - using in-memory cache instead
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  // 快取設定
  private readonly CACHE_DURATION = {
    OVERVIEW: 5 * 60 * 1000, // 5分鐘
    STATS: 10 * 60 * 1000, // 10分鐘
    CALENDAR: 30 * 60 * 1000, // 30分鐘
    INSIGHTS: 60 * 60 * 1000, // 1小時
  };

  // Google Sheets functionality removed - using in-memory cache
  
  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const cacheType = cacheKey.split('_')[0] as keyof typeof this.CACHE_DURATION;
    const duration = this.CACHE_DURATION[cacheType] || this.CACHE_DURATION.OVERVIEW;
    
    return Date.now() - cached.timestamp < duration;
  }

  private setCache(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  private getFromCache(cacheKey: string): any | null {
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)?.data || null;
    }
    return null;
  }

  // 獲取儀表板總覽
  async getDashboardOverview(userId: string): Promise<DashboardOverview> {
    const cacheKey = `overview_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // 獲取用戶基本信息
      const user = await userService.findUserById(userId);
      if (!user) {
        throw new Error('用戶不存在');
      }

      // 獲取用戶所有訓練記錄
      const workoutsResult = await workoutService.getWorkouts(userId, {});
      const allWorkouts = workoutsResult.workouts;
      const completedWorkouts = allWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);

      // 計算連續訓練天數
      const streakDays = this.calculateStreakDays(completedWorkouts);

      // 獲取本週統計
      const currentWeekStats = await this.getCurrentWeekStats(userId);

      // 獲取近期成就
      const recentAchievements = await this.getRecentAchievements(userId, 3);

      // 獲取快速統計
      const quickStats = await this.getQuickStats(userId);

      // 獲取即將到來的里程碑
      const upcomingMilestones = await this.getUpcomingMilestones(userId);

      const overview: DashboardOverview = {
        user: {
          name: user.name,
          streak_days: streakDays,
          total_workouts: completedWorkouts.length,
          member_since: user.created_at
        },
        current_week: currentWeekStats,
        recent_achievements: recentAchievements,
        quick_stats: quickStats,
        upcoming_milestones: upcomingMilestones
      };

      this.setCache(cacheKey, overview);
      return overview;
    } catch (error) {
      console.error('獲取儀表板總覽失敗:', error);
      throw error;
    }
  }

  // 獲取詳細統計
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const cacheKey = `stats_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const allWorkoutsResult = await workoutService.getWorkouts(userId, {});
      const allWorkouts = allWorkoutsResult.workouts;
      const completedWorkouts = allWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);

      // 計算總體統計
      const overview = this.calculateOverviewStats(completedWorkouts);

      // 計算本週統計
      const thisWeek = this.calculatePeriodStats(completedWorkouts, 'week');

      // 計算本月統計
      const thisMonth = this.calculatePeriodStats(completedWorkouts, 'month');

      // 計算趨勢數據
      const trends = await this.calculateTrends(completedWorkouts);

      // 計算肌群分布
      const muscleGroupDistribution = await this.calculateMuscleGroupDistribution(userId);

      // 獲取最愛動作
      const favoriteExercises = await this.getFavoriteExercises(userId);

      const stats: DashboardStats = {
        overview,
        this_week: thisWeek,
        this_month: thisMonth,
        trends,
        muscle_group_distribution: muscleGroupDistribution,
        favorite_exercises: favoriteExercises
      };

      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('獲取儀表板統計失敗:', error);
      throw error;
    }
  }

  // 獲取近期訓練
  async getRecentWorkouts(userId: string, limit: number = 10): Promise<RecentWorkout[]> {
    try {
      const workoutsResult = await workoutService.getWorkouts(userId, {
        limit,
        page: 1
      });
      const workouts = workoutsResult.workouts;

      const recentWorkouts: RecentWorkout[] = await Promise.all(
        workouts.map(async (workout) => {
          const workoutDetails = await workoutService.getWorkoutWithDetails(userId, workout.workout_id);
          const highlights = await this.generateWorkoutHighlights(workoutDetails);

          return {
            workout_id: workout.workout_id,
            title: workout.title,
            date: workout.date,
            duration: workout.duration,
            total_volume: workout.total_volume,
            total_sets: workout.total_sets,
            status: workout.status,
            exercises_count: workoutDetails?.exercises?.length || 0,
            highlights
          };
        })
      );

      return recentWorkouts;
    } catch (error) {
      console.error('獲取近期訓練失敗:', error);
      throw error;
    }
  }

  // 獲取個人記錄
  async getPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    try {
      // Google Sheets functionality removed
      const rows: any[] = []; // Google Sheets functionality removed
      
      const records = rows
        .filter((row: any) => row.get('user_id') === userId)
        .map((row: any) => ({
          pr_id: row.get('pr_id'),
          user_id: row.get('user_id'),
          exercise_id: row.get('exercise_id'),
          exercise_name: row.get('exercise_name'),
          max_weight: parseFloat(row.get('max_weight')) || 0,
          max_reps: parseInt(row.get('max_reps')) || 0,
          max_volume: parseFloat(row.get('max_volume')) || 0,
          achieved_at: row.get('achieved_at'),
          workout_id: row.get('workout_id'),
          previous_record: row.get('previous_record') ? JSON.parse(row.get('previous_record')) : undefined
        }));

      return records.sort((a: any, b: any) => new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime());
    } catch (error) {
      console.error('獲取個人記錄失敗:', error);
      return [];
    }
  }

  // 獲取訓練日曆
  async getTrainingCalendar(userId: string, params: CalendarParams): Promise<CalendarItem[]> {
    const cacheKey = `calendar_${userId}_${params.year}_${params.month}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const startDate = new Date(params.year, params.month - 1, 1);
      const endDate = new Date(params.year, params.month, 0);

      const workoutsResult = await workoutService.getWorkouts(userId, {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
      const workouts = workoutsResult.workouts;

      const calendar: CalendarItem[] = [];
      const workoutsByDate = this.groupWorkoutsByDate(workouts);

      // 生成該月的所有日期
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        const dayWorkouts = workoutsByDate[dateString] || [];

        calendar.push({
          date: dateString,
          workout_count: dayWorkouts.length,
          total_duration: dayWorkouts.reduce((sum: number, w: any) => sum + w.duration, 0),
          total_volume: dayWorkouts.reduce((sum: number, w: any) => sum + w.total_volume, 0),
          workouts: dayWorkouts.map((w: any) => ({
            workout_id: w.workout_id,
            title: w.title,
            duration: w.duration,
            status: w.status
          })),
          is_rest_day: dayWorkouts.length === 0
        });
      }

      this.setCache(cacheKey, calendar);
      return calendar;
    } catch (error) {
      console.error('獲取訓練日曆失敗:', error);
      throw error;
    }
  }

  // 獲取成就列表
  async getAchievements(userId: string): Promise<Achievement[]> {
    try {
      // 先更新成就狀態
      await this.updateAchievements(userId);

      // Google Sheets functionality removed
      const rows: any[] = []; // Google Sheets functionality removed
      
      const achievements = rows
        .filter((row: any) => row.get('user_id') === userId)
        .map((row: any) => ({
          achievement_id: row.get('achievement_id'),
          name: row.get('name'),
          description: row.get('description'),
          type: row.get('type') as AchievementType,
          target_value: parseInt(row.get('target_value')) || 0,
          current_value: parseInt(row.get('current_value')) || 0,
          status: row.get('status') as AchievementStatus,
          icon: row.get('icon'),
          reward_points: parseInt(row.get('reward_points')) || 0,
          unlocked_at: row.get('unlocked_at'),
          created_at: row.get('created_at')
        }));

      return achievements.sort((a: any, b: any) => {
        // 已完成的排前面，然後按進度排序
        if (a.status === AchievementStatus.COMPLETED && b.status !== AchievementStatus.COMPLETED) return -1;
        if (b.status === AchievementStatus.COMPLETED && a.status !== AchievementStatus.COMPLETED) return 1;
        return (b.current_value / b.target_value) - (a.current_value / a.target_value);
      });
    } catch (error) {
      console.error('獲取成就列表失敗:', error);
      return [];
    }
  }

  // 獲取進度追蹤
  async getProgressTracking(userId: string, params: ProgressParams): Promise<ProgressTracking[]> {
    try {
      const { period, metric, start_date, end_date } = params;
      
      // 計算日期範圍
      const dates = this.calculateDateRange(period, start_date, end_date);
      
      // Google Sheets functionality removed
      const rows: any[] = []; // Google Sheets functionality removed
      
      let progress = rows
        .filter((row: any) => {
          const rowUserId = row.get('user_id');
          const rowDate = row.get('date');
          return rowUserId === userId && 
                 rowDate >= dates.start && 
                 rowDate <= dates.end;
        })
        .map((row: any) => ({
          date: row.get('date'),
          total_volume: parseFloat(row.get('total_volume')) || 0,
          total_workouts: parseInt(row.get('total_workouts')) || 0,
          average_duration: parseFloat(row.get('average_duration')) || 0,
          strength_index: parseFloat(row.get('strength_index')) || 0,
          consistency_score: parseFloat(row.get('consistency_score')) || 0
        }));

      // 如果沒有現有數據，生成進度數據
      if (progress.length === 0) {
        progress = await this.generateProgressData(userId, dates.start, dates.end);
      }

      return progress.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('獲取進度追蹤失敗:', error);
      return [];
    }
  }

  // 獲取訓練洞察
  async getWorkoutInsights(userId: string, params: InsightParams = {}): Promise<WorkoutInsight[]> {
    const cacheKey = `insights_${userId}_${JSON.stringify(params)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // 生成新的洞察
      const insights = await this.generateInsights(userId);
      
      // 根據參數過濾
      let filteredInsights = insights;
      if (params.type) {
        filteredInsights = filteredInsights.filter(insight => insight.type === params.type);
      }
      if (params.priority) {
        filteredInsights = filteredInsights.filter(insight => insight.priority === params.priority);
      }
      if (params.limit) {
        filteredInsights = filteredInsights.slice(0, params.limit);
      }

      this.setCache(cacheKey, filteredInsights);
      return filteredInsights;
    } catch (error) {
      console.error('獲取訓練洞察失敗:', error);
      return [];
    }
  }

  // Google Sheets cache methods removed - using in-memory cache instead

  // Google Sheets setCache method removed

  // 輔助方法
  private calculateStreakDays(workouts: any[]): number {
    if (workouts.length === 0) return 0;

    const sortedDates = workouts
      .map((w: any) => new Date(w.date).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();
    
    for (const dateStr of sortedDates) {
      const workoutDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }

    return streak;
  }

  private async getCurrentWeekStats(userId: string) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekWorkoutsResult = await workoutService.getWorkouts(userId, {
      start_date: startOfWeek.toISOString().split('T')[0],
      end_date: endOfWeek.toISOString().split('T')[0]
    });
    const weekWorkouts = weekWorkoutsResult.workouts;

    const completedWorkouts = weekWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);

    return {
      workouts_completed: completedWorkouts.length,
      total_duration: completedWorkouts.reduce((sum: number, w: any) => sum + w.duration, 0),
      total_volume: completedWorkouts.reduce((sum: number, w: any) => sum + w.total_volume, 0),
      goal_progress: Math.min((completedWorkouts.length / 3) * 100, 100) // 假設週目標是3次訓練
    };
  }

  private async getQuickStats(userId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthWorkoutsResult = await workoutService.getWorkouts(userId, {
      start_date: startOfMonth.toISOString().split('T')[0]
    });
    const monthWorkouts = monthWorkoutsResult.workouts;

    const completedWorkouts = monthWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);
    const favoriteExercises = await this.getFavoriteExercises(userId, 1);

    return {
      this_month_workouts: completedWorkouts.length,
      this_month_volume: completedWorkouts.reduce((sum: number, w: any) => sum + w.total_volume, 0),
      favorite_exercise: favoriteExercises[0]?.exercise_name || '無',
      avg_workout_duration: completedWorkouts.length > 0 
        ? Math.round(completedWorkouts.reduce((sum: number, w: any) => sum + w.duration, 0) / completedWorkouts.length)
        : 0
    };
  }

  private async getRecentAchievements(userId: string, limit: number): Promise<Achievement[]> {
    try {
      // Google Sheets functionality removed
      const rows: any[] = []; // Google Sheets functionality removed
      
      return rows
        .filter((row: any) => 
          row.get('user_id') === userId && 
          row.get('status') === AchievementStatus.COMPLETED &&
          row.get('unlocked_at')
        )
        .map((row: any) => ({
          achievement_id: row.get('achievement_id'),
          name: row.get('name'),
          description: row.get('description'),
          type: row.get('type') as AchievementType,
          target_value: parseInt(row.get('target_value')) || 0,
          current_value: parseInt(row.get('current_value')) || 0,
          status: row.get('status') as AchievementStatus,
          icon: row.get('icon'),
          reward_points: parseInt(row.get('reward_points')) || 0,
          unlocked_at: row.get('unlocked_at'),
          created_at: row.get('created_at')
        }))
        .sort((a: any, b: any) => new Date(b.unlocked_at!).getTime() - new Date(a.unlocked_at!).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('獲取近期成就失敗:', error);
      return [];
    }
  }

  private async getUpcomingMilestones(userId: string) {
    const allWorkoutsResult = await workoutService.getWorkouts(userId, {});
    const allWorkouts = allWorkoutsResult.workouts;
    const completedWorkouts = allWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);
    
    const totalWorkouts = completedWorkouts.length;
    const totalVolume = completedWorkouts.reduce((sum: number, w: any) => sum + w.total_volume, 0);

    const milestones = [];

    // 訓練次數里程碑
    const workoutMilestones = [50, 100, 200, 500, 1000];
    const nextWorkoutMilestone = workoutMilestones.find(m => m > totalWorkouts);
    if (nextWorkoutMilestone) {
      milestones.push({
        type: '訓練次數',
        current: totalWorkouts,
        target: nextWorkoutMilestone,
        progress: (totalWorkouts / nextWorkoutMilestone) * 100
      });
    }

    // 總重量里程碑 (kg)
    const volumeMilestones = [1000, 5000, 10000, 25000, 50000];
    const nextVolumeMilestone = volumeMilestones.find(m => m > totalVolume);
    if (nextVolumeMilestone) {
      milestones.push({
        type: '總重量',
        current: Math.round(totalVolume),
        target: nextVolumeMilestone,
        progress: (totalVolume / nextVolumeMilestone) * 100
      });
    }

    return milestones;
  }

  private calculateOverviewStats(workouts: any[]) {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum: number, w: any) => sum + w.duration, 0);
    const totalVolume = workouts.reduce((sum: number, w: any) => sum + w.total_volume, 0);
    const totalSets = workouts.reduce((sum: number, w: any) => sum + w.total_sets, 0);
    const totalReps = workouts.reduce((sum: number, w: any) => sum + w.total_reps, 0);

    return {
      total_workouts: totalWorkouts,
      total_duration: Math.round(totalDuration / 60), // 轉換為分鐘
      total_volume: Math.round(totalVolume),
      total_sets: totalSets,
      total_reps: totalReps,
      average_workout_duration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts / 60) : 0,
      current_streak: this.calculateStreakDays(workouts),
      longest_streak: this.calculateLongestStreak(workouts)
    };
  }

  private calculateLongestStreak(workouts: any[]): number {
    if (workouts.length === 0) return 0;

    const sortedDates = workouts
      .map((w: any) => new Date(w.date).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort();

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currentDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  private calculatePeriodStats(workouts: any[], period: 'week' | 'month') {
    const now = new Date();
    let startDate: Date;

    if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const periodWorkouts = workouts.filter((w: any) => new Date(w.date) >= startDate);

    return {
      workouts: periodWorkouts.length,
      duration: Math.round(periodWorkouts.reduce((sum: number, w: any) => sum + w.duration, 0) / 60),
      volume: Math.round(periodWorkouts.reduce((sum: number, w: any) => sum + w.total_volume, 0)),
      sets: periodWorkouts.reduce((sum: number, w: any) => sum + w.total_sets, 0),
      reps: periodWorkouts.reduce((sum: number, w: any) => sum + w.total_reps, 0)
    };
  }

  private async calculateTrends(workouts: any[]) {
    // 按週計算訓練頻率
    const workoutFrequency = this.calculateWeeklyWorkoutFrequency(workouts);
    
    // 按週計算重量趨勢
    const volumeProgression = this.calculateWeeklyVolumeProgression(workouts);
    
    // 按週計算時長趨勢
    const durationTrends = this.calculateWeeklyDurationTrends(workouts);

    return {
      workout_frequency: workoutFrequency,
      volume_progression: volumeProgression,
      duration_trends: durationTrends
    };
  }

  private calculateWeeklyWorkoutFrequency(workouts: any[]): { period: string; workouts: number }[] {
    const trends: { [key: string]: number } = {};
    
    workouts.forEach((workout: any) => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!trends[weekKey]) {
        trends[weekKey] = 0;
      }
      trends[weekKey] += 1;
    });

    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // 最近12週
      .map(([period, workouts]) => ({ period, workouts: Math.round(workouts) }));
  }

  private calculateWeeklyVolumeProgression(workouts: any[]): { period: string; volume: number }[] {
    const trends: { [key: string]: number } = {};
    
    workouts.forEach((workout: any) => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!trends[weekKey]) {
        trends[weekKey] = 0;
      }
      trends[weekKey] += workout.total_volume || 0;
    });

    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // 最近12週
      .map(([period, volume]) => ({ period, volume: Math.round(volume) }));
  }

  private calculateWeeklyDurationTrends(workouts: any[]): { period: string; duration: number }[] {
    const trends: { [key: string]: number } = {};
    
    workouts.forEach((workout: any) => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!trends[weekKey]) {
        trends[weekKey] = 0;
      }
      trends[weekKey] += workout.duration || 0;
    });

    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // 最近12週
      .map(([period, duration]) => ({ period, duration: Math.round(duration / 60) }));
  }

  // Old calculateWeeklyTrends method removed - replaced with specific methods above

  private async calculateMuscleGroupDistribution(userId: string) {
    try {
      // 這裡需要從訓練記錄中統計肌群分布
      // 簡化實現，返回模擬數據
      return [
        { muscle_group: '胸部', percentage: 25, total_sets: 120 },
        { muscle_group: '背部', percentage: 20, total_sets: 96 },
        { muscle_group: '腿部', percentage: 30, total_sets: 144 },
        { muscle_group: '肩部', percentage: 15, total_sets: 72 },
        { muscle_group: '手臂', percentage: 10, total_sets: 48 }
      ];
    } catch (error) {
      console.error('計算肌群分布失敗:', error);
      return [];
    }
  }

  private async getFavoriteExercises(userId: string, limit: number = 5) {
    try {
      // 這裡需要從訓練記錄中統計最常用的動作
      // 簡化實現，返回模擬數據
      return [
        { exercise_id: '1', exercise_name: '卧推', times_performed: 45, total_volume: 2500, avg_weight: 80 },
        { exercise_id: '2', exercise_name: '深蹲', times_performed: 40, total_volume: 3200, avg_weight: 100 },
        { exercise_id: '3', exercise_name: '硬舉', times_performed: 35, total_volume: 2800, avg_weight: 120 }
      ].slice(0, limit);
    } catch (error) {
      console.error('獲取最愛動作失敗:', error);
      return [];
    }
  }

  private async generateWorkoutHighlights(workout: WorkoutWithDetails | null): Promise<string[]> {
    if (!workout) return [];

    const highlights: string[] = [];

    // 檢查是否有新的個人記錄
    // 這裡需要實際的PR檢查邏輯
    
    // 檢查訓練時長
    if (workout.duration > 7200) { // 超過2小時
      highlights.push('長時間訓練');
    }

    // 檢查總重量
    if (workout.total_volume > 5000) {
      highlights.push('高強度訓練');
    }

    return highlights;
  }

  private groupWorkoutsByDate(workouts: any[]) {
    return workouts.reduce((acc: any, workout: any) => {
      const date = workout.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(workout);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  private calculateDateRange(period: string, startDate?: string, endDate?: string) {
    const end = endDate ? new Date(endDate) : new Date();
    let start: Date;

    switch (period) {
      case 'week':
        start = new Date(end);
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start = new Date(end);
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start = new Date(end);
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start = new Date(end);
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  private async generateProgressData(userId: string, startDate: string, endDate: string): Promise<ProgressTracking[]> {
    // 這裡應該根據實際訓練數據生成進度追蹤數據
    // 簡化實現，返回空數組
    return [];
  }

  private async generateInsights(userId: string): Promise<WorkoutInsight[]> {
    const insights: WorkoutInsight[] = [];
    
    try {
      const allWorkoutsResult = await workoutService.getWorkouts(userId, {});
      const allWorkouts = allWorkoutsResult.workouts;
      const completedWorkouts = allWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);

      // 分析最佳訓練時間
      const bestTimeInsight = this.analyzeBestWorkoutTime(completedWorkouts);
      if (bestTimeInsight) insights.push(bestTimeInsight);

      // 分析訓練頻率
      const frequencyInsight = this.analyzeWorkoutFrequency(completedWorkouts);
      if (frequencyInsight) insights.push(frequencyInsight);

      // 分析訓練平衡性
      const balanceInsight = await this.analyzeWorkoutBalance(userId);
      if (balanceInsight) insights.push(balanceInsight);

      return insights;
    } catch (error) {
      console.error('生成洞察失敗:', error);
      return [];
    }
  }

  private analyzeBestWorkoutTime(workouts: any[]): WorkoutInsight | null {
    if (workouts.length < 5) return null;

    const timePerformance: { [hour: string]: { count: number, avgVolume: number } } = {};
    
    workouts.forEach(workout => {
      const hour = new Date(workout.start_time).getHours().toString();
      if (!timePerformance[hour]) {
        timePerformance[hour] = { count: 0, avgVolume: 0 };
      }
      timePerformance[hour].count++;
      timePerformance[hour].avgVolume += workout.total_volume;
    });

    // 計算平均表現
    Object.keys(timePerformance).forEach(hour => {
      timePerformance[hour].avgVolume /= timePerformance[hour].count;
    });

    // 找到表現最好的時間段
    const bestHour = Object.entries(timePerformance)
      .filter(([_, data]) => data.count >= 3) // 至少3次訓練
      .sort(([_, a], [__, b]) => b.avgVolume - a.avgVolume)[0];

    if (!bestHour) return null;

    return {
      insight_id: `best_time_${Date.now()}`,
      type: 'best_time',
      title: '最佳訓練時間',
      description: `您在 ${bestHour[0]}:00 時訓練表現最佳，平均重量比其他時間高 ${Math.round(bestHour[1].avgVolume)} kg`,
      data: { hour: bestHour[0], avgVolume: bestHour[1].avgVolume },
      priority: 'medium',
      created_at: new Date().toISOString()
    };
  }

  private analyzeWorkoutFrequency(workouts: any[]): WorkoutInsight | null {
    if (workouts.length < 10) return null;

    const last30Days = workouts.filter((w: any) => {
      const workoutDate = new Date(w.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return workoutDate >= thirtyDaysAgo;
    });

    const frequency = last30Days.length / 4.3; // 週平均

    let title = '';
    let description = '';
    let priority: 'low' | 'medium' | 'high' = 'medium';

    if (frequency < 2) {
      title = '建議增加訓練頻率';
      description = `您最近一個月的訓練頻率較低（每週 ${frequency.toFixed(1)} 次），建議增加到每週 3-4 次以獲得更好效果`;
      priority = 'high';
    } else if (frequency > 6) {
      title = '注意訓練強度';
      description = `您最近一個月訓練很勤奮（每週 ${frequency.toFixed(1)} 次），記得給身體充分休息時間`;
      priority = 'medium';
    } else {
      title = '訓練頻率良好';
      description = `您保持了良好的訓練頻率（每週 ${frequency.toFixed(1)} 次），繼續保持！`;
      priority = 'low';
    }

    return {
      insight_id: `frequency_${Date.now()}`,
      type: 'efficiency',
      title,
      description,
      data: { frequency, period: '30天' },
      priority,
      created_at: new Date().toISOString()
    };
  }

  private async analyzeWorkoutBalance(userId: string): Promise<WorkoutInsight | null> {
    try {
      const muscleDistribution = await this.calculateMuscleGroupDistribution(userId);
      
      // 檢查是否有肌群練得太少
      const undertrainedMuscles = muscleDistribution.filter(muscle => muscle.percentage < 10);
      
      if (undertrainedMuscles.length > 0) {
        return {
          insight_id: `balance_${Date.now()}`,
          type: 'balance',
          title: '注意訓練平衡性',
          description: `${undertrainedMuscles.map(m => m.muscle_group).join('、')} 的訓練比例較低，建議增加相關動作`,
          data: { undertrainedMuscles },
          priority: 'medium',
          created_at: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('分析訓練平衡性失敗:', error);
      return null;
    }
  }

  // 更新成就狀態
  private async updateAchievements(userId: string): Promise<void> {
    try {
      const allWorkoutsResult = await workoutService.getWorkouts(userId, {});
      const allWorkouts = allWorkoutsResult.workouts;
      const completedWorkouts = allWorkouts.filter((w: any) => w.status === WorkoutStatus.COMPLETED);

      // 檢查訓練次數成就
      await this.checkWorkoutCountAchievements(userId, completedWorkouts.length);

      // 檢查總重量成就
      const totalVolume = completedWorkouts.reduce((sum: number, w: any) => sum + w.total_volume, 0);
      await this.checkVolumeAchievements(userId, totalVolume);

      // 檢查連續訓練天數成就
      const streakDays = this.calculateStreakDays(completedWorkouts);
      await this.checkStreakAchievements(userId, streakDays);

    } catch (error) {
      console.error('更新成就失敗:', error);
    }
  }

  private async checkWorkoutCountAchievements(userId: string, workoutCount: number): Promise<void> {
    const milestones = [10, 25, 50, 100, 200, 500, 1000];
    
    for (const milestone of milestones) {
      await this.createOrUpdateAchievement(userId, {
        name: `訓練達人 ${milestone}`,
        description: `完成 ${milestone} 次訓練`,
        type: AchievementType.WORKOUT_COUNT,
        target_value: milestone,
        current_value: workoutCount,
        icon: '🏋️'
      });
    }
  }

  private async checkVolumeAchievements(userId: string, totalVolume: number): Promise<void> {
    const milestones = [1000, 5000, 10000, 25000, 50000, 100000];
    
    for (const milestone of milestones) {
      await this.createOrUpdateAchievement(userId, {
        name: `力量怪獸 ${milestone}kg`,
        description: `總重量達到 ${milestone} 公斤`,
        type: AchievementType.TOTAL_VOLUME,
        target_value: milestone,
        current_value: Math.round(totalVolume),
        icon: '💪'
      });
    }
  }

  private async checkStreakAchievements(userId: string, streakDays: number): Promise<void> {
    const milestones = [7, 14, 30, 60, 100, 365];
    
    for (const milestone of milestones) {
      await this.createOrUpdateAchievement(userId, {
        name: `連續訓練 ${milestone} 天`,
        description: `連續 ${milestone} 天進行訓練`,
        type: AchievementType.STREAK_DAYS,
        target_value: milestone,
        current_value: streakDays,
        icon: '🔥'
      });
    }
  }

  private async createOrUpdateAchievement(userId: string, achievementData: {
    name: string;
    description: string;
    type: AchievementType;
    target_value: number;
    current_value: number;
    icon: string;
  }): Promise<void> {
    try {
      // Google Sheets functionality removed
      const rows: any[] = []; // Google Sheets functionality removed
      
      // 檢查是否已存在該成就
      const existingAchievement = rows.find((row: any) => 
        row.get('user_id') === userId &&
        row.get('type') === achievementData.type &&
        row.get('target_value') === achievementData.target_value.toString()
      );

      const status = achievementData.current_value >= achievementData.target_value 
        ? AchievementStatus.COMPLETED 
        : achievementData.current_value > 0 
          ? AchievementStatus.IN_PROGRESS 
          : AchievementStatus.LOCKED;

      if (existingAchievement) {
        // 更新現有成就
        const wasCompleted = existingAchievement.get('status') === AchievementStatus.COMPLETED;
        const isNowCompleted = status === AchievementStatus.COMPLETED;

        existingAchievement.set('current_value', achievementData.current_value);
        existingAchievement.set('status', status);

        if (!wasCompleted && isNowCompleted) {
          existingAchievement.set('unlocked_at', new Date().toISOString());
        }

        await existingAchievement.save();
      } else {
        // 創建新成就
        // Google Sheets functionality removed - achievement data would be:
        const newAchievement = {
          achievement_id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: userId,
          name: achievementData.name,
          description: achievementData.description,
          type: achievementData.type,
          target_value: achievementData.target_value,
          current_value: achievementData.current_value,
          status: status,
          icon: achievementData.icon,
          reward_points: this.calculateRewardPoints(achievementData.target_value, achievementData.type),
          unlocked_at: status === AchievementStatus.COMPLETED ? new Date().toISOString() : '',
          created_at: new Date().toISOString()
        };
        console.log('Achievement would be saved:', newAchievement);
      }
    } catch (error) {
      console.error('創建或更新成就失敗:', error);
    }
  }

  private calculateRewardPoints(targetValue: number, type: AchievementType): number {
    const basePoints = {
      [AchievementType.WORKOUT_COUNT]: 10,
      [AchievementType.TOTAL_VOLUME]: 5,
      [AchievementType.STREAK_DAYS]: 15,
      [AchievementType.PERSONAL_RECORD]: 20,
      [AchievementType.MILESTONE]: 25
    };

    return Math.round(basePoints[type] * Math.log10(targetValue + 1));
  }
}

export default new DashboardService();