import { Request, Response } from 'express';
import templateService from '../services/templateService';
import {
  CreateTemplateRequest,
  UpdateTemplateRequest,
  AddTemplateExerciseRequest,
  UpdateTemplateExerciseRequest,
  TemplateSearchParams,
  ApplyTemplateRequest,
  DuplicateTemplateRequest,
  ToggleFavoriteRequest,
  BulkTemplateOperation,
  ApiResponse,
  TemplateType,
  TemplateDifficulty,
  TemplateVisibility
} from '../types';

// 取得範本列表
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    const searchParams: TemplateSearchParams = {
      search: req.query.search as string,
      type: req.query.type as TemplateType,
      difficulty: req.query.difficulty as TemplateDifficulty,
      visibility: req.query.visibility as TemplateVisibility,
      user_id: req.query.user_id as string,
      is_favorite: req.query.is_favorite === 'true' ? true : req.query.is_favorite === 'false' ? false : undefined,
      sort_by: req.query.sort_by as any,
      sort_order: req.query.sort_order as 'asc' | 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
    };

    const templates = await templateService.getTemplates(searchParams, userId);

    const response: ApiResponse<typeof templates> = {
      success: true,
      data: templates
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getTemplates:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得範本列表失敗'
    };
    res.status(500).json(response);
  }
};

// 取得單一範本詳情
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const template = await templateService.getTemplateById(id, userId);

    if (!template) {
      const response: ApiResponse<null> = {
        success: false,
        error: '範本不存在'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof template> = {
      success: true,
      data: template
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getTemplateById:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得範本詳情失敗'
    };
    res.status(500).json(response);
  }
};

// 創建新範本
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const templateData: CreateTemplateRequest = req.body;

    const template = await templateService.createTemplate(userId, templateData);

    const response: ApiResponse<typeof template> = {
      success: true,
      data: template,
      message: '範本創建成功'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error in createTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '創建範本失敗'
    };
    res.status(500).json(response);
  }
};

// 更新範本
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const updateData: UpdateTemplateRequest = req.body;

    const template = await templateService.updateTemplate(id, userId, updateData);

    const response: ApiResponse<typeof template> = {
      success: true,
      data: template,
      message: '範本更新成功'
    };

    res.json(response);
  } catch (error) {
    console.error('Error in updateTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '更新範本失敗'
    };
    res.status(500).json(response);
  }
};

// 刪除範本
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    await templateService.deleteTemplate(id, userId);

    const response: ApiResponse<null> = {
      success: true,
      message: '範本刪除成功'
    };

    res.json(response);
  } catch (error) {
    console.error('Error in deleteTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '刪除範本失敗'
    };
    res.status(500).json(response);
  }
};

// 添加動作到範本
export const addExerciseToTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const exerciseData: AddTemplateExerciseRequest = req.body;

    const templateExercise = await templateService.addExerciseToTemplate(id, userId, exerciseData);

    const response: ApiResponse<typeof templateExercise> = {
      success: true,
      data: templateExercise,
      message: '動作添加成功'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error in addExerciseToTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '添加動作失敗'
    };
    res.status(500).json(response);
  }
};

// 更新範本動作
export const updateTemplateExercise = async (req: Request, res: Response) => {
  try {
    const { id, exerciseId } = req.params;
    const userId = req.user!.userId;
    const updateData: UpdateTemplateExerciseRequest = req.body;

    const templateExercise = await templateService.updateTemplateExercise(id, exerciseId, userId, updateData);

    const response: ApiResponse<typeof templateExercise> = {
      success: true,
      data: templateExercise,
      message: '範本動作更新成功'
    };

    res.json(response);
  } catch (error) {
    console.error('Error in updateTemplateExercise:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '更新範本動作失敗'
    };
    res.status(500).json(response);
  }
};

// 移除範本動作
export const removeExerciseFromTemplate = async (req: Request, res: Response) => {
  try {
    const { id, exerciseId } = req.params;
    const userId = req.user!.userId;

    await templateService.removeExerciseFromTemplate(id, exerciseId, userId);

    const response: ApiResponse<null> = {
      success: true,
      message: '動作移除成功'
    };

    res.json(response);
  } catch (error) {
    console.error('Error in removeExerciseFromTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '移除動作失敗'
    };
    res.status(500).json(response);
  }
};

// 套用範本開始訓練
export const applyTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const applyData: ApplyTemplateRequest = req.body;

    const workoutId = await templateService.applyTemplate(id, userId, applyData);

    const response: ApiResponse<{ workout_id: string }> = {
      success: true,
      data: { workout_id: workoutId },
      message: '範本套用成功，訓練已開始'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error in applyTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '套用範本失敗'
    };
    res.status(500).json(response);
  }
};

// 複製範本
export const duplicateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const duplicateData: DuplicateTemplateRequest = req.body;

    const newTemplate = await templateService.duplicateTemplate(id, userId, duplicateData);

    const response: ApiResponse<typeof newTemplate> = {
      success: true,
      data: newTemplate,
      message: '範本複製成功'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error in duplicateTemplate:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '複製範本失敗'
    };
    res.status(500).json(response);
  }
};

