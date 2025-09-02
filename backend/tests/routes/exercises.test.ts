import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import exerciseRoutes from '../../src/routes/exercises';
import { authenticateToken } from '../../src/middleware/auth';
import { MockRequest, MockResponse, MockNextFunction } from '../types/express';

// 模擬中間件和控制器
jest.mock('../../src/middleware/auth');
jest.mock('../../src/controllers/exerciseController');

// 創建測試應用
const app = express();
app.use(express.json());
app.use('/api/exercises', exerciseRoutes);

// 模擬動作控制器
const mockExerciseController = {
  getExercises: jest.fn(),
  getExerciseById: jest.fn(),
  createExercise: jest.fn(),
  updateExercise: jest.fn(),
  deleteExercise: jest.fn(),
  searchExercises: jest.fn(),
  getExercisesByCategory: jest.fn(),
};

describe('Exercise Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 模擬認證中間件
    (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    });

    // 設定模擬控制器回應
    mockExerciseController.getExercises.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          exercises: [
            {
              id: 'exercise-1',
              name: '臥推',
              category: '胸部',
              description: '胸部主要訓練動作',
              muscleGroups: ['胸大肌', '三角肌前束', '三頭肌'],
            },
            {
              id: 'exercise-2',
              name: '深蹲',
              category: '腿部',
              description: '腿部複合訓練動作',
              muscleGroups: ['股四頭肌', '臀大肌', '小腿肌'],
            },
          ],
        },
      });
    });

    mockExerciseController.getExerciseById.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          exercise: {
            id: req.params?.id,
            name: '臥推',
            category: '胸部',
            description: '胸部主要訓練動作',
            muscleGroups: ['胸大肌', '三角肌前束', '三頭肌'],
            instructions: [
              '躺在臥推椅上',
              '雙手握槓，手距與肩同寬',
              '緩慢下降槓鈴至胸部',
              '用力推起槓鈴至手臂完全伸直',
            ],
          },
        },
      });
    });

    mockExerciseController.createExercise.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(201).json({
        success: true,
        message: '動作創建成功',
        data: {
          exercise: {
            id: 'new-exercise-id',
            name: req.body?.name,
            category: req.body?.category,
            description: req.body?.description,
            muscleGroups: req.body?.muscleGroups,
          },
        },
      });
    });

    mockExerciseController.searchExercises.mockImplementation((req: MockRequest, res: MockResponse) => {
      const query = req.query?.q as string;
      res.status(200).json({
        success: true,
        data: {
          exercises: [
            {
              id: 'exercise-1',
              name: '臥推',
              category: '胸部',
              description: '胸部主要訓練動作',
            },
          ],
          query,
        },
      });
    });
  });

  describe('GET /api/exercises', () => {
    test('應該返回所有動作列表', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.exercises).toBeInstanceOf(Array);
      expect(response.body.data.exercises).toHaveLength(2);
      expect(mockExerciseController.getExercises).toHaveBeenCalledTimes(1);
    });

    test('應該支援分頁查詢', async () => {
      const response = await request(app)
        .get('/api/exercises?page=1&limit=10')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/exercises/search', () => {
    test('應該根據關鍵字搜索動作', async () => {
      const searchQuery = '臥推';

      const response = await request(app)
        .get(`/api/exercises/search?q=${encodeURIComponent(searchQuery)}`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.exercises).toBeInstanceOf(Array);
      expect(response.body.data.query).toBe(searchQuery);
    });

    test('應該拒絕空的搜索查詢', async () => {
      const response = await request(app)
        .get('/api/exercises/search')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/exercises/:id', () => {
    test('應該返回特定動作的詳細信息', async () => {
      const exerciseId = 'test-exercise-id';

      const response = await request(app)
        .get(`/api/exercises/${exerciseId}`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.exercise.id).toBe(exerciseId);
      expect(response.body.data.exercise.instructions).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/exercises', () => {
    test('應該成功創建新動作', async () => {
      const exerciseData = {
        name: '硬舉',
        category: '背部',
        description: '背部和腿部的複合訓練動作',
        muscleGroups: ['豎脊肌', '臀大肌', '股二頭肌'],
        instructions: [
          '雙腳與肩同寬站立',
          '彎腰握住槓鈴',
          '保持背部挺直，用力拉起槓鈴',
          '緩慢放下槓鈴至地面',
        ],
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(exerciseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('動作創建成功');
      expect(response.body.data.exercise.name).toBe(exerciseData.name);
    });

    test('應該拒絕無效的動作資料', async () => {
      const invalidData = {
        name: '', // 空名稱
        category: '',
        description: '',
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/exercises/:id', () => {
    test('應該成功更新動作', async () => {
      mockExerciseController.updateExercise.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '動作更新成功',
          data: {
            exercise: {
              id: req.params?.id,
              name: req.body?.name,
              category: req.body?.category,
              description: req.body?.description,
            },
          },
        });
      });

      const exerciseId = 'test-exercise-id';
      const updateData = {
        name: '更新的動作名稱',
        category: '更新的類別',
        description: '更新的描述',
      };

      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.exercise.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/exercises/:id', () => {
    test('應該成功刪除動作', async () => {
      mockExerciseController.deleteExercise.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '動作刪除成功',
        });
      });

      const exerciseId = 'test-exercise-id';

      const response = await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('動作刪除成功');
    });
  });

  describe('GET /api/exercises/category/:category', () => {
    test('應該根據類別獲取動作', async () => {
      mockExerciseController.getExercisesByCategory.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          data: {
            exercises: [
              {
                id: 'exercise-1',
                name: '臥推',
                category: req.params?.category,
                description: '胸部主要訓練動作',
              },
              {
                id: 'exercise-2',
                name: '飛鳥',
                category: req.params?.category,
                description: '胸部孤立訓練動作',
              },
            ],
            category: req.params?.category,
          },
        });
      });

      const category = '胸部';

      const response = await request(app)
        .get(`/api/exercises/category/${encodeURIComponent(category)}`)
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.exercises).toBeInstanceOf(Array);
      expect(response.body.data.category).toBe(category);
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

      const response = await request(app).get('/api/exercises');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

// 動態導入模擬的控制器
jest.doMock('../../src/controllers/exerciseController', () => mockExerciseController);