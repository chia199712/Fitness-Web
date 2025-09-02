import { Router } from 'express';
import workoutController from '../controllers/workoutController';
import { authenticateToken } from '../middleware/auth';
import {
  validateCreateWorkout,
  validateUpdateWorkout,
  validateAddWorkoutExercise,
  validateUpdateWorkoutExercise,
  validateAddSet,
  validateUpdateSet
} from '../middleware/validation';

const router = Router();

// 所有路由都需要認證
router.use(authenticateToken);

/**
 * 訓練統計路由（必須在 /:id 路由之前定義）
 */
router.get('/stats', workoutController.getWorkoutStats);

/**
 * 基本訓練管理路由
 */
// 獲取訓練記錄列表
router.get('/', workoutController.getWorkouts);

// 獲取單一訓練詳情
router.get('/:id', workoutController.getWorkoutById);

// 開始新訓練
router.post('/', validateCreateWorkout, workoutController.createWorkout);

// 更新訓練資訊
router.put('/:id', validateUpdateWorkout, workoutController.updateWorkout);

// 刪除訓練
router.delete('/:id', workoutController.deleteWorkout);

/**
 * 訓練動作管理路由
 */
// 添加動作到訓練
router.post(
  '/:id/exercises',
  validateAddWorkoutExercise,
  workoutController.addExerciseToWorkout
);

// 更新訓練動作
router.put(
  '/:id/exercises/:exerciseId',
  validateUpdateWorkoutExercise,
  workoutController.updateWorkoutExercise
);

// 移除訓練動作
router.delete(
  '/:id/exercises/:exerciseId',
  workoutController.removeExerciseFromWorkout
);

/**
 * 組數管理路由
 */
// 添加組數
router.post(
  '/:id/exercises/:exerciseId/sets',
  validateAddSet,
  workoutController.addSet
);

// 更新組數
router.put(
  '/:id/exercises/:exerciseId/sets/:setId',
  validateUpdateSet,
  workoutController.updateSet
);

// 刪除組數
router.delete(
  '/:id/exercises/:exerciseId/sets/:setId',
  workoutController.deleteSet
);

/**
 * 訓練控制路由
 */
// 完成訓練
router.post('/:id/finish', workoutController.finishWorkout);

export default router;