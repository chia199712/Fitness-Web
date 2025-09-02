import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

class JWTUtils {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    if (process.env.NODE_ENV !== 'development' && this.jwtSecret === 'your-fallback-secret-key') {
      console.warn('警告：請在生產環境中設定 JWT_SECRET 環境變數');
    }
  }

  /**
   * 生成 JWT Token
   */
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    try {
      return jwt.sign(payload as any, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn
      } as any);
    } catch (error) {
      console.error('JWT generation error:', error);
      throw new Error('Token 生成失敗');
    }
  }

  /**
   * 驗證 JWT Token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * 解析 JWT Token（不驗證）
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }

  /**
   * 檢查 Token 是否即將過期（30分鐘內）
   */
  isTokenExpiringSoon(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const thirtyMinutes = 30 * 60;
    
    return (decoded.exp - now) <= thirtyMinutes;
  }

  /**
   * 刷新 Token
   */
  refreshToken(token: string): string | null {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    // 移除過期時間和簽發時間，重新生成
    const { iat, exp, ...payload } = decoded;
    return this.generateToken(payload);
  }
}

export default new JWTUtils();