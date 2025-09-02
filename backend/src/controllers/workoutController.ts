import { Request, Response } from 'express';
import workoutService from '../services/workoutService';
import {
  CreateWorkoutRequest,
  UpdateWorkoutRequest,
  AddWorkoutExerciseRequest,
  UpdateWorkoutExerciseRequest,
  AddSetRequest,
  UpdateSetRequest,
  WorkoutSearchParams,
  ApiResponse,
  WorkoutWithDetails,
  Workout,
  WorkoutExercise,
  Set,
  WorkoutStats
} from '../types';

/**
 * 訓練控制器
 */
class WorkoutController {
  
  /**
   * 獲取訓練記錄列表
   * GET /api/workouts
   */
  async getWorkouts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const params: WorkoutSearchParams = {
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await workoutService.getWorkouts(userId, params);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: '成功獲取訓練記錄列表'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get workouts error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '獲取訓練記錄失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 獲取單一訓練詳情
   * GET /api/workouts/:id
   */
  async getWorkoutById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;

      const workout = await workoutService.getWorkoutWithDetails(userId, workoutId);

      if (!workout) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練記錄不存在或無權限訪問'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<WorkoutWithDetails> = {
        success: true,
        data: workout,
        message: '成功獲取訓練詳情'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get workout by id error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '獲取訓練詳情失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 開始新訓練
   * POST /api/workouts
   */
  async createWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data: CreateWorkoutRequest = req.body;

      const workout = await workoutService.createWorkout(userId, data);

      const response: ApiResponse<Workout> = {
        success: true,
        data: workout,
        message: '成功開始新訓練'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create workout error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '開始訓練失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 更新訓練資訊
   * PUT /api/workouts/:id
   */
  async updateWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const data: UpdateWorkoutRequest = req.body;

      const workout = await workoutService.updateWorkout(userId, workoutId, data);

      if (!workout) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練記錄不存在或無權限修改'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Workout> = {
        success: true,
        data: workout,
        message: '成功更新訓練資訊'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update workout error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '更新訓練失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 刪除訓練
   * DELETE /api/workouts/:id
   */
  async deleteWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;

      const success = await workoutService.deleteWorkout(userId, workoutId);

      if (!success) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練記錄不存在或無權限刪除'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: '成功刪除訓練記錄'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Delete workout error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '刪除訓練失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 添加動作到訓練
   * POST /api/workouts/:id/exercises
   */
  async addExerciseToWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const data: AddWorkoutExerciseRequest = req.body;

      const workoutExercise = await workoutService.addExerciseToWorkout(userId, workoutId, data);

      if (!workoutExercise) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練記錄不存在或無權限修改'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<WorkoutExercise> = {
        success: true,
        data: workoutExercise,
        message: '成功添加動作到訓練'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Add exercise to workout error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '添加動作失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 更新訓練動作
   * PUT /api/workouts/:id/exercises/:exerciseId
   */
  async updateWorkoutExercise(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const exerciseId = req.params.exerciseId;
      const data: UpdateWorkoutExerciseRequest = req.body;

      const workoutExercise = await workoutService.updateWorkoutExercise(
        userId,
        workoutId,
        exerciseId,
        data
      );

      if (!workoutExercise) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練動作不存在或無權限修改'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<WorkoutExercise> = {
        success: true,
        data: workoutExercise,
        message: '成功更新訓練動作'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update workout exercise error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '更新訓練動作失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 移除訓練動作
   * DELETE /api/workouts/:id/exercises/:exerciseId
   */
  async removeExerciseFromWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const exerciseId = req.params.exerciseId;

      const success = await workoutService.removeExerciseFromWorkout(userId, workoutId, exerciseId);

      if (!success) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練動作不存在或無權限刪除'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: '成功移除訓練動作'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Remove exercise from workout error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '移除訓練動作失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 添加組數
   * POST /api/workouts/:id/exercises/:exerciseId/sets
   */
  async addSet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const exerciseId = req.params.exerciseId;
      const data: AddSetRequest = req.body;

      const set = await workoutService.addSet(userId, workoutId, exerciseId, data);

      if (!set) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練動作不存在或無權限修改'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Set> = {
        success: true,
        data: set,
        message: '成功添加組數'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Add set error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '添加組數失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 更新組數
   * PUT /api/workouts/:id/exercises/:exerciseId/sets/:setId
   */
  async updateSet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const exerciseId = req.params.exerciseId;
      const setId = req.params.setId;
      const data: UpdateSetRequest = req.body;

      const set = await workoutService.updateSet(userId, workoutId, exerciseId, setId, data);

      if (!set) {
        const response: ApiResponse<null> = {
          success: false,
          message: '組數記錄不存在或無權限修改'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Set> = {
        success: true,
        data: set,
        message: '成功更新組數'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update set error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '更新組數失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 刪除組數
   * DELETE /api/workouts/:id/exercises/:exerciseId/sets/:setId
   */
  async deleteSet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;
      const exerciseId = req.params.exerciseId;
      const setId = req.params.setId;

      const success = await workoutService.deleteSet(userId, workoutId, exerciseId, setId);

      if (!success) {
        const response: ApiResponse<null> = {
          success: false,
          message: '組數記錄不存在或無權限刪除'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: '成功刪除組數'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Delete set error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '刪除組數失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 完成訓練
   * POST /api/workouts/:id/finish
   */
  async finishWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const workoutId = req.params.id;

      const workout = await workoutService.finishWorkout(userId, workoutId);

      if (!workout) {
        const response: ApiResponse<null> = {
          success: false,
          message: '訓練記錄不存在或無權限修改'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Workout> = {
        success: true,
        data: workout,
        message: '成功完成訓練'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Finish workout error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '完成訓練失敗'
      };
      res.status(500).json(response);
    }
  }

  /**
   * 獲取訓練統計
   * GET /api/workouts/stats
   */
  async getWorkoutStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;

      const stats = await workoutService.getWorkoutStats(userId, startDate, endDate);

      const response: ApiResponse<WorkoutStats> = {
        success: true,
        data: stats,
        message: '成功獲取訓練統計'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get workout stats error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : '獲取訓練統計失敗'
      };
      res.status(500).json(response);
    }
  }
}

export default new WorkoutController();