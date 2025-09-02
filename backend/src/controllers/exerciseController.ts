import { Request, Response } from 'express';
import exerciseService from '../services/exerciseService';
import { 
  CreateExerciseRequest, 
  UpdateExerciseRequest, 
  ExerciseSearchParams,
  JWTPayload 
} from '../types';

// 擴展 Request 類型以包含用戶資訊
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

class ExerciseController {
  // 取得動作列表
  async getExercises(req: AuthenticatedRequest, res: Response) {
    try {
      const searchParams: ExerciseSearchParams = {
        search: req.query.search as string,
        category: req.query.category as string,
        primary_muscle: req.query.primary_muscle as string,
        is_system: req.query.is_system ? req.query.is_system === 'true' : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20
      };

      const exercises = await exerciseService.getAllExercises(searchParams);
      
      res.json({
        success: true,
        data: exercises,
        pagination: {
          page: searchParams.page || 1,
          limit: searchParams.limit || 20,
          total: exercises.length
        }
      });
    } catch (error) {
      console.error('取得動作列表失敗:', error);
      res.status(500).json({
        success: false,
        message: '取得動作列表失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 取得單一動作
  async getExerciseById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: '動作 ID 是必需的'
        });
      }

      const exercise = await exerciseService.getExerciseById(id);
      
      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: '找不到指定的動作'
        });
      }

      res.json({
        success: true,
        data: exercise
      });
    } catch (error) {
      console.error('取得動作失敗:', error);
      res.status(500).json({
        success: false,
        message: '取得動作失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 創建動作
  async createExercise(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '需要登入才能創建動作'
        });
      }

      // 驗證必需欄位
      const { name, primary_muscle, category } = req.body as CreateExerciseRequest;
      
      if (!name || !primary_muscle || !category) {
        return res.status(400).json({
          success: false,
          message: '動作名稱、主要肌群和分類是必需的'
        });
      }

      // 檢查動作名稱是否已存在
      const existingExercises = await exerciseService.getAllExercises({ search: name });
      const duplicateExercise = existingExercises.find(exercise => 
        exercise.name.toLowerCase() === name.toLowerCase()
      );
      
      if (duplicateExercise) {
        return res.status(409).json({
          success: false,
          message: '動作名稱已存在'
        });
      }

      const exerciseData: CreateExerciseRequest = {
        name: name.trim(),
        primary_muscle: primary_muscle.trim(),
        secondary_muscles: req.body.secondary_muscles?.trim() || '',
        category: category.trim(),
        description: req.body.description?.trim() || '',
        instructions: req.body.instructions?.trim() || ''
      };

      const newExercise = await exerciseService.createExercise(exerciseData, false, userId);
      
      res.status(201).json({
        success: true,
        data: newExercise,
        message: '動作創建成功'
      });
    } catch (error) {
      console.error('創建動作失敗:', error);
      res.status(500).json({
        success: false,
        message: '創建動作失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 更新動作
  async updateExercise(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '需要登入才能更新動作'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: '動作 ID 是必需的'
        });
      }

      // 檢查動作是否存在
      const existingExercise = await exerciseService.getExerciseById(id);
      if (!existingExercise) {
        return res.status(404).json({
          success: false,
          message: '找不到指定的動作'
        });
      }

      // 如果更新名稱，檢查是否與其他動作重複
      if (req.body.name && req.body.name !== existingExercise.name) {
        const existingExercises = await exerciseService.getAllExercises({ search: req.body.name });
        const duplicateExercise = existingExercises.find(exercise => 
          exercise.name.toLowerCase() === req.body.name.toLowerCase() && 
          exercise.exercise_id !== id
        );
        
        if (duplicateExercise) {
          return res.status(409).json({
            success: false,
            message: '動作名稱已存在'
          });
        }
      }

      const updateData: UpdateExerciseRequest = {};
      
      if (req.body.name) updateData.name = req.body.name.trim();
      if (req.body.primary_muscle) updateData.primary_muscle = req.body.primary_muscle.trim();
      if (req.body.secondary_muscles !== undefined) updateData.secondary_muscles = req.body.secondary_muscles.trim();
      if (req.body.category) updateData.category = req.body.category.trim();
      if (req.body.description !== undefined) updateData.description = req.body.description.trim();
      if (req.body.instructions !== undefined) updateData.instructions = req.body.instructions.trim();

      const updatedExercise = await exerciseService.updateExercise(id, updateData, userId);
      
      if (!updatedExercise) {
        return res.status(404).json({
          success: false,
          message: '動作更新失敗'
        });
      }

      res.json({
        success: true,
        data: updatedExercise,
        message: '動作更新成功'
      });
    } catch (error) {
      console.error('更新動作失敗:', error);
      
      if (error instanceof Error && error.message === '沒有權限修改此動作') {
        return res.status(403).json({
          success: false,
          message: '沒有權限修改此動作'
        });
      }

      res.status(500).json({
        success: false,
        message: '更新動作失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 刪除動作
  async deleteExercise(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '需要登入才能刪除動作'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: '動作 ID 是必需的'
        });
      }

      // 檢查動作是否存在
      const existingExercise = await exerciseService.getExerciseById(id);
      if (!existingExercise) {
        return res.status(404).json({
          success: false,
          message: '找不到指定的動作'
        });
      }

      const deleted = await exerciseService.deleteExercise(id, userId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '動作刪除失敗'
        });
      }

      res.json({
        success: true,
        message: '動作刪除成功'
      });
    } catch (error) {
      console.error('刪除動作失敗:', error);
      
      if (error instanceof Error && error.message === '沒有權限刪除此動作') {
        return res.status(403).json({
          success: false,
          message: '沒有權限刪除此動作'
        });
      }

      res.status(500).json({
        success: false,
        message: '刪除動作失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 初始化系統動作
  async initializeSystemExercises(req: AuthenticatedRequest, res: Response) {
    try {
      await exerciseService.initializeSystemExercises();
      
      res.json({
        success: true,
        message: '系統動作初始化成功'
      });
    } catch (error) {
      console.error('初始化系統動作失敗:', error);
      res.status(500).json({
        success: false,
        message: '初始化系統動作失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 取得用戶的自訂動作
  async getUserExercises(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '需要登入才能取得用戶動作'
        });
      }

      const exercises = await exerciseService.getUserExercises(userId);
      
      res.json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('取得用戶動作失敗:', error);
      res.status(500).json({
        success: false,
        message: '取得用戶動作失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 取得動作統計
  async getExerciseStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await exerciseService.getExerciseStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('取得動作統計失敗:', error);
      res.status(500).json({
        success: false,
        message: '取得動作統計失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 取得肌群列表
  async getMuscleGroups(req: AuthenticatedRequest, res: Response) {
    try {
      const muscleGroups = [
        '胸部', '背部', '肩部', '腿部', '臀部', '二頭肌', '三頭肌', '核心', '小腿', '前臂'
      ];
      
      res.json({
        success: true,
        data: muscleGroups
      });
    } catch (error) {
      console.error('取得肌群列表失敗:', error);
      res.status(500).json({
        success: false,
        message: '取得肌群列表失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }

  // 取得動作分類列表
  async getCategories(req: AuthenticatedRequest, res: Response) {
    try {
      const categories = [
        '複合動作', '單關節動作', '有氧運動', '伸展運動', '核心訓練', '爆發力訓練'
      ];
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('取得分類列表失敗:', error);
      res.status(500).json({
        success: false,
        message: '取得分類列表失敗',
        error: error instanceof Error ? error.message : '未知錯誤'
      });
    }
  }
}

export default new ExerciseController();