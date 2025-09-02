import express from 'express';
import exerciseController from '../controllers/exerciseController';
import { authenticateToken } from '../middleware/auth';
import { validateExerciseData, validateExerciseUpdate } from '../middleware/validation';

const router = express.Router();

// 靜態路由（這些必須在動態路由之前定義）

// 初始化系統動作
// POST /api/exercises/init
router.post('/init', authenticateToken, exerciseController.initializeSystemExercises);

// 取得用戶的自訂動作
// GET /api/exercises/user/custom
router.get('/user/custom', authenticateToken, exerciseController.getUserExercises);

// 取得動作統計
// GET /api/exercises/stats/summary
router.get('/stats/summary', authenticateToken, exerciseController.getExerciseStats);

// 取得肌群列表
// GET /api/exercises/data/muscle-groups
router.get('/data/muscle-groups', authenticateToken, exerciseController.getMuscleGroups);

// 取得動作分類列表
// GET /api/exercises/data/categories
router.get('/data/categories', authenticateToken, exerciseController.getCategories);

// 動態路由（這些必須在靜態路由之後定義）

// 取得動作列表（支援搜尋和篩選）
// GET /api/exercises?search=深蹲&category=複合動作&primary_muscle=腿部&is_system=true&page=1&limit=20
router.get('/', authenticateToken, exerciseController.getExercises);

// 創建自訂動作
// POST /api/exercises
router.post('/', authenticateToken, validateExerciseData, exerciseController.createExercise);

// 取得單一動作
// GET /api/exercises/:id
router.get('/:id', authenticateToken, exerciseController.getExerciseById);

// 更新動作
// PUT /api/exercises/:id
router.put('/:id', authenticateToken, validateExerciseUpdate, exerciseController.updateExercise);

// 刪除動作
// DELETE /api/exercises/:id
router.delete('/:id', authenticateToken, exerciseController.deleteExercise);

export default router;