import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import templateRoutes from '../../src/routes/templates';
import { authenticateToken } from '../../src/middleware/auth';
import { MockRequest, MockResponse, MockNextFunction } from '../types/express';

// 模擬中間件和控制器
jest.mock('../../src/middleware/auth');
jest.mock('../../src/controllers/templateController');

// 創建測試應用
const app = express();
app.use(express.json());
app.use('/api/templates', templateRoutes);

// 模擬範本控制器
const mockTemplateController = {
  getTemplates: jest.fn(),
  getTemplateById: jest.fn(),
  createTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  deleteTemplate: jest.fn(),
  addExerciseToTemplate: jest.fn(),
  updateTemplateExercise: jest.fn(),
  removeExerciseFromTemplate: jest.fn(),
  applyTemplate: jest.fn(),
  duplicateTemplate: jest.fn(),
  toggleTemplateFavorite: jest.fn(),
  getPopularTemplates: jest.fn(),
  getTemplateStats: jest.fn(),
  getMyTemplates: jest.fn(),
  getFavoriteTemplates: jest.fn(),
  getPublicTemplates: jest.fn(),
  bulkTemplateOperation: jest.fn(),
  getTemplateExerciseSuggestions: jest.fn(),
};

describe('Template Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 模擬認證中間件
    (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    });

    // 設定模擬控制器回應
    mockTemplateController.getTemplates.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          templates: [
            {
              id: 'template-1',
              name: '胸部訓練範本',
              type: 'strength',
              difficulty: 'intermediate',
              visibility: 'public',
              description: '專注於胸部肌肉發展的訓練範本',
              exercises: [],
              created_at: '2024-01-15T08:00:00Z',
              updated_at: '2024-01-15T08:00:00Z',
            },
            {
              id: 'template-2',
              name: '腿部訓練範本',
              type: 'strength',
              difficulty: 'advanced',
              visibility: 'private',
              description: '全方位腿部肌肉訓練',
              exercises: [],
              created_at: '2024-01-14T08:00:00Z',
              updated_at: '2024-01-14T08:00:00Z',
            },
          ],
          total: 2,
          page: 1,
          limit: 10,
        },
      });
    });

    mockTemplateController.getTemplateById.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          template: {
            id: req.params?.id,
            name: '胸部訓練範本',
            type: 'strength',
            difficulty: 'intermediate',
            visibility: 'public',
            description: '專注於胸部肌肉發展的訓練範本',
            exercises: [
              {
                id: 'template-exercise-1',
                name: '臥推',
                sets: 4,
                reps: '8-10',
                rest_seconds: 120,
                order_index: 1,
              },
              {
                id: 'template-exercise-2',
                name: '飛鳥',
                sets: 3,
                reps: '10-12',
                rest_seconds: 90,
                order_index: 2,
              },
            ],
            created_at: '2024-01-15T08:00:00Z',
            updated_at: '2024-01-15T08:00:00Z',
          },
        },
      });
    });

    mockTemplateController.createTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(201).json({
        success: true,
        message: '範本創建成功',
        data: {
          template: {
            id: 'new-template-id',
            name: req.body?.name,
            type: req.body?.type,
            difficulty: req.body?.difficulty,
            visibility: req.body?.visibility,
            description: req.body?.description,
            exercises: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      });
    });

    mockTemplateController.getPopularTemplates.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          templates: [
            {
              id: 'popular-template-1',
              name: '全身訓練',
              type: 'full_body',
              difficulty: 'beginner',
              use_count: 1250,
              rating: 4.8,
              description: '適合初學者的全身訓練範本',
            },
            {
              id: 'popular-template-2',
              name: '高強度間歇訓練',
              type: 'hiit',
              difficulty: 'advanced',
              use_count: 980,
              rating: 4.7,
              description: '燃脂效果極佳的HIIT訓練',
            },
          ],
        },
      });
    });

    mockTemplateController.getTemplateStats.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          stats: {
            totalTemplates: 15,
            myTemplates: 8,
            favoriteTemplates: 5,
            publicTemplates: 3,
            privateTemplates: 5,
            mostUsedTemplate: {
              id: 'template-1',
              name: '胸部訓練範本',
              useCount: 25,
            },
          },
        },
      });
    });
  });

  describe('Public Routes (no auth required)', () => {
    describe('GET /api/templates/public', () => {
      test('應該返回公開範本列表', async () => {
        const response = await request(app).get('/api/templates/public');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.templates).toBeInstanceOf(Array);
        expect(mockTemplateController.getTemplates).toHaveBeenCalledTimes(1);
      });

      test('應該支援搜索和篩選參數', async () => {
        const response = await request(app)
          .get('/api/templates/public?search=胸部&type=strength&difficulty=intermediate');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    describe('GET /api/templates/popular', () => {
      test('應該返回熱門範本', async () => {
        const response = await request(app).get('/api/templates/popular?limit=5');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.templates).toBeInstanceOf(Array);
        expect(response.body.data.templates).toHaveLength(2);
        expect(mockTemplateController.getPopularTemplates).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Authenticated Routes', () => {
    describe('GET /api/templates', () => {
      test('應該返回所有範本列表', async () => {
        const response = await request(app)
          .get('/api/templates')
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.templates).toBeInstanceOf(Array);
        expect(response.body.data.templates).toHaveLength(2);
        expect(response.body.data.total).toBe(2);
      });

      test('應該支援分頁和排序', async () => {
        const response = await request(app)
          .get('/api/templates?page=1&limit=5&sort_by=created_at&sort_order=desc')
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    describe('GET /api/templates/my', () => {
      test('應該返回用戶的範本', async () => {
        const response = await request(app)
          .get('/api/templates/my')
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(mockTemplateController.getTemplates).toHaveBeenCalledTimes(1);
      });
    });

    describe('GET /api/templates/favorites', () => {
      test('應該返回收藏的範本', async () => {
        const response = await request(app)
          .get('/api/templates/favorites')
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(mockTemplateController.getTemplates).toHaveBeenCalledTimes(1);
      });
    });

    describe('GET /api/templates/stats', () => {
      test('應該返回範本統計資料', async () => {
        const response = await request(app)
          .get('/api/templates/stats')
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.stats).toBeDefined();
        expect(response.body.data.stats.totalTemplates).toBe(15);
        expect(response.body.data.stats.mostUsedTemplate).toBeDefined();
      });
    });

    describe('GET /api/templates/:id', () => {
      test('應該返回特定範本的詳細資訊', async () => {
        const templateId = 'test-template-id';

        const response = await request(app)
          .get(`/api/templates/${templateId}`)
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.template.id).toBe(templateId);
        expect(response.body.data.template.exercises).toBeInstanceOf(Array);
        expect(response.body.data.template.exercises).toHaveLength(2);
      });
    });

    describe('POST /api/templates', () => {
      test('應該成功創建新範本', async () => {
        const templateData = {
          name: '背部訓練範本',
          type: 'strength',
          difficulty: 'intermediate',
          visibility: 'private',
          description: '專注於背部肌肉發展',
          exercises: [
            {
              exercise_id: 'exercise-1',
              name: '引體向上',
              sets: 4,
              reps: '8-10',
              rest_seconds: 120,
            },
          ],
        };

        const response = await request(app)
          .post('/api/templates')
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(templateData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('範本創建成功');
        expect(response.body.data.template.name).toBe(templateData.name);
      });

      test('應該拒絕無效的範本資料', async () => {
        const invalidData = {
          name: '', // 空名稱
          type: 'invalid-type',
          difficulty: '',
        };

        const response = await request(app)
          .post('/api/templates')
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(invalidData);

        expect(response.status).toBe(400);
      });
    });

    describe('PUT /api/templates/:id', () => {
      test('應該成功更新範本', async () => {
        mockTemplateController.updateTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(200).json({
            success: true,
            message: '範本更新成功',
            data: {
              template: {
                id: req.params?.id,
                name: req.body?.name,
                description: req.body?.description,
                updated_at: new Date().toISOString(),
              },
            },
          });
        });

        const templateId = 'test-template-id';
        const updateData = {
          name: '更新的範本名稱',
          description: '更新的描述',
          difficulty: 'advanced',
        };

        const response = await request(app)
          .put(`/api/templates/${templateId}`)
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('範本更新成功');
        expect(response.body.data.template.name).toBe(updateData.name);
      });
    });

    describe('DELETE /api/templates/:id', () => {
      test('應該成功刪除範本', async () => {
        mockTemplateController.deleteTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(200).json({
            success: true,
            message: '範本刪除成功',
          });
        });

        const templateId = 'test-template-id';

        const response = await request(app)
          .delete(`/api/templates/${templateId}`)
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('範本刪除成功');
      });
    });

    describe('Template Exercise Management', () => {
      test('POST /api/templates/:id/exercises - 應該成功添加動作到範本', async () => {
        mockTemplateController.addExerciseToTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(201).json({
            success: true,
            message: '動作添加成功',
            data: {
              templateExercise: {
                id: 'new-template-exercise-id',
                exercise_id: req.body?.exercise_id,
                name: req.body?.name,
                sets: req.body?.sets,
                reps: req.body?.reps,
                rest_seconds: req.body?.rest_seconds,
              },
            },
          });
        });

        const templateId = 'test-template-id';
        const exerciseData = {
          exercise_id: 'exercise-1',
          name: '深蹲',
          sets: 4,
          reps: '8-10',
          rest_seconds: 120,
        };

        const response = await request(app)
          .post(`/api/templates/${templateId}/exercises`)
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(exerciseData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('動作添加成功');
        expect(response.body.data.templateExercise.name).toBe(exerciseData.name);
      });

      test('PUT /api/templates/:id/exercises/:exerciseId - 應該成功更新範本動作', async () => {
        mockTemplateController.updateTemplateExercise.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(200).json({
            success: true,
            message: '範本動作更新成功',
            data: {
              templateExercise: {
                id: req.params?.exerciseId,
                sets: req.body?.sets,
                reps: req.body?.reps,
                rest_seconds: req.body?.rest_seconds,
              },
            },
          });
        });

        const templateId = 'test-template-id';
        const exerciseId = 'test-exercise-id';
        const updateData = {
          sets: 5,
          reps: '6-8',
          rest_seconds: 150,
        };

        const response = await request(app)
          .put(`/api/templates/${templateId}/exercises/${exerciseId}`)
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('範本動作更新成功');
        expect(response.body.data.templateExercise.sets).toBe(updateData.sets);
      });

      test('DELETE /api/templates/:id/exercises/:exerciseId - 應該成功移除範本動作', async () => {
        mockTemplateController.removeExerciseFromTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(200).json({
            success: true,
            message: '動作移除成功',
          });
        });

        const templateId = 'test-template-id';
        const exerciseId = 'test-exercise-id';

        const response = await request(app)
          .delete(`/api/templates/${templateId}/exercises/${exerciseId}`)
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('動作移除成功');
      });
    });

    describe('Template Operations', () => {
      test('POST /api/templates/:id/apply - 應該成功套用範本', async () => {
        mockTemplateController.applyTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(201).json({
            success: true,
            message: '範本套用成功，訓練已開始',
            data: {
              workout_id: 'new-workout-id',
            },
          });
        });

        const templateId = 'test-template-id';
        const applyData = {
          workout_name: '今日胸部訓練',
          scheduled_date: '2024-01-16',
        };

        const response = await request(app)
          .post(`/api/templates/${templateId}/apply`)
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(applyData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('範本套用成功，訓練已開始');
        expect(response.body.data.workout_id).toBeDefined();
      });

      test('POST /api/templates/:id/duplicate - 應該成功複製範本', async () => {
        mockTemplateController.duplicateTemplate.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(201).json({
            success: true,
            message: '範本複製成功',
            data: {
              template: {
                id: 'duplicated-template-id',
                name: req.body?.name || '範本副本',
                original_template_id: req.params?.id,
              },
            },
          });
        });

        const templateId = 'test-template-id';
        const duplicateData = {
          name: '胸部訓練範本 - 副本',
          visibility: 'private',
        };

        const response = await request(app)
          .post(`/api/templates/${templateId}/duplicate`)
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(duplicateData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('範本複製成功');
        expect(response.body.data.template.name).toBe(duplicateData.name);
      });

      test('POST /api/templates/:id/favorite - 應該成功切換收藏狀態', async () => {
        mockTemplateController.toggleTemplateFavorite.mockImplementation((req: MockRequest, res: MockResponse) => {
          const isFavorite = req.body?.is_favorite;
          res.status(200).json({
            success: true,
            message: isFavorite ? '已添加到收藏' : '已移除收藏',
          });
        });

        const templateId = 'test-template-id';
        const favoriteData = { is_favorite: true };

        const response = await request(app)
          .post(`/api/templates/${templateId}/favorite`)
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(favoriteData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('已添加到收藏');
      });
    });

    describe('GET /api/templates/:id/suggestions', () => {
      test('應該返回範本動作建議', async () => {
        mockTemplateController.getTemplateExerciseSuggestions.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(200).json({
            success: true,
            message: '動作建議取得成功',
            data: {
              recommended_exercises: [
                { id: 'exercise-1', name: '上斜臥推', muscle_groups: ['胸大肌上部'] },
                { id: 'exercise-2', name: '雙槓撐體', muscle_groups: ['胸大肌下部'] },
              ],
              complementary_exercises: [
                { id: 'exercise-3', name: '三頭肌下拉', muscle_groups: ['三頭肌'] },
              ],
              similar_templates: [
                { id: 'template-2', name: '進階胸部訓練', rating: 4.5 },
              ],
            },
          });
        });

        const templateId = 'test-template-id';

        const response = await request(app)
          .get(`/api/templates/${templateId}/suggestions`)
          .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('動作建議取得成功');
        expect(response.body.data.recommended_exercises).toBeInstanceOf(Array);
        expect(response.body.data.complementary_exercises).toBeInstanceOf(Array);
        expect(response.body.data.similar_templates).toBeInstanceOf(Array);
      });
    });

    describe('POST /api/templates/bulk', () => {
      test('應該成功執行批量操作', async () => {
        mockTemplateController.bulkTemplateOperation.mockImplementation((req: MockRequest, res: MockResponse) => {
          res.status(200).json({
            success: true,
            message: '成功處理 2 個範本',
            data: {
              success_count: 2,
              errors: [],
            },
          });
        });

        const bulkData = {
          template_ids: ['template-1', 'template-2'],
          operation: 'favorite',
        };

        const response = await request(app)
          .post('/api/templates/bulk')
          .set('Authorization', 'Bearer fake-jwt-token')
          .send(bulkData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.success_count).toBe(2);
        expect(response.body.data.errors).toEqual([]);
      });
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

      const response = await request(app).get('/api/templates');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('應該處理服務器錯誤', async () => {
      mockTemplateController.getTemplates.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(500).json({
          success: false,
          error: '服務器內部錯誤',
        });
      });

      const response = await request(app)
        .get('/api/templates')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});

// 動態導入模擬的控制器
jest.doMock('../../src/controllers/templateController', () => mockTemplateController);