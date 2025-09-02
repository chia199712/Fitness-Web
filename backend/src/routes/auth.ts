import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { 
  validateLogin, 
  validateUpdateProfile, 
  validateChangePassword 
} from '../middleware/validation';

const router = Router();


/**
 * @route POST /api/auth/login
 * @desc 用戶登入
 * @access Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route POST /api/auth/logout
 * @desc 用戶登出
 * @access Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route GET /api/auth/me
 * @desc 獲取當前用戶信息
 * @access Private
 */
router.get('/me', authenticateToken, authController.getMe);

/**
 * @route POST /api/auth/refresh
 * @desc 刷新 JWT Token
 * @access Private
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route PUT /api/auth/profile
 * @desc 更新用戶資訊
 * @access Private
 */
router.put('/profile', authenticateToken, validateUpdateProfile, authController.updateProfile);

/**
 * @route PUT /api/auth/password
 * @desc 更改密碼
 * @access Private
 */
router.put('/password', authenticateToken, validateChangePassword, authController.changePassword);

export default router;