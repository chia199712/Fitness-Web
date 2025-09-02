import { Request, Response } from 'express';
import settingsService from '../services/settingsService';
import {
  UpdatePreferencesRequest,
  UpdateNotificationSettingsRequest,
  UpdatePrivacySettingsRequest,
  UpdateAccountInfoRequest,
  ChangePasswordRequest,
  ExportDataRequest,
  DeleteAccountRequest,
  ResetSettingsRequest,
  RestoreSettingsRequest,
  ApiResponse
} from '../types';

/**
 * 設定控制器
 * 處理所有與用戶設定相關的 API 請求
 */
class SettingsController {

  /**
   * GET /api/settings
   * 取得用戶完整設定
   */
  async getUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      
      res.status(200).json({
        success: true,
        data: settings,
        message: '成功獲取用戶設定'
      });
    } catch (error: any) {
      console.error('Error getting user settings:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取設定失敗'
      });
    }
  }

  /**
   * PUT /api/settings
   * 更新用戶完整設定
   */
  async updateUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const { preferences, notifications, privacy, account } = req.body;

      let updatedSettings = await settingsService.getUserSettings(userId);
      if (!updatedSettings) {
        res.status(404).json({
          success: false,
          message: '用戶設定不存在'
        });
        return;
      }

      // 批量更新各個設定
      if (preferences) {
        updatedSettings.preferences = await settingsService.updatePreferences(userId, preferences);
      }
      if (notifications) {
        updatedSettings.notifications = await settingsService.updateNotificationSettings(userId, notifications);
      }
      if (privacy) {
        updatedSettings.privacy = await settingsService.updatePrivacySettings(userId, privacy);
      }
      if (account) {
        updatedSettings.account = await settingsService.updateAccountInfo(userId, account);
      }

      res.status(200).json({
        success: true,
        data: updatedSettings,
        message: '成功更新設定'
      });
    } catch (error: any) {
      console.error('Error updating user settings:', error);
      res.status(500).json({
        success: false,
        message: error.message || '更新設定失敗'
      });
    }
  }

  /**
   * GET /api/settings/preferences
   * 取得偏好設定
   */
  async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      if (!settings) {
        res.status(404).json({
          success: false,
          message: '用戶設定不存在'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: settings.preferences,
        message: '成功獲取偏好設定'
      });
    } catch (error: any) {
      console.error('Error getting preferences:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取偏好設定失敗'
      });
    }
  }

  /**
   * PUT /api/settings/preferences
   * 更新偏好設定
   */
  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const updates: UpdatePreferencesRequest = req.body;
      const preferences = await settingsService.updatePreferences(userId, updates);

      res.status(200).json({
        success: true,
        data: preferences,
        message: '成功更新偏好設定'
      });
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      res.status(400).json({
        success: false,
        message: error.message || '更新偏好設定失敗'
      });
    }
  }

  /**
   * GET /api/settings/notifications
   * 取得通知設定
   */
  async getNotificationSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      if (!settings) {
        res.status(404).json({
          success: false,
          message: '用戶設定不存在'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: settings.notifications,
        message: '成功獲取通知設定'
      });
    } catch (error: any) {
      console.error('Error getting notification settings:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取通知設定失敗'
      });
    }
  }

  /**
   * PUT /api/settings/notifications
   * 更新通知設定
   */
  async updateNotificationSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const updates: UpdateNotificationSettingsRequest = req.body;
      const notifications = await settingsService.updateNotificationSettings(userId, updates);

      res.status(200).json({
        success: true,
        data: notifications,
        message: '成功更新通知設定'
      });
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      res.status(400).json({
        success: false,
        message: error.message || '更新通知設定失敗'
      });
    }
  }

  /**
   * GET /api/settings/privacy
   * 取得隱私設定
   */
  async getPrivacySettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      if (!settings) {
        res.status(404).json({
          success: false,
          message: '用戶設定不存在'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: settings.privacy,
        message: '成功獲取隱私設定'
      });
    } catch (error: any) {
      console.error('Error getting privacy settings:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取隱私設定失敗'
      });
    }
  }

  /**
   * PUT /api/settings/privacy
   * 更新隱私設定
   */
  async updatePrivacySettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const updates: UpdatePrivacySettingsRequest = req.body;
      const privacy = await settingsService.updatePrivacySettings(userId, updates);

      res.status(200).json({
        success: true,
        data: privacy,
        message: '成功更新隱私設定'
      });
    } catch (error: any) {
      console.error('Error updating privacy settings:', error);
      res.status(400).json({
        success: false,
        message: error.message || '更新隱私設定失敗'
      });
    }
  }

  /**
   * PUT /api/settings/password
   * 變更密碼
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const request: ChangePasswordRequest = req.body;
      
      // 驗證請求數據
      if (!request.current_password || !request.new_password || !request.confirm_password) {
        res.status(400).json({
          success: false,
          message: '請提供完整的密碼資訊'
        });
        return;
      }

      const success = await settingsService.changePassword(userId, request);

      res.status(200).json({
        success: true,
        data: { password_changed: success },
        message: '密碼變更成功'
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      res.status(400).json({
        success: false,
        message: error.message || '密碼變更失敗'
      });
    }
  }

  /**
   * GET /api/settings/profile
   * 取得個人資料
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      if (!settings) {
        res.status(404).json({
          success: false,
          message: '用戶設定不存在'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: settings.account,
        message: '成功獲取個人資料'
      });
    } catch (error: any) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取個人資料失敗'
      });
    }
  }

  /**
   * PUT /api/settings/profile
   * 更新個人資料
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const updates: UpdateAccountInfoRequest = req.body;
      const account = await settingsService.updateAccountInfo(userId, updates);

      res.status(200).json({
        success: true,
        data: account,
        message: '成功更新個人資料'
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      res.status(400).json({
        success: false,
        message: error.message || '更新個人資料失敗'
      });
    }
  }

  /**
   * DELETE /api/settings/account
   * 刪除帳戶
   */
  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const request: DeleteAccountRequest = req.body;
      
      // 驗證請求數據
      if (!request.password || !request.confirmation) {
        res.status(400).json({
          success: false,
          message: '請提供完整的刪除確認資訊'
        });
        return;
      }

      const success = await settingsService.deleteAccount(userId, request);

      res.status(200).json({
        success: true,
        data: { account_deleted: success },
        message: '帳戶刪除成功，您將在30天內無法恢復'
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      res.status(400).json({
        success: false,
        message: error.message || '帳戶刪除失敗'
      });
    }
  }

  /**
   * POST /api/settings/export
   * 匯出資料
   */
  async exportData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const request: ExportDataRequest = req.body;
      
      // 驗證請求數據
      if (!request.format || !request.data_types || request.data_types.length === 0) {
        res.status(400).json({
          success: false,
          message: '請指定匯出格式和資料類型'
        });
        return;
      }

      const exportResult = await settingsService.exportUserData(userId, request);

      res.status(200).json({
        success: true,
        data: exportResult,
        message: '資料匯出成功'
      });
    } catch (error: any) {
      console.error('Error exporting data:', error);
      res.status(500).json({
        success: false,
        message: error.message || '資料匯出失敗'
      });
    }
  }

  /**
   * POST /api/settings/reset
   * 重置設定
   */
  async resetSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const request: ResetSettingsRequest = req.body;
      
      // 驗證請求數據
      if (!request.setting_types || request.setting_types.length === 0) {
        res.status(400).json({
          success: false,
          message: '請指定要重置的設定類型'
        });
        return;
      }

      if (!request.confirmation) {
        res.status(400).json({
          success: false,
          message: '請確認重置操作'
        });
        return;
      }

      const settings = await settingsService.resetSettings(userId, request);

      res.status(200).json({
        success: true,
        data: settings,
        message: '設定重置成功'
      });
    } catch (error: any) {
      console.error('Error resetting settings:', error);
      res.status(400).json({
        success: false,
        message: error.message || '設定重置失敗'
      });
    }
  }

  /**
   * GET /api/settings/usage-stats
   * 取得使用統計
   */
  async getUsageStatistics(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const stats = await settingsService.getUsageStatistics(userId);

      res.status(200).json({
        success: true,
        data: stats,
        message: '成功獲取使用統計'
      });
    } catch (error: any) {
      console.error('Error getting usage statistics:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取使用統計失敗'
      });
    }
  }

  /**
   * POST /api/settings/backup
   * 建立設定備份
   */
  async createBackup(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const { description } = req.body;
      const backup = await settingsService.createSettingsBackup(userId, undefined, 'manual', description);

      res.status(201).json({
        success: true,
        data: backup,
        message: '設定備份建立成功'
      });
    } catch (error: any) {
      console.error('Error creating backup:', error);
      res.status(500).json({
        success: false,
        message: error.message || '建立備份失敗'
      });
    }
  }

  /**
   * POST /api/settings/restore
   * 恢復設定
   */
  async restoreSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const request: RestoreSettingsRequest = req.body;
      
      // 驗證請求數據
      if (!request.backup_id) {
        res.status(400).json({
          success: false,
          message: '請指定備份ID'
        });
        return;
      }

      const settings = await settingsService.restoreSettings(userId, request);

      res.status(200).json({
        success: true,
        data: settings,
        message: '設定恢復成功'
      });
    } catch (error: any) {
      console.error('Error restoring settings:', error);
      res.status(400).json({
        success: false,
        message: error.message || '設定恢復失敗'
      });
    }
  }

  /**
   * GET /api/settings/security
   * 取得安全設定
   */
  async getSecuritySettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授權的請求'
        });
        return;
      }

      const settings = await settingsService.getUserSettings(userId);
      if (!settings) {
        res.status(404).json({
          success: false,
          message: '用戶設定不存在'
        });
        return;
      }

      // 過濾敏感資訊（如登入歷史詳細資訊）
      const securityInfo = {
        two_factor_enabled: settings.security.two_factor_enabled,
        password_last_changed: settings.security.password_last_changed,
        active_sessions_count: settings.security.active_sessions.length,
        recent_login_count: settings.security.login_history.slice(0, 10).length
      };

      res.status(200).json({
        success: true,
        data: securityInfo,
        message: '成功獲取安全設定'
      });
    } catch (error: any) {
      console.error('Error getting security settings:', error);
      res.status(500).json({
        success: false,
        message: error.message || '獲取安全設定失敗'
      });
    }
  }
}

export default new SettingsController();