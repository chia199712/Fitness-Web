import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../../src/routes/dashboard';
import { authenticateToken } from '../../src/middleware/auth';
import { MockRequest, MockResponse, MockNextFunction } from '../types/express';

// 模擬中間件和控制器
jest.mock('../../src/middleware/auth');
jest.mock('../../src/controllers/dashboardController');

// 創建測試應用
const app = express();
app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

// 模擬儀表板控制器
const mockDashboardController = {
  getDashboardStats: jest.fn(),
  getRecentWorkouts: jest.fn(),
  getWeeklyStats: jest.fn(),
  getMonthlyStats: jest.fn(),
  getProgressData: jest.fn(),
  getPersonalRecords: jest.fn(),
};

describe('Dashboard Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 模擬認證中間件
    (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    });

    // 設定模擬控制器回應
    mockDashboardController.getDashboardStats.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          stats: {
            totalWorkouts: 45,
            totalExercises: 180,
            totalSets: 1250,
            totalWeight: 28500,
            averageWorkoutDuration: 72,
            workoutsThisWeek: 4,
            workoutsThisMonth: 16,
          },
        },
      });
    });

    mockDashboardController.getRecentWorkouts.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          workouts: [
            {
              id: 'workout-1',
              name: '胸部訓練',
              date: '2024-01-15',
              duration: 75,
              exerciseCount: 5,
              setCount: 18,
            },
            {
              id: 'workout-2',
              name: '背部訓練',
              date: '2024-01-13',
              duration: 68,
              exerciseCount: 4,
              setCount: 16,
            },
          ],
        },
      });
    });

    mockDashboardController.getWeeklyStats.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          weeklyStats: {
            currentWeek: {
              workouts: 4,
              exercises: 18,
              sets: 72,
              totalWeight: 5400,
              averageDuration: 70,
            },
            previousWeek: {
              workouts: 3,
              exercises: 14,
              sets: 56,
              totalWeight: 4200,
              averageDuration: 65,
            },
            improvement: {
              workouts: '+25%',
              exercises: '+28.6%',
              sets: '+28.6%',
              totalWeight: '+28.6%',
              averageDuration: '+7.7%',
            },
          },
        },
      });
    });

    mockDashboardController.getPersonalRecords.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          records: [
            {
              exerciseName: '臥推',
              maxWeight: 120,
              date: '2024-01-10',
              reps: 5,
            },
            {
              exerciseName: '深蹲',
              maxWeight: 150,
              date: '2024-01-08',
              reps: 8,
            },
            {
              exerciseName: '硬舉',
              maxWeight: 180,
              date: '2024-01-05',
              reps: 3,
            },
          ],
        },
      });
    });
  });

  describe('GET /api/dashboard/stats', () => {
    test('應該返回儀表板統計數據', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.stats.totalWorkouts).toBe(45);
      expect(response.body.data.stats.workoutsThisWeek).toBe(4);
      expect(mockDashboardController.getDashboardStats).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/dashboard/recent-workouts', () => {
    test('應該返回最近的訓練記錄', async () => {
      const response = await request(app)
        .get('/api/dashboard/recent-workouts')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workouts).toBeInstanceOf(Array);
      expect(response.body.data.workouts).toHaveLength(2);
      expect(response.body.data.workouts[0].name).toBe('胸部訓練');
    });

    test('應該支援限制返回數量', async () => {
      const response = await request(app)
        .get('/api/dashboard/recent-workouts?limit=5')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/dashboard/weekly-stats', () => {
    test('應該返回週統計數據', async () => {
      const response = await request(app)
        .get('/api/dashboard/weekly-stats')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.weeklyStats).toBeDefined();
      expect(response.body.data.weeklyStats.currentWeek).toBeDefined();
      expect(response.body.data.weeklyStats.previousWeek).toBeDefined();
      expect(response.body.data.weeklyStats.improvement).toBeDefined();
      expect(response.body.data.weeklyStats.currentWeek.workouts).toBe(4);
    });
  });

  describe('GET /api/dashboard/monthly-stats', () => {
    test('應該返回月統計數據', async () => {
      mockDashboardController.getMonthlyStats.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          data: {
            monthlyStats: {
              currentMonth: {
                workouts: 16,
                exercises: 72,
                sets: 288,
                totalWeight: 21600,
              },
              previousMonth: {
                workouts: 14,
                exercises: 63,
                sets: 252,
                totalWeight: 18900,
              },
              improvement: {
                workouts: '+14.3%',
                exercises: '+14.3%',
                sets: '+14.3%',
                totalWeight: '+14.3%',
              },
            },
          },
        });
      });

      const response = await request(app)
        .get('/api/dashboard/monthly-stats')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.monthlyStats).toBeDefined();
      expect(response.body.data.monthlyStats.currentMonth.workouts).toBe(16);
    });
  });

  describe('GET /api/dashboard/progress', () => {
    test('應該返回進度數據', async () => {
      mockDashboardController.getProgressData.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          data: {
            progress: {
              exerciseProgress: [
                {
                  exerciseName: '臥推',
                  data: [
                    { date: '2024-01-01', weight: 100 },
                    { date: '2024-01-08', weight: 110 },
                    { date: '2024-01-15', weight: 120 },
                  ],
                },
              ],
              volumeProgress: [
                { date: '2024-01-01', volume: 5000 },
                { date: '2024-01-08', volume: 5500 },
                { date: '2024-01-15', volume: 6000 },
              ],
            },
          },
        });
      });

      const response = await request(app)
        .get('/api/dashboard/progress?period=month')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.progress).toBeDefined();
      expect(response.body.data.progress.exerciseProgress).toBeInstanceOf(Array);
      expect(response.body.data.progress.volumeProgress).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/dashboard/personal-records', () => {
    test('應該返回個人記錄', async () => {
      const response = await request(app)
        .get('/api/dashboard/personal-records')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.records).toBeInstanceOf(Array);
      expect(response.body.data.records).toHaveLength(3);
      expect(response.body.data.records[0].exerciseName).toBe('臥推');
      expect(response.body.data.records[0].maxWeight).toBe(120);
    });

    test('應該支援限制返回數量', async () => {
      const response = await request(app)
        .get('/api/dashboard/personal-records?limit=5')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Authentication Tests', () => {
    test('應該拒絕未認證的請求', async () => {
      // 設定認證中間件返回錯誤
      (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
        res.status(401).json({
          success: false,
          message: '未授權的訪問',
        });
      });

      const response = await request(app).get('/api/dashboard/stats');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('應該處理服務器錯誤', async () => {
      mockDashboardController.getDashboardStats.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(500).json({
          success: false,
          message: '服務器內部錯誤',
        });
      });

      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});

// 動態導入模擬的控制器
jest.doMock('../../src/controllers/dashboardController', () => mockDashboardController);