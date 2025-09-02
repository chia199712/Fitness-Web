import { Request, Response } from 'express';
import userService from '../services/userService';
import mockDataService from '../services/mockDataService';
import jwtUtils from '../utils/jwt';
import { LoginRequest, AuthResponse, User } from '../types';
import { transformUserForResponse, createApiResponse, createErrorResponse } from '../utils/transformers';

class AuthController {

  /**
   * 用戶登入
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      // 使用模擬資料進行開發測試
      if (mockDataService.getUseMockData()) {
        const mockUser = mockDataService.getMockUserByEmail(loginData.email);
        
        if (!mockUser) {
          res.status(401).json(createErrorResponse('用戶不存在'));
          return;
        }

        // 生成 JWT Token
        const token = jwtUtils.generateToken({
          userId: mockUser.id,
          email: mockUser.email
        });

        const response = createApiResponse({
          token,
          user: {
            id: mockUser.id,
            email: mockUser.email,
            username: mockUser.username,
            name: mockUser.name,
            created_at: mockUser.created_at,
            updated_at: mockUser.updated_at
          }
        }, '登入成功');

        res.status(200).json(response);
        return;
      }

      // 驗證用戶
      const user = await userService.login(loginData);
      
      // 生成 JWT Token
      const token = jwtUtils.generateToken({
        userId: user.user_id,
        email: user.email
      });

      // 移除密碼字段後返回用戶信息
      const { password_hash, ...userWithoutPassword } = user;
      const transformedUser = transformUserForResponse(userWithoutPassword);

      const response = createApiResponse({
        token,
        user: transformedUser
      }, '登入成功');

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      
      const response = createErrorResponse(
        error instanceof Error ? error.message : '登入失敗'
      );

      res.status(401).json(response);
    }
  }

  /**
   * 獲取當前用戶信息
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json(createErrorResponse('未認證的請求'));
        return;
      }

      const user = await userService.findUserById(userId);
      
      if (!user) {
        res.status(404).json(createErrorResponse('用戶不存在'));
        return;
      }

      // 移除密碼字段
      const { password_hash, ...userWithoutPassword } = user;
      const transformedUser = transformUserForResponse(userWithoutPassword);

      const response = createApiResponse(transformedUser, '獲取用戶信息成功');

      res.status(200).json(response);
    } catch (error) {
      console.error('Get user info error:', error);
      
      res.status(500).json(createErrorResponse('獲取用戶信息失敗'));
    }
  }

  /**
   * 用戶登出 (客戶端處理，服務器端可選實作 Token 黑名單)
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // 在簡單實作中，登出主要由客戶端處理（刪除本地存儲的 Token）
      // 如果需要更安全的登出，可以在此實作 Token 黑名單功能
      
      res.status(200).json({
        success: true,
        message: '登出成功'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        success: false,
        message: '登出失敗'
      });
    }
  }

  /**
   * 刷新 Token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: '缺少認證 Token'
        });
        return;
      }

      const newToken = jwtUtils.refreshToken(token);
      
      if (!newToken) {
        res.status(403).json({
          success: false,
          message: '無法刷新 Token，請重新登入'
        });
        return;
      }

      const response: AuthResponse = {
        success: true,
        token: newToken,
        message: 'Token 刷新成功'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Refresh token error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Token 刷新失敗'
      });
    }
  }

  /**
   * 更新用戶資訊
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未認證的請求'
        });
        return;
      }

      const updatedUser = await userService.updateUser(userId, updates);
      
      // 移除密碼字段
      const { password_hash, ...userWithoutPassword } = updatedUser;

      const response: AuthResponse = {
        success: true,
        user: userWithoutPassword,
        message: '用戶資訊更新成功'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update profile error:', error);
      
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : '更新用戶資訊失敗'
      });
    }
  }

  /**
   * 更改密碼
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未認證的請求'
        });
        return;
      }

      await userService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: '密碼更改成功'
      });
    } catch (error) {
      console.error('Change password error:', error);
      
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : '密碼更改失敗'
      });
    }
  }
}

export default new AuthController();