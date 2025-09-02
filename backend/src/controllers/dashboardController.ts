import { Request, Response } from 'express';
import dashboardService from '../services/dashboardService';
import mockDataService from '../services/mockDataService';
import { 
  DashboardOverview, 
  DashboardStats, 
  RecentWorkout,
  PersonalRecord,
  Achievement,
  AchievementStatus,
  WorkoutInsight,
  ProgressTracking,
  CalendarItem,
  CalendarParams,
  ProgressParams,
  InsightParams,
  ApiResponse 
} from '../types';

class DashboardController {
  // GET /api/dashboard - 取得儀表板總覽
  async getDashboardOverview(req: Request, res: Response) {
    try {
      // 直接使用默認用戶ID，無需認證
      const userId = '1';

      console.log('Dashboard request - UserId:', userId);
      console.log('Use mock data:', mockDataService.getUseMockData());

      // 直接從模擬數據返回，無需檢查
      const { mockDashboardData } = await import('../data/mockData');
      
      const response: ApiResponse<any> = {
        success: true,
        data: mockDashboardData,
        message: '儀表板總覽獲取成功（模擬資料）'
      };

      return res.json(response);
    } catch (error) {
      console.error('獲取儀表板總覽失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取儀表板總覽失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/stats - 取得統計資訊
  async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const stats: DashboardStats = await dashboardService.getDashboardStats(userId);

      const response: ApiResponse<DashboardStats> = {
        success: true,
        data: stats,
        message: '統計資訊獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取統計資訊失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取統計資訊失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/recent-workouts - 近期訓練
  async getRecentWorkouts(req: Request, res: Response) {
    try {
      // 直接使用默認用戶ID，無需認證
      const userId = '1';

      const limit = parseInt(req.query.limit as string) || 10;
      
      if (limit > 50) {
        return res.status(400).json({
          success: false,
          message: '限制數量不能超過50'
        });
      }

      // 使用模擬資料進行開發測試
      if (mockDataService.getUseMockData()) {
        const recentWorkouts = mockDataService.getMockRecentWorkouts(userId, limit);

        const response: ApiResponse<any[]> = {
          success: true,
          data: recentWorkouts,
          message: '近期訓練獲取成功（模擬資料）'
        };

        return res.json(response);
      }

      const recentWorkouts: RecentWorkout[] = await dashboardService.getRecentWorkouts(userId, limit);

      const response: ApiResponse<RecentWorkout[]> = {
        success: true,
        data: recentWorkouts,
        message: '近期訓練獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取近期訓練失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取近期訓練失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/personal-records - 個人記錄
  async getPersonalRecords(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const personalRecords: PersonalRecord[] = await dashboardService.getPersonalRecords(userId);

      const response: ApiResponse<PersonalRecord[]> = {
        success: true,
        data: personalRecords,
        message: '個人記錄獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取個人記錄失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取個人記錄失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/calendar - 訓練日曆
  async getTrainingCalendar(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);

      // 驗證年月參數
      if (!year || !month || year < 2020 || year > 2030 || month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          message: '無效的年月參數，年份應在2020-2030之間，月份應在1-12之間'
        });
      }

      const params: CalendarParams = { year, month };
      const calendar: CalendarItem[] = await dashboardService.getTrainingCalendar(userId, params);

      const response: ApiResponse<CalendarItem[]> = {
        success: true,
        data: calendar,
        message: '訓練日曆獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取訓練日曆失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取訓練日曆失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/achievements - 成就列表
  async getAchievements(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const achievements: Achievement[] = await dashboardService.getAchievements(userId);

      const response: ApiResponse<Achievement[]> = {
        success: true,
        data: achievements,
        message: '成就列表獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取成就列表失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取成就列表失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/progress - 進度追蹤
  async getProgressTracking(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const period = req.query.period as 'week' | 'month' | 'quarter' | 'year' || 'month';
      const metric = req.query.metric as 'volume' | 'duration' | 'workouts' | 'strength' || 'volume';
      const start_date = req.query.start_date as string;
      const end_date = req.query.end_date as string;

      // 驗證 period 參數
      const validPeriods = ['week', 'month', 'quarter', 'year'];
      if (!validPeriods.includes(period)) {
        return res.status(400).json({
          success: false,
          message: `無效的時間週期，支援的週期: ${validPeriods.join(', ')}`
        });
      }

      // 驗證 metric 參數
      const validMetrics = ['volume', 'duration', 'workouts', 'strength'];
      if (!validMetrics.includes(metric)) {
        return res.status(400).json({
          success: false,
          message: `無效的指標類型，支援的指標: ${validMetrics.join(', ')}`
        });
      }

      // 驗證日期格式
      if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        return res.status(400).json({
          success: false,
          message: '開始日期格式不正確，應為 YYYY-MM-DD'
        });
      }

      if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
        return res.status(400).json({
          success: false,
          message: '結束日期格式不正確，應為 YYYY-MM-DD'
        });
      }

      const params: ProgressParams = {
        period,
        metric,
        start_date,
        end_date
      };

      const progress: ProgressTracking[] = await dashboardService.getProgressTracking(userId, params);

      const response: ApiResponse<ProgressTracking[]> = {
        success: true,
        data: progress,
        message: '進度追蹤獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取進度追蹤失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取進度追蹤失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/insights - 訓練洞察
  async getWorkoutInsights(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const type = req.query.type as 'best_time' | 'rest_analysis' | 'efficiency' | 'balance' | 'suggestion';
      const priority = req.query.priority as 'low' | 'medium' | 'high';
      const limit = parseInt(req.query.limit as string) || 10;

      // 驗證 type 參數
      if (type) {
        const validTypes = ['best_time', 'rest_analysis', 'efficiency', 'balance', 'suggestion'];
        if (!validTypes.includes(type)) {
          return res.status(400).json({
            success: false,
            message: `無效的洞察類型，支援的類型: ${validTypes.join(', ')}`
          });
        }
      }

      // 驗證 priority 參數
      if (priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
          return res.status(400).json({
            success: false,
            message: `無效的優先級，支援的優先級: ${validPriorities.join(', ')}`
          });
        }
      }

      // 驗證 limit 參數
      if (limit < 1 || limit > 50) {
        return res.status(400).json({
          success: false,
          message: '限制數量應在1-50之間'
        });
      }

      const params: InsightParams = {
        type,
        priority,
        limit
      };

      const insights: WorkoutInsight[] = await dashboardService.getWorkoutInsights(userId, params);

      const response: ApiResponse<WorkoutInsight[]> = {
        success: true,
        data: insights,
        message: '訓練洞察獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取訓練洞察失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取訓練洞察失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/summary - 快速摘要（結合多個端點的輕量版本）
  async getDashboardSummary(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      // 並行獲取多個資料
      const [
        overview,
        recentWorkouts,
        recentAchievements,
        topInsights
      ] = await Promise.all([
        dashboardService.getDashboardOverview(userId),
        dashboardService.getRecentWorkouts(userId, 5),
        dashboardService.getAchievements(userId).then(achievements => 
          achievements.filter(a => a.status === AchievementStatus.COMPLETED).slice(0, 3)
        ),
        dashboardService.getWorkoutInsights(userId, { priority: 'high', limit: 3 })
      ]);

      const summary = {
        overview: {
          user: overview.user,
          current_week: overview.current_week,
          quick_stats: overview.quick_stats
        },
        recent_workouts: recentWorkouts,
        recent_achievements: recentAchievements,
        insights: topInsights
      };

      const response: ApiResponse<any> = {
        success: true,
        data: summary,
        message: '儀表板摘要獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取儀表板摘要失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取儀表板摘要失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/metrics - 關鍵指標
  async getKeyMetrics(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const period = req.query.period as string || 'month';
      const validPeriods = ['week', 'month', 'quarter', 'year'];
      
      if (!validPeriods.includes(period)) {
        return res.status(400).json({
          success: false,
          message: `無效的時間週期，支援的週期: ${validPeriods.join(', ')}`
        });
      }

      const stats = await dashboardService.getDashboardStats(userId);
      
      // 根據週期選擇對應的統計數據
      const periodStats = period === 'week' ? stats.this_week : stats.this_month;
      
      const metrics = {
        period: period,
        workouts: periodStats.workouts,
        total_volume: periodStats.volume,
        total_duration: periodStats.duration,
        total_sets: periodStats.sets,
        total_reps: periodStats.reps,
        average_workout_duration: stats.overview.average_workout_duration,
        current_streak: stats.overview.current_streak,
        trends: {
          workout_frequency: stats.trends.workout_frequency.slice(-4), // 最近4個週期
          volume_progression: stats.trends.volume_progression.slice(-4)
        }
      };

      const response: ApiResponse<any> = {
        success: true,
        data: metrics,
        message: '關鍵指標獲取成功'
      };

      res.json(response);
    } catch (error) {
      console.error('獲取關鍵指標失敗:', error);
      res.status(500).json({
        success: false,
        message: '獲取關鍵指標失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // POST /api/dashboard/refresh-cache - 刷新快取
  async refreshCache(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      // 這裡可以實現快取刷新邏輯
      // 例如：清除特定用戶的所有快取
      
      const response: ApiResponse<any> = {
        success: true,
        message: '快取刷新成功'
      };

      res.json(response);
    } catch (error) {
      console.error('刷新快取失敗:', error);
      res.status(500).json({
        success: false,
        message: '刷新快取失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // GET /api/dashboard/export - 匯出儀表板數據
  async exportDashboardData(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      const format = req.query.format as string || 'json';
      const validFormats = ['json', 'csv'];

      if (!validFormats.includes(format)) {
        return res.status(400).json({
          success: false,
          message: `不支援的格式，支援的格式: ${validFormats.join(', ')}`
        });
      }

      // 獲取完整的儀表板數據
      const [overview, stats, personalRecords, achievements] = await Promise.all([
        dashboardService.getDashboardOverview(userId),
        dashboardService.getDashboardStats(userId),
        dashboardService.getPersonalRecords(userId),
        dashboardService.getAchievements(userId)
      ]);

      const exportData = {
        overview,
        stats,
        personal_records: personalRecords,
        achievements,
        exported_at: new Date().toISOString()
      };

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=dashboard-${userId}-${Date.now()}.json`);
        res.json(exportData);
      } else {
        // CSV format implementation would go here
        res.status(501).json({
          success: false,
          message: 'CSV 格式匯出功能尚未實現'
        });
      }
    } catch (error) {
      console.error('匯出儀表板數據失敗:', error);
      res.status(500).json({
        success: false,
        message: '匯出儀表板數據失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }
}

export default new DashboardController();