// 切換範本收藏狀態
export const toggleTemplateFavorite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const { is_favorite }: ToggleFavoriteRequest = req.body;

    await templateService.toggleTemplateFavorite(id, userId, is_favorite);

    const response: ApiResponse<null> = {
      success: true,
      message: is_favorite ? '已添加到收藏' : '已移除收藏'
    };

    res.json(response);
  } catch (error) {
    console.error('Error in toggleTemplateFavorite:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '操作失敗'
    };
    res.status(500).json(response);
  }
};

// 取得熱門範本
export const getPopularTemplates = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const templates = await templateService.getPopularTemplates(limit);

    const response: ApiResponse<typeof templates> = {
      success: true,
      data: templates
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getPopularTemplates:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得熱門範本失敗'
    };
    res.status(500).json(response);
  }
};

// 取得範本統計
export const getTemplateStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const stats = await templateService.getTemplateStats(userId);

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getTemplateStats:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得範本統計失敗'
    };
    res.status(500).json(response);
  }
};

// 取得我的範本
export const getMyTemplates = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const searchParams: TemplateSearchParams = {
      user_id: userId,
      search: req.query.search as string,
      type: req.query.type as TemplateType,
      difficulty: req.query.difficulty as TemplateDifficulty,
      visibility: req.query.visibility as TemplateVisibility,
      is_favorite: req.query.is_favorite === 'true' ? true : req.query.is_favorite === 'false' ? false : undefined,
      sort_by: req.query.sort_by as any,
      sort_order: req.query.sort_order as 'asc' | 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
    };

    const templates = await templateService.getTemplates(searchParams, userId);

    const response: ApiResponse<typeof templates> = {
      success: true,
      data: templates
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getMyTemplates:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得我的範本失敗'
    };
    res.status(500).json(response);
  }
};

// 取得收藏的範本
export const getFavoriteTemplates = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const searchParams: TemplateSearchParams = {
      user_id: userId,
      is_favorite: true,
      sort_by: 'last_used_at',
      sort_order: 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };

    const templates = await templateService.getTemplates(searchParams, userId);

    const response: ApiResponse<typeof templates> = {
      success: true,
      data: templates
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getFavoriteTemplates:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得收藏範本失敗'
    };
    res.status(500).json(response);
  }
};

// 取得公開範本
export const getPublicTemplates = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    const searchParams: TemplateSearchParams = {
      visibility: TemplateVisibility.PUBLIC,
      search: req.query.search as string,
      type: req.query.type as TemplateType,
      difficulty: req.query.difficulty as TemplateDifficulty,
      sort_by: req.query.sort_by as any || 'use_count',
      sort_order: req.query.sort_order as 'asc' | 'desc' || 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
    };

    const templates = await templateService.getTemplates(searchParams, userId);

    const response: ApiResponse<typeof templates> = {
      success: true,
      data: templates
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getPublicTemplates:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得公開範本失敗'
    };
    res.status(500).json(response);
  }
};

// 批量操作範本
export const bulkTemplateOperation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const operation: BulkTemplateOperation = req.body;

    let successCount = 0;
    const errors: string[] = [];

    for (const templateId of operation.template_ids) {
      try {
        switch (operation.operation) {
          case 'delete':
            await templateService.deleteTemplate(templateId, userId);
            break;
          case 'favorite':
            await templateService.toggleTemplateFavorite(templateId, userId, true);
            break;
          case 'unfavorite':
            await templateService.toggleTemplateFavorite(templateId, userId, false);
            break;
          case 'change_visibility':
            if (operation.visibility) {
              await templateService.updateTemplate(templateId, userId, { 
                visibility: operation.visibility 
              });
            }
            break;
        }
        successCount++;
      } catch (error) {
        errors.push(`範本 ${templateId}: ${error instanceof Error ? error.message : '操作失敗'}`);
      }
    }

    const response: ApiResponse<{ success_count: number; errors: string[] }> = {
      success: successCount > 0,
      data: { success_count: successCount, errors },
      message: `成功處理 ${successCount} 個範本${errors.length > 0 ? `，${errors.length} 個失敗` : ''}`
    };

    res.json(response);
  } catch (error) {
    console.error('Error in bulkTemplateOperation:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '批量操作失敗'
    };
    res.status(500).json(response);
  }
};

// 取得範本可用的動作建議
export const getTemplateExerciseSuggestions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // 取得範本詳情
    const template = await templateService.getTemplateById(id, userId);
    if (!template) {
      const response: ApiResponse<null> = {
        success: false,
        error: '範本不存在'
      };
      return res.status(404).json(response);
    }

    // 根據範本類型和目標肌群取得動作建議
    // 這裡可以整合 exerciseService 來取得相關動作
    const suggestions = {
      recommended_exercises: [],
      complementary_exercises: [],
      similar_templates: []
    };

    const response: ApiResponse<typeof suggestions> = {
      success: true,
      data: suggestions,
      message: '動作建議取得成功'
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getTemplateExerciseSuggestions:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '取得動作建議失敗'
    };
    res.status(500).json(response);
  }
};