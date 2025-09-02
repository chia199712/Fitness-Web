import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import workoutRoutes from '../../src/routes/workouts';
import { authenticateToken } from '../../src/middleware/auth';
import { MockRequest, MockResponse, MockNextFunction } from '../types/express';

// 模擬中間件和控制器
jest.mock('../../src/middleware/auth');
jest.mock('../../src/controllers/workoutController');

// 創建測試應用
const app = express();
app.use(express.json());
app.use('/api/workouts', workoutRoutes);

// 模擬訓練控制器
const mockWorkoutController = {
  getWorkouts: jest.fn(),
  getWorkoutById: jest.fn(),
  createWorkout: jest.fn(),
  updateWorkout: jest.fn(),
  deleteWorkout: jest.fn(),
  getWorkoutStats: jest.fn(),
  addExerciseToWorkout: jest.fn(),
  updateWorkoutExercise: jest.fn(),
  removeExerciseFromWorkout: jest.fn(),
  addSet: jest.fn(),
  updateSet: jest.fn(),
  deleteSet: jest.fn(),
  finishWorkout: jest.fn(),
};

describe('Workout Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 模擬認證中間件
    (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    });

    // 設定模擬控制器回應
    mockWorkoutController.getWorkouts.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          workouts: [
            {
              id: 'workout-1',
              name: '胸部訓練',
              date: '2024-01-15',
              exercises: [],
            },
          ],
        },
      });
    });

    mockWorkoutController.getWorkoutById.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          workout: {
            id: req.params?.id,
            name: '胸部訓練',
            date: '2024-01-15',
            exercises: [
              {
                id: 'exercise-1',
                name: '臥推',
                sets: [
                  { id: 'set-1', weight: 80, reps: 10 },
                  { id: 'set-2', weight: 85, reps: 8 },
                ],
              },
            ],
          },
        },
      });
    });

    mockWorkoutController.createWorkout.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(201).json({
        success: true,
        message: '訓練創建成功',
        data: {
          workout: {
            id: 'new-workout-id',
            name: req.body?.name,
            date: req.body?.date,
            exercises: [],
          },
        },
      });
    });

    mockWorkoutController.getWorkoutStats.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          stats: {
            totalWorkouts: 25,
            totalExercises: 120,
            totalSets: 850,
            averageWorkoutDuration: 65,
          },
        },
      });
    });
  });

  describe('GET /api/workouts', () => {
    test('應該返回用戶的訓練記錄列表', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workouts).toBeInstanceOf(Array);
      expect(mockWorkoutController.getWorkouts).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/workouts/stats', () => {
    test('應該返回訓練統計數據', async () => {
      const response = await request(app)
        .get('/api/workouts/stats')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.stats.totalWorkouts).toBe(25);
    });
  });

  describe('GET /api/workouts/:id', () => {
    test('應該返回特定訓練的詳細信息', async () => {
      const workoutId = 'test-workout-id';

      const response = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workout.id).toBe(workoutId);
      expect(response.body.data.workout.exercises).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/workouts', () => {
    test('應該成功創建新訓練', async () => {
      const workoutData = {
        name: '背部訓練',
        date: '2024-01-16',
        templateId: 'template-1',
      };

      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(workoutData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('訓練創建成功');
      expect(response.body.data.workout.name).toBe(workoutData.name);
    });

    test('應該拒絕無效的訓練資料', async () => {
      const invalidData = {
        name: '', // 空名稱
        date: 'invalid-date',
      };

      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/workouts/:id', () => {
    test('應該成功更新訓練', async () => {
      mockWorkoutController.updateWorkout.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '訓練更新成功',
          data: {
            workout: {
              id: req.params?.id,
              name: req.body?.name,
              date: req.body?.date,
            },
          },
        });
      });

      const workoutId = 'test-workout-id';
      const updateData = {
        name: '更新的訓練名稱',
        date: '2024-01-17',
      };

      const response = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.workout.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    test('應該成功刪除訓練', async () => {
      mockWorkoutController.deleteWorkout.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '訓練刪除成功',
        });
      });

      const workoutId = 'test-workout-id';

      const response = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('訓練刪除成功');
    });
  });

  describe('POST /api/workouts/:id/exercises', () => {
    test('應該成功添加動作到訓練', async () => {
      mockWorkoutController.addExerciseToWorkout.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '動作添加成功',
          data: {
            exercise: {
              id: 'new-exercise-id',
              name: req.body?.name,
              sets: [],
            },
          },
        });
      });

      const workoutId = 'test-workout-id';
      const exerciseData = {
        exerciseId: 'exercise-template-1',
        name: '槓鈴深蹲',
        targetSets: 4,
        targetReps: 8,
      };

      const response = await request(app)
        .post(`/api/workouts/${workoutId}/exercises`)
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(exerciseData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.exercise.name).toBe(exerciseData.name);
    });
  });

  describe('POST /api/workouts/:id/exercises/:exerciseId/sets', () => {
    test('應該成功添加組數', async () => {
      mockWorkoutController.addSet.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '組數添加成功',
          data: {
            set: {
              id: 'new-set-id',
              weight: req.body?.weight,
              reps: req.body?.reps,
            },
          },
        });
      });

      const workoutId = 'test-workout-id';
      const exerciseId = 'test-exercise-id';
      const setData = {
        weight: 100,
        reps: 10,
        notes: '感覺不錯',
      };

      const response = await request(app)
        .post(`/api/workouts/${workoutId}/exercises/${exerciseId}/sets`)
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(setData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.set.weight).toBe(setData.weight);
      expect(response.body.data.set.reps).toBe(setData.reps);
    });
  });

  describe('POST /api/workouts/:id/finish', () => {
    test('應該成功完成訓練', async () => {
      mockWorkoutController.finishWorkout.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '訓練完成',
          data: {
            workout: {
              id: req.params?.id,
              status: 'completed',
              finishedAt: new Date().toISOString(),
              duration: 3600, // 60 分鐘
            },
          },
        });
      });

      const workoutId = 'test-workout-id';

      const response = await request(app)
        .post(`/api/workouts/${workoutId}/finish`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('訓練完成');
      expect(response.body.data.workout.status).toBe('completed');
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

      const response = await request(app).get('/api/workouts');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

// 動態導入模擬的控制器
jest.doMock('../../src/controllers/workoutController', () => mockWorkoutController);