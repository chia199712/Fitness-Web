import googleSheetsService from './googleSheets';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  UserSettings,
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  AccountInfo,
  SecuritySettings,
  UpdatePreferencesRequest,
  UpdateNotificationSettingsRequest,
  UpdatePrivacySettingsRequest,
  UpdateAccountInfoRequest,
  ChangePasswordRequest,
  ExportDataRequest,
  ExportDataResponse,
  DeleteAccountRequest,
  ResetSettingsRequest,
  UsageStatistics,
  SettingsBackup,
  RestoreSettingsRequest,
  UnitSystem,
  ThemeMode,
  Language,
  PrivacySetting
} from '../types';

class SettingsService {
  private readonly SETTINGS_SHEET = 'UserSettings';
  private readonly BACKUPS_SHEET = 'SettingsBackups';
  private readonly USAGE_STATS_SHEET = 'UsageStats';
  private readonly SESSIONS_SHEET = 'UserSessions';

  // 獲取完整用戶設定
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const data = await googleSheetsService.readData(`${this.SETTINGS_SHEET}!A:Z`);
      const userRow = data.find((row: any[]) => row[0] === userId);
      
      if (!userRow) {
        return await this.createDefaultSettings(userId);
      }

      return this.parseSettingsFromRow(userRow);
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw new Error('獲取設定失敗');
    }
  }

  // 創建預設設定
  private async createDefaultSettings(userId: string): Promise<UserSettings> {
    const defaultSettings: UserSettings = {
      user_id: userId,
      preferences: {
        unit_system: UnitSystem.METRIC,
        default_rest_time: 90,
        theme: ThemeMode.AUTO,
        language: Language.ZH_TW,
        timezone: 'Asia/Taipei',
        workout_reminders: true,
        reminder_time: '08:00',
        reminder_days: [1, 3, 5], // Monday, Wednesday, Friday
        auto_start_rest_timer: true,
        show_tutorial_tips: true,
        compact_view: false
      },
      notifications: {
        workout_reminders: true,
        achievement_notifications: true,
        new_feature_notifications: true,
        email_notifications: false,
        push_notifications: true,
        email_frequency: 'weekly',
        quiet_hours_start: '22:00',
        quiet_hours_end: '07:00'
      },
      privacy: {
        profile_visibility: PrivacySetting.PUBLIC,
        workout_history_visibility: PrivacySetting.PRIVATE,
        achievements_visibility: PrivacySetting.PUBLIC,
        allow_friend_requests: true,
        show_online_status: true,
        data_analytics_consent: true,
        third_party_integrations: false
      },
      account: {
        name: '',
        email: '',
        fitness_level: 'beginner'
      },
      security: {
        two_factor_enabled: false,
        password_last_changed: new Date().toISOString(),
        active_sessions: [],
        login_history: []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings_version: 1
    };

    await this.saveSettings(defaultSettings);
    return defaultSettings;
  }

  // 更新偏好設定
  async updatePreferences(userId: string, updates: UpdatePreferencesRequest): Promise<UserPreferences> {
    try {
      const settings = await this.getUserSettings(userId);
      if (!settings) {
        throw new Error('用戶設定不存在');
      }

      // 驗證並更新偏好設定
      const updatedPreferences = {
        ...settings.preferences,
        ...updates
      };

      // 驗證特定欄位
      if (updates.default_rest_time !== undefined && updates.default_rest_time < 0) {
        throw new Error('休息時間不能為負數');
      }

      if (updates.reminder_days && updates.reminder_days.some(day => day < 0 || day > 6)) {
        throw new Error('提醒日期格式錯誤');
      }

      settings.preferences = updatedPreferences;
      settings.updated_at = new Date().toISOString();
      settings.settings_version += 1;

      await this.saveSettings(settings);
      return updatedPreferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('更新偏好設定失敗');
    }
  }

  // 更新通知設定
  async updateNotificationSettings(userId: string, updates: UpdateNotificationSettingsRequest): Promise<NotificationSettings> {
    try {
      const settings = await this.getUserSettings(userId);
      if (!settings) {
        throw new Error('用戶設定不存在');
      }

      const updatedNotifications = {
        ...settings.notifications,
        ...updates
      };

      settings.notifications = updatedNotifications;
      settings.updated_at = new Date().toISOString();
      settings.settings_version += 1;

      await this.saveSettings(settings);
      return updatedNotifications;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error('更新通知設定失敗');
    }
  }

  // 更新隱私設定
  async updatePrivacySettings(userId: string, updates: UpdatePrivacySettingsRequest): Promise<PrivacySettings> {
    try {
      const settings = await this.getUserSettings(userId);
      if (!settings) {
        throw new Error('用戶設定不存在');
      }

      const updatedPrivacy = {
        ...settings.privacy,
        ...updates
      };

      settings.privacy = updatedPrivacy;
      settings.updated_at = new Date().toISOString();
      settings.settings_version += 1;

      await this.saveSettings(settings);
      return updatedPrivacy;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw new Error('更新隱私設定失敗');
    }
  }

  // 更新帳戶資訊
  async updateAccountInfo(userId: string, updates: UpdateAccountInfoRequest): Promise<AccountInfo> {
    try {
      const settings = await this.getUserSettings(userId);
      if (!settings) {
        throw new Error('用戶設定不存在');
      }

      // 驗證數據
      if (updates.height !== undefined && (updates.height < 50 || updates.height > 300)) {
        throw new Error('身高數據不合理');
      }

      if (updates.weight !== undefined && (updates.weight < 20 || updates.weight > 500)) {
        throw new Error('體重數據不合理');
      }

      const updatedAccount = {
        ...settings.account,
        ...updates
      };

      settings.account = updatedAccount;
      settings.updated_at = new Date().toISOString();
      settings.settings_version += 1;

      await this.saveSettings(settings);
      return updatedAccount;
    } catch (error) {
      console.error('Error updating account info:', error);
      throw new Error('更新帳戶資訊失敗');
    }
  }

  // 變更密碼
  async changePassword(userId: string, request: ChangePasswordRequest): Promise<boolean> {
    try {
      // 驗證新密碼
      if (request.new_password !== request.confirm_password) {
        throw new Error('新密碼確認不一致');
      }

      if (request.new_password.length < 8) {
        throw new Error('密碼長度至少需要8個字符');
      }

      // 獲取用戶數據（需要從用戶表獲取當前密碼哈希）
      const userData = await this.getUserData(userId);
      if (!userData) {
        throw new Error('用戶不存在');
      }

      // 驗證當前密碼
      const isCurrentPasswordValid = await bcrypt.compare(request.current_password, userData.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('當前密碼錯誤');
      }

      // 生成新密碼哈希
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(request.new_password, saltRounds);

      // 更新密碼和安全設定
      await this.updateUserPassword(userId, newPasswordHash);
      
      const settings = await this.getUserSettings(userId);
      if (settings) {
        settings.security.password_last_changed = new Date().toISOString();
        settings.updated_at = new Date().toISOString();
        await this.saveSettings(settings);
      }

      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // 匯出用戶資料
  async exportUserData(userId: string, request: ExportDataRequest): Promise<ExportDataResponse> {
    try {
      const exportData: any = {};
      const exportId = crypto.randomUUID();

      // 收集要匯出的資料
      for (const dataType of request.data_types) {
        switch (dataType) {
          case 'settings':
            exportData.settings = await this.getUserSettings(userId);
            break;
          case 'workouts':
            exportData.workouts = await this.getUserWorkouts(userId, request.date_range);
            break;
          case 'exercises':
            exportData.exercises = await this.getUserExercises(userId);
            break;
          case 'templates':
            exportData.templates = await this.getUserTemplates(userId);
            break;
          case 'achievements':
            exportData.achievements = await this.getUserAchievements(userId);
            break;
        }
      }

      // 生成檔案
      const fileName = `user_data_${userId}_${Date.now()}.${request.format}`;
      const filePath = await this.generateExportFile(exportData, request.format, fileName);
      
      // 記錄匯出請求
      await this.logDataExport(userId, exportId, request);

      return {
        export_id: exportId,
        download_url: filePath,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小時後過期
        file_size: await this.getFileSize(filePath),
        format: request.format
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('資料匯出失敗');
    }
  }

  // 刪除帳戶
  async deleteAccount(userId: string, request: DeleteAccountRequest): Promise<boolean> {
    try {
      // 驗證確認字串
      if (request.confirmation !== 'DELETE_MY_ACCOUNT') {
        throw new Error('確認字串錯誤');
      }

      // 驗證密碼
      const userData = await this.getUserData(userId);
      if (!userData) {
        throw new Error('用戶不存在');
      }

      const isPasswordValid = await bcrypt.compare(request.password, userData.password_hash);
      if (!isPasswordValid) {
        throw new Error('密碼錯誤');
      }

      // 記錄刪除請求
      await this.logAccountDeletion(userId, request);

      // 執行軟刪除（標記為已刪除但保留數據一段時間）
      await this.softDeleteUserData(userId);

      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // 重置設定
  async resetSettings(userId: string, request: ResetSettingsRequest): Promise<UserSettings> {
    try {
      if (!request.confirmation) {
        throw new Error('需要確認重置操作');
      }

      const currentSettings = await this.getUserSettings(userId);
      if (!currentSettings) {
        throw new Error('用戶設定不存在');
      }

      // 創建備份
      await this.createSettingsBackup(userId, currentSettings, 'manual', '重置前備份');

      // 重置指定的設定類型
      const defaultSettings = await this.createDefaultSettings(userId);
      
      for (const settingType of request.setting_types) {
        switch (settingType) {
          case 'preferences':
            currentSettings.preferences = defaultSettings.preferences;
            break;
          case 'notifications':
            currentSettings.notifications = defaultSettings.notifications;
            break;
          case 'privacy':
            currentSettings.privacy = defaultSettings.privacy;
            break;
        }
      }

      currentSettings.updated_at = new Date().toISOString();
      currentSettings.settings_version += 1;

      await this.saveSettings(currentSettings);
      return currentSettings;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw new Error('重置設定失敗');
    }
  }

  // 獲取使用統計
  async getUsageStatistics(userId: string): Promise<UsageStatistics> {
    try {
      // 這裡應該從各個相關的表格收集統計數據
      const stats: UsageStatistics = {
        total_workouts: 0,
        total_workout_time: 0,
        total_exercises_performed: 0,
        most_used_exercises: [],
        workout_frequency: {
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0
        },
        monthly_activity: [],
        achievement_count: 0,
        data_storage_usage: 0,
        account_age_days: 0
      };

      // 實際實作時需要從不同的服務獲取這些統計數據
      return stats;
    } catch (error) {
      console.error('Error getting usage statistics:', error);
      throw new Error('獲取使用統計失敗');
    }
  }

  // 創建設定備份
  async createSettingsBackup(userId: string, settings?: UserSettings, type: 'manual' | 'automatic' = 'manual', description?: string): Promise<SettingsBackup> {
    try {
      const currentSettings = settings || await this.getUserSettings(userId);
      if (!currentSettings) {
        throw new Error('無法獲取當前設定');
      }

      const backup: SettingsBackup = {
        backup_id: crypto.randomUUID(),
        user_id: userId,
        settings_snapshot: currentSettings,
        backup_date: new Date().toISOString(),
        backup_type: type,
        description
      };

      await this.saveSettingsBackup(backup);
      return backup;
    } catch (error) {
      console.error('Error creating settings backup:', error);
      throw new Error('建立設定備份失敗');
    }
  }

  // 恢復設定
  async restoreSettings(userId: string, request: RestoreSettingsRequest): Promise<UserSettings> {
    try {
      const backup = await this.getSettingsBackup(request.backup_id);
      if (!backup || backup.user_id !== userId) {
        throw new Error('備份不存在或權限不足');
      }

      const currentSettings = await this.getUserSettings(userId);
      if (!currentSettings) {
        throw new Error('當前設定不存在');
      }

      // 創建當前設定的備份
      await this.createSettingsBackup(userId, currentSettings, 'automatic', '恢復前備份');

      // 恢復指定的設定類型
      if (request.setting_types) {
        for (const settingType of request.setting_types) {
          switch (settingType) {
            case 'preferences':
              currentSettings.preferences = backup.settings_snapshot.preferences;
              break;
            case 'notifications':
              currentSettings.notifications = backup.settings_snapshot.notifications;
              break;
            case 'privacy':
              currentSettings.privacy = backup.settings_snapshot.privacy;
              break;
          }
        }
      } else {
        // 恢復所有設定（除了帳戶和安全設定）
        currentSettings.preferences = backup.settings_snapshot.preferences;
        currentSettings.notifications = backup.settings_snapshot.notifications;
        currentSettings.privacy = backup.settings_snapshot.privacy;
      }

      currentSettings.updated_at = new Date().toISOString();
      currentSettings.settings_version += 1;

      await this.saveSettings(currentSettings);
      return currentSettings;
    } catch (error) {
      console.error('Error restoring settings:', error);
      throw new Error('恢復設定失敗');
    }
  }

  // 私有方法：保存設定到 Google Sheets
  private async saveSettings(settings: UserSettings): Promise<void> {
    try {
      const data = await googleSheetsService.readData(`${this.SETTINGS_SHEET}!A:Z`);
      const rowIndex = data.findIndex((row: any[]) => row[0] === settings.user_id);
      
      const settingsRow = this.convertSettingsToRow(settings);
      
      if (rowIndex >= 0) {
        // 更新現有行
        await googleSheetsService.writeData(
          `${this.SETTINGS_SHEET}!A${rowIndex + 1}:Z${rowIndex + 1}`,
          [settingsRow]
        );
      } else {
        // 新增行
        await googleSheetsService.appendData(
          `${this.SETTINGS_SHEET}!A:Z`,
          [settingsRow]
        );
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // 私有方法：將設定轉換為表格行
  private convertSettingsToRow(settings: UserSettings): any[] {
    return [
      settings.user_id,
      JSON.stringify(settings.preferences),
      JSON.stringify(settings.notifications),
      JSON.stringify(settings.privacy),
      JSON.stringify(settings.account),
      JSON.stringify(settings.security),
      settings.created_at,
      settings.updated_at,
      settings.settings_version
    ];
  }

  // 私有方法：從表格行解析設定
  private parseSettingsFromRow(row: any[]): UserSettings {
    return {
      user_id: row[0],
      preferences: JSON.parse(row[1] || '{}'),
      notifications: JSON.parse(row[2] || '{}'),
      privacy: JSON.parse(row[3] || '{}'),
      account: JSON.parse(row[4] || '{}'),
      security: JSON.parse(row[5] || '{}'),
      created_at: row[6],
      updated_at: row[7],
      settings_version: parseInt(row[8] || '1')
    };
  }

  // 私有方法：獲取用戶數據（從用戶表）
  private async getUserData(userId: string): Promise<any> {
    // 這裡應該從用戶服務獲取用戶數據
    // 暫時返回模擬數據
    return { password_hash: '' };
  }

  // 私有方法：更新用戶密碼
  private async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    // 這裡應該更新用戶表中的密碼
    // 實際實作時需要調用用戶服務
  }

  // 私有方法：獲取用戶訓練記錄
  private async getUserWorkouts(userId: string, dateRange?: any): Promise<any[]> {
    // 實際實作時從訓練服務獲取數據
    return [];
  }

  // 私有方法：獲取用戶動作
  private async getUserExercises(userId: string): Promise<any[]> {
    // 實際實作時從動作服務獲取數據
    return [];
  }

  // 私有方法：獲取用戶範本
  private async getUserTemplates(userId: string): Promise<any[]> {
    // 實際實作時從範本服務獲取數據
    return [];
  }

  // 私有方法：獲取用戶成就
  private async getUserAchievements(userId: string): Promise<any[]> {
    // 實際實作時從成就服務獲取數據
    return [];
  }

  // 私有方法：生成匯出檔案
  private async generateExportFile(data: any, format: string, fileName: string): Promise<string> {
    // 實際實作時應該生成檔案並返回下載連結
    return `/exports/${fileName}`;
  }

  // 私有方法：獲取檔案大小
  private async getFileSize(filePath: string): Promise<number> {
    // 實際實作時獲取檔案大小
    return 1024; // 1KB
  }

  // 私有方法：記錄資料匯出
  private async logDataExport(userId: string, exportId: string, request: ExportDataRequest): Promise<void> {
    // 記錄匯出請求到審計日誌
  }

  // 私有方法：記錄帳戶刪除
  private async logAccountDeletion(userId: string, request: DeleteAccountRequest): Promise<void> {
    // 記錄刪除請求到審計日誌
  }

  // 私有方法：軟刪除用戶資料
  private async softDeleteUserData(userId: string): Promise<void> {
    // 實際實作時標記用戶資料為已刪除
  }

  // 私有方法：保存設定備份
  private async saveSettingsBackup(backup: SettingsBackup): Promise<void> {
    try {
      const backupRow = [
        backup.backup_id,
        backup.user_id,
        JSON.stringify(backup.settings_snapshot),
        backup.backup_date,
        backup.backup_type,
        backup.description || ''
      ];

      await googleSheetsService.appendData(
        `${this.BACKUPS_SHEET}!A:F`,
        [backupRow]
      );
    } catch (error) {
      console.error('Error saving settings backup:', error);
      throw error;
    }
  }

  // 私有方法：獲取設定備份
  private async getSettingsBackup(backupId: string): Promise<SettingsBackup | null> {
    try {
      const data = await googleSheetsService.readData(`${this.BACKUPS_SHEET}!A:F`);
      const backupRow = data.find((row: any[]) => row[0] === backupId);
      
      if (!backupRow) {
        return null;
      }

      return {
        backup_id: backupRow[0],
        user_id: backupRow[1],
        settings_snapshot: JSON.parse(backupRow[2]),
        backup_date: backupRow[3],
        backup_type: backupRow[4] as 'manual' | 'automatic',
        description: backupRow[5]
      };
    } catch (error) {
      console.error('Error getting settings backup:', error);
      return null;
    }
  }
}

export default new SettingsService();