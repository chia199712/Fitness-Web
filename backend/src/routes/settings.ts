import { Router } from 'express';
import settingsController from '../controllers/settingsController';
import { authenticateToken } from '../middleware/auth';
import { validateSettings } from '../middleware/validation';

const router = Router();

/**
 * 設定路由
 * 所有路由都需要認證
 */

// 應用認證中間件到所有設定路由
router.use(authenticateToken);

/**
 * 完整設定管理
 */

// GET /api/settings - 取得使用者完整設定
router.get('/', settingsController.getUserSettings);

// PUT /api/settings - 更新使用者完整設定
router.put('/', validateSettings.updateSettings, settingsController.updateUserSettings);

/**
 * 偏好設定管理
 */

// GET /api/settings/preferences - 取得偏好設定
router.get('/preferences', settingsController.getPreferences);

// PUT /api/settings/preferences - 更新偏好設定
router.put('/preferences', validateSettings.updatePreferences, settingsController.updatePreferences);

/**
 * 通知設定管理
 */

// GET /api/settings/notifications - 取得通知設定
router.get('/notifications', settingsController.getNotificationSettings);

// PUT /api/settings/notifications - 更新通知設定
router.put('/notifications', validateSettings.updateNotifications, settingsController.updateNotificationSettings);

/**
 * 隱私設定管理
 */

// GET /api/settings/privacy - 取得隱私設定
router.get('/privacy', settingsController.getPrivacySettings);

// PUT /api/settings/privacy - 更新隱私設定
router.put('/privacy', validateSettings.updatePrivacy, settingsController.updatePrivacySettings);

/**
 * 個人資料管理
 */

// GET /api/settings/profile - 取得個人資料
router.get('/profile', settingsController.getProfile);

// PUT /api/settings/profile - 更新個人資料
router.put('/profile', validateSettings.updateProfile, settingsController.updateProfile);

/**
 * 安全設定管理
 */

// GET /api/settings/security - 取得安全設定
router.get('/security', settingsController.getSecuritySettings);

// PUT /api/settings/password - 更改密碼
router.put('/password', validateSettings.changePassword, settingsController.changePassword);

/**
 * 帳戶管理
 */

// DELETE /api/settings/account - 刪除帳戶
router.delete('/account', validateSettings.deleteAccount, settingsController.deleteAccount);

/**
 * 資料管理
 */

// POST /api/settings/export - 匯出資料
router.post('/export', validateSettings.exportData, settingsController.exportData);

// GET /api/settings/usage-stats - 取得使用統計
router.get('/usage-stats', settingsController.getUsageStatistics);

/**
 * 設定管理
 */

// POST /api/settings/reset - 重置設定
router.post('/reset', validateSettings.resetSettings, settingsController.resetSettings);

// POST /api/settings/backup - 建立設定備份
router.post('/backup', settingsController.createBackup);

// POST /api/settings/restore - 恢復設定
router.post('/restore', validateSettings.restoreSettings, settingsController.restoreSettings);

export default router;