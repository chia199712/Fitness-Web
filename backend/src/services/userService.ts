import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import googleSheetsService from './googleSheets';
import { User, LoginRequest } from '../types';

class UserService {
  private readonly USERS_SHEET = 'Users!A:F'; // A: user_id, B: email, C: name, D: password_hash, E: created_at, F: preferences
  private readonly SALT_ROUNDS = 12;


  /**
   * 驗證用戶登入
   */
  async login(loginData: LoginRequest): Promise<User> {
    const user = await this.findUserByEmail(loginData.email);
    if (!user) {
      throw new Error('電子信箱或密碼錯誤');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('電子信箱或密碼錯誤');
    }

    return user;
  }

  /**
   * 通過電子信箱查找用戶
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Failed to find user by email:', error);
      return null;
    }
  }

  /**
   * 通過 ID 查找用戶
   */
  async findUserById(userId: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.user_id === userId) || null;
    } catch (error) {
      console.error('Failed to find user by ID:', error);
      return null;
    }
  }

  /**
   * 更新用戶資訊
   */
  async updateUser(userId: string, updates: Partial<Pick<User, 'name' | 'preferences'>>): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('用戶不存在');
    }

    // 更新用戶資料
    const updatedUser = { ...user, ...updates };

    try {
      // 獲取所有用戶
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.user_id === userId);
      
      if (userIndex === -1) {
        throw new Error('用戶不存在');
      }

      // 更新用戶資料
      users[userIndex] = updatedUser;

      // 準備寫入 Google Sheets 的資料
      const sheetsData = users.map(u => [
        u.user_id,
        u.email,
        u.name,
        u.password_hash,
        u.created_at,
        u.preferences
      ]);

      // 清空並重寫整個表格（包含標題行）
      await googleSheetsService.clearData(this.USERS_SHEET);
      await googleSheetsService.appendData(this.USERS_SHEET, [
        ['user_id', 'email', 'name', 'password_hash', 'created_at', 'preferences'],
        ...sheetsData
      ]);

      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('更新用戶資訊失敗');
    }
  }

  /**
   * 更改用戶密碼
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('用戶不存在');
    }

    // 驗證當前密碼
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('當前密碼不正確');
    }

    // 加密新密碼
    const newPasswordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // 更新用戶密碼
    await this.updateUserPassword(userId, newPasswordHash);
  }

  /**
   * 更新用戶密碼（內部方法）
   */
  private async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.user_id === userId);
      
      if (userIndex === -1) {
        throw new Error('用戶不存在');
      }

      // 更新密碼
      users[userIndex].password_hash = passwordHash;

      // 準備寫入 Google Sheets 的資料
      const sheetsData = users.map(u => [
        u.user_id,
        u.email,
        u.name,
        u.password_hash,
        u.created_at,
        u.preferences
      ]);

      // 清空並重寫整個表格
      await googleSheetsService.clearData(this.USERS_SHEET);
      await googleSheetsService.appendData(this.USERS_SHEET, [
        ['user_id', 'email', 'name', 'password_hash', 'created_at', 'preferences'],
        ...sheetsData
      ]);
    } catch (error) {
      console.error('Failed to update password:', error);
      throw new Error('更新密碼失敗');
    }
  }

  /**
   * 獲取所有用戶（內部方法）
   */
  private async getAllUsers(): Promise<User[]> {
    try {
      const data = await googleSheetsService.readData(this.USERS_SHEET);
      
      // 跳過標題行
      const userRows = data.slice(1);
      
      return userRows.map((row: string[]) => ({
        user_id: row[0] || '',
        email: row[1] || '',
        name: row[2] || '',
        password_hash: row[3] || '',
        created_at: row[4] || '',
        preferences: row[5] || '{}'
      }));
    } catch (error) {
      console.error('Failed to get all users:', error);
      return [];
    }
  }

  /**
   * 初始化用戶表格（如果不存在標題行）
   */
  async initializeUserSheet(): Promise<void> {
    try {
      const data = await googleSheetsService.readData(this.USERS_SHEET);
      
      // 如果沒有資料或標題行不正確，初始化表格
      if (data.length === 0 || !this.isValidUserHeader(data[0])) {
        await googleSheetsService.clearData(this.USERS_SHEET);
        await googleSheetsService.appendData(this.USERS_SHEET, [[
          'user_id', 'email', 'name', 'password_hash', 'created_at', 'preferences'
        ]]);
        console.log('用戶表格已初始化');
      }
    } catch (error) {
      console.error('Failed to initialize user sheet:', error);
    }
  }

  /**
   * 驗證標題行是否正確
   */
  private isValidUserHeader(header: string[]): boolean {
    const expectedHeaders = ['user_id', 'email', 'name', 'password_hash', 'created_at', 'preferences'];
    return header.length >= expectedHeaders.length && 
           expectedHeaders.every((expected, index) => header[index] === expected);
  }
}

export default new UserService();