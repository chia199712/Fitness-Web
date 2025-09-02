import express from 'express';
import dashboardController from '../controllers/dashboardController';
import { 
  validateCalendarParams, 
  validateProgressParams,
  validateInsightParams,
  validateMetricsParams,
  validateExportParams
} from '../middleware/validation';

const router = express.Router();

// 移除認證中間件，讓API公開可訪問

/**
 * @route GET /api/dashboard
 * @desc 取得儀表板總覽
 * @access Private
 * @returns {DashboardOverview} 儀表板總覽數據
 */
router.get('/', dashboardController.getDashboardOverview);

/**
 * @route GET /api/dashboard/stats
 * @desc 取得詳細統計資訊
 * @access Private
 * @returns {DashboardStats} 統計資訊
 */
router.get('/stats', dashboardController.getDashboardStats);

/**
 * @route GET /api/dashboard/recent-workouts
 * @desc 取得近期訓練記錄
 * @access Private
 * @query {number} limit - 限制返回數量 (預設: 10, 最大: 50)
 * @returns {RecentWorkout[]} 近期訓練列表
 */
router.get('/recent-workouts', dashboardController.getRecentWorkouts);

/**
 * @route GET /api/dashboard/personal-records
 * @desc 取得個人記錄 (PRs)
 * @access Private
 * @returns {PersonalRecord[]} 個人記錄列表
 */
router.get('/personal-records', dashboardController.getPersonalRecords);

/**
 * @route GET /api/dashboard/calendar
 * @desc 取得訓練日曆
 * @access Private
 * @query {number} year - 年份 (必須，範圍: 2020-2030)
 * @query {number} month - 月份 (必須，範圍: 1-12)
 * @returns {CalendarItem[]} 訓練日曆數據
 */
router.get('/calendar', validateCalendarParams, dashboardController.getTrainingCalendar);

/**
 * @route GET /api/dashboard/achievements
 * @desc 取得成就列表
 * @access Private
 * @returns {Achievement[]} 成就列表
 */
router.get('/achievements', dashboardController.getAchievements);

/**
 * @route GET /api/dashboard/progress
 * @desc 取得進度追蹤數據
 * @access Private
 * @query {string} period - 時間週期 (week|month|quarter|year，預設: month)
 * @query {string} metric - 指標類型 (volume|duration|workouts|strength，預設: volume)
 * @query {string} start_date - 開始日期 (可選，格式: YYYY-MM-DD)
 * @query {string} end_date - 結束日期 (可選，格式: YYYY-MM-DD)
 * @returns {ProgressTracking[]} 進度追蹤數據
 */
router.get('/progress', validateProgressParams, dashboardController.getProgressTracking);

/**
 * @route GET /api/dashboard/insights
 * @desc 取得訓練洞察
 * @access Private
 * @query {string} type - 洞察類型 (可選: best_time|rest_analysis|efficiency|balance|suggestion)
 * @query {string} priority - 優先級 (可選: low|medium|high)
 * @query {number} limit - 限制返回數量 (預設: 10, 範圍: 1-50)
 * @returns {WorkoutInsight[]} 訓練洞察列表
 */
router.get('/insights', validateInsightParams, dashboardController.getWorkoutInsights);

/**
 * @route GET /api/dashboard/summary
 * @desc 取得儀表板快速摘要
 * @access Private
 * @returns {Object} 儀表板摘要數據
 */
router.get('/summary', dashboardController.getDashboardSummary);

/**
 * @route GET /api/dashboard/metrics
 * @desc 取得關鍵指標
 * @access Private
 * @query {string} period - 時間週期 (week|month|quarter|year，預設: month)
 * @returns {Object} 關鍵指標數據
 */
router.get('/metrics', validateMetricsParams, dashboardController.getKeyMetrics);

/**
 * @route POST /api/dashboard/refresh-cache
 * @desc 刷新儀表板快取
 * @access Private
 * @returns {Object} 操作結果
 */
router.post('/refresh-cache', dashboardController.refreshCache);

/**
 * @route GET /api/dashboard/export
 * @desc 匯出儀表板數據
 * @access Private
 * @query {string} format - 匯出格式 (json|csv，預設: json)
 * @returns {File} 匯出的數據文件
 */
router.get('/export', validateExportParams, dashboardController.exportDashboardData);

export default router;