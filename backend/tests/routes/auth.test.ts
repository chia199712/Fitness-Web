import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth';
import { authenticateToken } from '../../src/middleware/auth';
import { MockRequest, MockResponse, MockNextFunction } from '../types/express';

// 模擬中間件
jest.mock('../../src/middleware/auth');
jest.mock('../../src/controllers/authController');

// 創建測試應用
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// 模擬認證控制器
const mockAuthController = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getMe: jest.fn(),
  refreshToken: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
};

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 設定模擬控制器回應
    mockAuthController.register.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(201).json({
        success: true,
        message: '註冊成功',
        data: {
          user: {
            id: 'test-user-id',
            email: req.body?.email,
            name: req.body?.name,
          },
        },
      });
    });

    mockAuthController.login.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        message: '登入成功',
        data: {
          user: {
            id: 'test-user-id',
            email: req.body?.email,
            name: 'Test User',
          },
          token: 'fake-jwt-token',
        },
      });
    });

    mockAuthController.logout.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        message: '登出成功',
      });
    });

    mockAuthController.getMe.mockImplementation((req: MockRequest, res: MockResponse) => {
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      });
    });

    // 模擬認證中間件
    (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    });
  });

  describe('POST /api/auth/register', () => {
    test('應該成功註冊新用戶', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('註冊成功');
      expect(response.body.data.user.email).toBe(userData.email);
    });

    test('應該拒絕無效的註冊資料', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData);

      // 驗證中間件會拒絕無效資料
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('應該成功登入用戶', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('登入成功');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    test('應該拒絕無效的登入資料', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('應該成功登出已認證用戶', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('登出成功');
    });
  });

  describe('GET /api/auth/me', () => {
    test('應該返回當前用戶信息', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer fake-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.id).toBe('test-user-id');
    });

    test('應該拒絕未認證的請求', async () => {
      // 設定認證中間件返回錯誤
      (authenticateToken as jest.Mock).mockImplementation((req: MockRequest, res: MockResponse, next: MockNextFunction) => {
        res.status(401).json({
          success: false,
          message: '未授權的訪問',
        });
      });

      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('應該成功刷新 token', async () => {
      mockAuthController.refreshToken.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          data: {
            token: 'new-fake-jwt-token',
          },
        });
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'fake-refresh-token' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('PUT /api/auth/profile', () => {
    test('應該成功更新用戶資訊', async () => {
      mockAuthController.updateProfile.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '資訊更新成功',
          data: {
            user: {
              id: 'test-user-id',
              name: req.body?.name,
              email: req.body?.email,
            },
          },
        });
      });

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
    });
  });

  describe('PUT /api/auth/password', () => {
    test('應該成功更改密碼', async () => {
      mockAuthController.changePassword.mockImplementation((req: MockRequest, res: MockResponse) => {
        res.status(200).json({
          success: true,
          message: '密碼更改成功',
        });
      });

      const passwordData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(passwordData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('密碼更改成功');
    });
  });
});

// 動態導入模擬的控制器
jest.doMock('../../src/controllers/authController', () => mockAuthController);