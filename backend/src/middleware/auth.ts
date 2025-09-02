import { Request, Response, NextFunction } from 'express';
import jwtUtils from '../utils/jwt';
import { JWTPayload } from '../types';

// 擴展 Request 類型以包含用戶信息
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * JWT 認證中間件
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: '缺少認證 Token'
    });
    return;
  }

  const decoded = jwtUtils.verifyToken(token);
  
  if (!decoded) {
    res.status(403).json({
      success: false,
      message: '無效的 Token 或 Token 已過期'
    });
    return;
  }

  req.user = decoded;
  next();
};

/**
 * 可選認證中間件（不強制要求認證）
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    const decoded = jwtUtils.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

/**
 * 檢查用戶權限中間件
 */
export const requireOwnership = (req: Request, res: Response, next: NextFunction): void => {
  const { user } = req;
  const resourceUserId = req.params.userId || req.body.userId;

  if (!user) {
    res.status(401).json({
      success: false,
      message: '需要認證'
    });
    return;
  }

  if (resourceUserId && user.userId !== resourceUserId) {
    res.status(403).json({
      success: false,
      message: '權限不足：只能操作自己的資源'
    });
    return;
  }

  next();
};