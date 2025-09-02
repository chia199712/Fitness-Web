import { v4 as uuidv4 } from 'uuid';
import googleSheets from './googleSheets';
import {
  Template,
  TemplateExercise,
  TemplateWithDetails,
  TemplateExerciseWithDetails,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  AddTemplateExerciseRequest,
  UpdateTemplateExerciseRequest,
  TemplateSearchParams,
  TemplateStats,
  ApplyTemplateRequest,
  DuplicateTemplateRequest,
  TemplateType,
  TemplateDifficulty,
  TemplateVisibility,
  Exercise
} from '../types';
import exerciseService from './exerciseService';
import workoutService from './workoutService';

class TemplateService {
  private readonly TEMPLATES_RANGE = 'Templates!A:T';
  private readonly TEMPLATE_EXERCISES_RANGE = 'TemplateExercises!A:J';

  // 範本 Google Sheets 欄位對應
  private readonly TEMPLATE_HEADERS = [
    'template_id', 'user_id', 'name', 'description', 'type', 'difficulty',
    'visibility', 'estimated_duration', 'target_muscle_groups', 'tags',
    'use_count', 'rating', 'rating_count', 'last_used_at', 'is_favorite',
    'created_at', 'updated_at'
  ];

  // 範本動作 Google Sheets 欄位對應
  private readonly TEMPLATE_EXERCISE_HEADERS = [
    'template_exercise_id', 'template_id', 'exercise_id', 'target_sets',
    'target_reps', 'target_weight', 'rest_time', 'order', 'notes', 'created_at'
  ];

  // 初始化範本相關的工作表
  async initializeTemplateSheets(): Promise<void> {
    try {
      console.log('初始化範本工作表...');
      
      // 初始化範本工作表
      await this.initializeTemplatesSheet();
      console.log('範本工作表初始化完成');
      
      // 初始化範本動作工作表
      await this.initializeTemplateExercisesSheet();
      console.log('範本動作工作表初始化完成');
      
    } catch (error) {
      console.error('範本工作表初始化失敗:', error);
      throw error;
    }
  }

  // 初始化範本工作表
  private async initializeTemplatesSheet(): Promise<void> {
    try {
      const data = await googleSheets.readData(this.TEMPLATES_RANGE);
      
      // 如果工作表為空或只有標題行，則寫入標題
      if (!data || data.length === 0) {
        await googleSheets.writeData(this.TEMPLATES_RANGE, [this.TEMPLATE_HEADERS]);
        console.log('範本工作表標題行已創建');
      } else if (data.length === 1) {
        // 檢查標題行是否正確
        const headers = data[0];
        const isHeaderCorrect = this.TEMPLATE_HEADERS.every((header, index) => 
          headers[index] === header
        );
        
        if (!isHeaderCorrect) {
          console.log('更新範本工作表標題行');
          await googleSheets.writeData('Templates!A1:T1', [this.TEMPLATE_HEADERS]);
        }
      }
    } catch (error) {
      console.error('初始化範本工作表失敗:', error);
      throw error;
    }
  }

  // 初始化範本動作工作表
  private async initializeTemplateExercisesSheet(): Promise<void> {
    try {
      const data = await googleSheets.readData(this.TEMPLATE_EXERCISES_RANGE);
      
      // 如果工作表為空或只有標題行，則寫入標題
      if (!data || data.length === 0) {
        await googleSheets.writeData(this.TEMPLATE_EXERCISES_RANGE, [this.TEMPLATE_EXERCISE_HEADERS]);
        console.log('範本動作工作表標題行已創建');
      } else if (data.length === 1) {
        // 檢查標題行是否正確
        const headers = data[0];
        const isHeaderCorrect = this.TEMPLATE_EXERCISE_HEADERS.every((header, index) => 
          headers[index] === header
        );
        
        if (!isHeaderCorrect) {
          console.log('更新範本動作工作表標題行');
          await googleSheets.writeData('TemplateExercises!A1:J1', [this.TEMPLATE_EXERCISE_HEADERS]);
        }
      }
    } catch (error) {
      console.error('初始化範本動作工作表失敗:', error);
      throw error;
    }
  }

  // 取得所有範本
  async getTemplates(params: TemplateSearchParams = {}, userId?: string): Promise<Template[]> {
    try {
      const data = await googleSheets.readData(this.TEMPLATES_RANGE);
      if (!data || data.length <= 1) return [];

      let templates = this.parseTemplatesFromSheets(data.slice(1));

      // 篩選條件
      if (params.search) {
        const search = params.search.toLowerCase();
        templates = templates.filter(template => 
          template.name.toLowerCase().includes(search) ||
          template.description?.toLowerCase().includes(search) ||
          template.tags?.toLowerCase().includes(search)
        );
      }

      if (params.type) {
        templates = templates.filter(template => template.type === params.type);
      }

      if (params.difficulty) {
        templates = templates.filter(template => template.difficulty === params.difficulty);
      }

      if (params.visibility) {
        templates = templates.filter(template => template.visibility === params.visibility);
      }

      if (params.user_id) {
        templates = templates.filter(template => template.user_id === params.user_id);
      }

      if (params.is_favorite !== undefined && userId) {
        templates = templates.filter(template => 
          template.user_id === userId && template.is_favorite === params.is_favorite
        );
      }

      if (params.tags && params.tags.length > 0) {
        templates = templates.filter(template => {
          if (!template.tags) return false;
          const templateTags = JSON.parse(template.tags);
          return params.tags!.some(tag => templateTags.includes(tag));
        });
      }

      // 權限過濾：只能看到公開的或自己的範本
      if (userId) {
        templates = templates.filter(template => 
          template.visibility === TemplateVisibility.PUBLIC || 
          template.user_id === userId
        );
      } else {
        templates = templates.filter(template => 
          template.visibility === TemplateVisibility.PUBLIC
        );
      }

      // 排序
      const sortBy = params.sort_by || 'created_at';
      const sortOrder = params.sort_order || 'desc';
      
      templates.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (sortBy) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'use_count':
            aVal = a.use_count;
            bVal = b.use_count;
            break;
          case 'rating':
            aVal = a.rating;
            bVal = b.rating;
            break;
          case 'last_used_at':
            aVal = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
            bVal = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
            break;
          default:
            aVal = new Date(a.created_at).getTime();
            bVal = new Date(b.created_at).getTime();
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // 分頁
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return templates.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  // 取得單一範本詳情
  async getTemplateById(templateId: string, userId?: string): Promise<TemplateWithDetails | null> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template) return null;

      // 權限檢查
      if (template.visibility === TemplateVisibility.PRIVATE && template.user_id !== userId) {
        throw new Error('無權限訪問此範本');
      }

      const exercises = await this.getTemplateExercises(templateId);
      const exercisesWithDetails = await Promise.all(
        exercises.map(async (te) => {
          const exercise = await exerciseService.getExerciseById(te.exercise_id);
          return {
            ...te,
            exercise: exercise!
          } as TemplateExerciseWithDetails;
        })
      );

      return {
        ...template,
        target_muscle_groups: template.target_muscle_groups ? JSON.parse(template.target_muscle_groups) : [],
        tags: template.tags ? JSON.parse(template.tags) : [],
        exercises: exercisesWithDetails
      };
    } catch (error) {
      console.error('Error getting template by id:', error);
      throw error;
    }
  }

  // 創建範本
  async createTemplate(userId: string, templateData: CreateTemplateRequest): Promise<Template> {
    try {
      const templateId = uuidv4();
      const now = new Date().toISOString();

      const template: Template = {
        template_id: templateId,
        user_id: userId,
        name: templateData.name,
        description: templateData.description,
        type: templateData.type,
        difficulty: templateData.difficulty,
        visibility: templateData.visibility || TemplateVisibility.PRIVATE,
        estimated_duration: templateData.estimated_duration || 60,
        target_muscle_groups: templateData.target_muscle_groups ? JSON.stringify(templateData.target_muscle_groups) : undefined,
        tags: templateData.tags ? JSON.stringify(templateData.tags) : undefined,
        use_count: 0,
        rating: 0,
        rating_count: 0,
        last_used_at: undefined,
        is_favorite: false,
        created_at: now,
        updated_at: now
      };

      const row = this.templateToSheetRow(template);
      await googleSheets.appendData(this.TEMPLATES_RANGE, [row]);

      return template;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  // 更新範本
  async updateTemplate(templateId: string, userId: string, updateData: UpdateTemplateRequest): Promise<Template> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template) {
        throw new Error('範本不存在');
      }

      if (template.user_id !== userId) {
        throw new Error('無權限修改此範本');
      }

      const updatedTemplate: Template = {
        ...template,
        name: updateData.name ?? template.name,
        description: updateData.description ?? template.description,
        type: updateData.type ?? template.type,
        difficulty: updateData.difficulty ?? template.difficulty,
        visibility: updateData.visibility ?? template.visibility,
        estimated_duration: updateData.estimated_duration ?? template.estimated_duration,
        target_muscle_groups: updateData.target_muscle_groups ? JSON.stringify(updateData.target_muscle_groups) : template.target_muscle_groups,
        tags: updateData.tags ? JSON.stringify(updateData.tags) : template.tags,
        updated_at: new Date().toISOString()
      };

      await this.updateTemplateInSheets(updatedTemplate);
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  // 刪除範本
  async deleteTemplate(templateId: string, userId: string): Promise<void> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template) {
        throw new Error('範本不存在');
      }

      if (template.user_id !== userId) {
        throw new Error('無權限刪除此範本');
      }

      // 刪除範本動作
      await this.deleteAllTemplateExercises(templateId);

      // 刪除範本
      await this.deleteTemplateFromSheets(templateId);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  // 添加動作到範本
  async addExerciseToTemplate(templateId: string, userId: string, exerciseData: AddTemplateExerciseRequest): Promise<TemplateExercise> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template || template.user_id !== userId) {
        throw new Error('範本不存在或無權限');
      }

      const exercise = await exerciseService.getExerciseById(exerciseData.exercise_id);
      if (!exercise) {
        throw new Error('動作不存在');
      }

      const templateExerciseId = uuidv4();
      const existingExercises = await this.getTemplateExercises(templateId);
      const order = existingExercises.length + 1;

      const templateExercise: TemplateExercise = {
        template_exercise_id: templateExerciseId,
        template_id: templateId,
        exercise_id: exerciseData.exercise_id,
        target_sets: exerciseData.target_sets,
        target_reps: exerciseData.target_reps,
        target_weight: exerciseData.target_weight,
        rest_time: exerciseData.rest_time,
        order: order,
        notes: exerciseData.notes,
        created_at: new Date().toISOString()
      };

      const row = this.templateExerciseToSheetRow(templateExercise);
      await googleSheets.appendData(this.TEMPLATE_EXERCISES_RANGE, [row]);

      return templateExercise;
    } catch (error) {
      console.error('Error adding exercise to template:', error);
      throw error;
    }
  }

  // 更新範本動作
  async updateTemplateExercise(
    templateId: string, 
    exerciseId: string, 
    userId: string, 
    updateData: UpdateTemplateExerciseRequest
  ): Promise<TemplateExercise> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template || template.user_id !== userId) {
        throw new Error('範本不存在或無權限');
      }

      const templateExercise = await this.getTemplateExerciseById(exerciseId);
      if (!templateExercise || templateExercise.template_id !== templateId) {
        throw new Error('範本動作不存在');
      }

      const updatedTemplateExercise: TemplateExercise = {
        ...templateExercise,
        target_sets: updateData.target_sets ?? templateExercise.target_sets,
        target_reps: updateData.target_reps ?? templateExercise.target_reps,
        target_weight: updateData.target_weight ?? templateExercise.target_weight,
        rest_time: updateData.rest_time ?? templateExercise.rest_time,
        notes: updateData.notes ?? templateExercise.notes
      };

      await this.updateTemplateExerciseInSheets(updatedTemplateExercise);
      return updatedTemplateExercise;
    } catch (error) {
      console.error('Error updating template exercise:', error);
      throw error;
    }
  }

  // 移除範本動作
  async removeExerciseFromTemplate(templateId: string, exerciseId: string, userId: string): Promise<void> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template || template.user_id !== userId) {
        throw new Error('範本不存在或無權限');
      }

      await this.deleteTemplateExerciseFromSheets(exerciseId);
      
      // 重新排序其他動作
      await this.reorderTemplateExercises(templateId);
    } catch (error) {
      console.error('Error removing exercise from template:', error);
      throw error;
    }
  }

  // 套用範本開始訓練
  async applyTemplate(templateId: string, userId: string, applyData: ApplyTemplateRequest): Promise<string> {
    try {
      const template = await this.getTemplateById(templateId, userId);
      if (!template) {
        throw new Error('範本不存在或無權限訪問');
      }

      // 創建新的訓練
      const workoutTitle = applyData.title || `${template.name} - ${new Date().toLocaleDateString()}`;
      const workout = await workoutService.createWorkout(userId, {
        title: workoutTitle,
        template_id: templateId,
        notes: applyData.notes
      });

      // 添加範本中的所有動作到訓練
      for (const templateExercise of template.exercises) {
        const workoutExercise = await workoutService.addExerciseToWorkout(
          workout.workout_id,
          userId,
          {
            exercise_id: templateExercise.exercise_id,
            notes: templateExercise.notes
          }
        );

        // 根據範本設定創建組數
        for (let i = 1; i <= templateExercise.target_sets; i++) {
          if (workoutExercise) {
            await workoutService.addSet(
              userId,
              workout.workout_id,
              workoutExercise.workout_exercise_id,
              {
                weight: templateExercise.target_weight || 0,
                reps: parseInt(templateExercise.target_reps.split('-')[0]) || 10,
                notes: `目標: ${templateExercise.target_reps} reps`
              }
            );
          }
        }
      }

      // 更新範本使用統計
      await this.incrementTemplateUsage(templateId);

      return workout.workout_id;
    } catch (error) {
      console.error('Error applying template:', error);
      throw error;
    }
  }

  // 複製範本
  async duplicateTemplate(templateId: string, userId: string, duplicateData: DuplicateTemplateRequest): Promise<Template> {
    try {
      const originalTemplate = await this.getTemplateById(templateId, userId);
      if (!originalTemplate) {
        throw new Error('範本不存在或無權限訪問');
      }

      const newTemplateName = duplicateData.name || `${originalTemplate.name} (副本)`;
      const newVisibility = duplicateData.visibility || TemplateVisibility.PRIVATE;

      // 創建新範本
      const newTemplate = await this.createTemplate(userId, {
        name: newTemplateName,
        description: originalTemplate.description,
        type: originalTemplate.type,
        difficulty: originalTemplate.difficulty,
        visibility: newVisibility,
        estimated_duration: originalTemplate.estimated_duration,
        target_muscle_groups: originalTemplate.target_muscle_groups,
        tags: originalTemplate.tags
      });

      // 複製所有動作
      for (const exercise of originalTemplate.exercises) {
        await this.addExerciseToTemplate(newTemplate.template_id, userId, {
          exercise_id: exercise.exercise_id,
          target_sets: exercise.target_sets,
          target_reps: exercise.target_reps,
          target_weight: exercise.target_weight,
          rest_time: exercise.rest_time,
          notes: exercise.notes
        });
      }

      return newTemplate;
    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  }

  // 切換範本收藏狀態
  async toggleTemplateFavorite(templateId: string, userId: string, isFavorite: boolean): Promise<void> {
    try {
      const template = await this.getTemplateByIdSimple(templateId);
      if (!template) {
        throw new Error('範本不存在');
      }

      // 只有自己的範本可以設為收藏
      if (template.user_id !== userId) {
        throw new Error('只能收藏自己的範本');
      }

      const updatedTemplate = {
        ...template,
        is_favorite: isFavorite,
        updated_at: new Date().toISOString()
      };

      await this.updateTemplateInSheets(updatedTemplate);
    } catch (error) {
      console.error('Error toggling template favorite:', error);
      throw error;
    }
  }

  // 取得熱門範本
  async getPopularTemplates(limit: number = 10): Promise<Template[]> {
    try {
      const templates = await this.getTemplates({
        visibility: TemplateVisibility.PUBLIC,
        sort_by: 'use_count',
        sort_order: 'desc',
        limit
      });
      return templates;
    } catch (error) {
      console.error('Error getting popular templates:', error);
      throw error;
    }
  }

  // 取得範本統計
  async getTemplateStats(userId: string): Promise<TemplateStats> {
    try {
      const allTemplates = await this.getTemplates({ user_id: userId });
      
      const stats: TemplateStats = {
        total_templates: allTemplates.length,
        public_templates: allTemplates.filter(t => t.visibility === TemplateVisibility.PUBLIC).length,
        private_templates: allTemplates.filter(t => t.visibility === TemplateVisibility.PRIVATE).length,
        favorite_templates: allTemplates.filter(t => t.is_favorite).length,
        recent_templates: allTemplates
          .filter(t => t.last_used_at)
          .sort((a, b) => new Date(b.last_used_at!).getTime() - new Date(a.last_used_at!).getTime())
          .slice(0, 5)
          .map(t => ({
            template_id: t.template_id,
            name: t.name,
            last_used_at: t.last_used_at!
          })),
        template_types: Object.values(TemplateType).map(type => ({
          type,
          count: allTemplates.filter(t => t.type === type).length
        })).filter(t => t.count > 0)
      };

      // 最常用的範本
      const mostUsed = allTemplates.reduce((prev, current) => 
        (prev.use_count > current.use_count) ? prev : current
      );
      
      if (mostUsed && mostUsed.use_count > 0) {
        stats.most_used_template = {
          template_id: mostUsed.template_id,
          name: mostUsed.name,
          use_count: mostUsed.use_count
        };
      }

      return stats;
    } catch (error) {
      console.error('Error getting template stats:', error);
      throw error;
    }
  }

  // 私有輔助方法
  private async getTemplateByIdSimple(templateId: string): Promise<Template | null> {
    const data = await googleSheets.readData(this.TEMPLATES_RANGE);
    if (!data || data.length <= 1) return null;

    const templates = this.parseTemplatesFromSheets(data.slice(1));
    return templates.find(t => t.template_id === templateId) || null;
  }

  private async getTemplateExercises(templateId: string): Promise<TemplateExercise[]> {
    const data = await googleSheets.readData(this.TEMPLATE_EXERCISES_RANGE);
    if (!data || data.length <= 1) return [];

    const exercises = this.parseTemplateExercisesFromSheets(data.slice(1));
    return exercises
      .filter(e => e.template_id === templateId)
      .sort((a, b) => a.order - b.order);
  }

  private async getTemplateExerciseById(exerciseId: string): Promise<TemplateExercise | null> {
    const data = await googleSheets.readData(this.TEMPLATE_EXERCISES_RANGE);
    if (!data || data.length <= 1) return null;

    const exercises = this.parseTemplateExercisesFromSheets(data.slice(1));
    return exercises.find(e => e.template_exercise_id === exerciseId) || null;
  }

  private async incrementTemplateUsage(templateId: string): Promise<void> {
    const template = await this.getTemplateByIdSimple(templateId);
    if (!template) return;

    const updatedTemplate = {
      ...template,
      use_count: template.use_count + 1,
      last_used_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.updateTemplateInSheets(updatedTemplate);
  }

  private async updateTemplateInSheets(template: Template): Promise<void> {
    const data = await googleSheets.readData(this.TEMPLATES_RANGE);
    if (!data || data.length <= 1) return;

    const rowIndex = data.findIndex((row: any, index: number) => 
      index > 0 && row[0] === template.template_id
    );

    if (rowIndex > 0) {
      const updatedRow = this.templateToSheetRow(template);
      const range = `Templates!A${rowIndex + 1}:T${rowIndex + 1}`;
      await googleSheets.writeData(range, [updatedRow]);
    }
  }

  private async updateTemplateExerciseInSheets(templateExercise: TemplateExercise): Promise<void> {
    const data = await googleSheets.readData(this.TEMPLATE_EXERCISES_RANGE);
    if (!data || data.length <= 1) return;

    const rowIndex = data.findIndex((row: any, index: number) => 
      index > 0 && row[0] === templateExercise.template_exercise_id
    );

    if (rowIndex > 0) {
      const updatedRow = this.templateExerciseToSheetRow(templateExercise);
      const range = `TemplateExercises!A${rowIndex + 1}:J${rowIndex + 1}`;
      await googleSheets.writeData(range, [updatedRow]);
    }
  }

  private async deleteTemplateFromSheets(templateId: string): Promise<void> {
    const data = await googleSheets.readData(this.TEMPLATES_RANGE);
    if (!data || data.length <= 1) return;

    const filteredData = data.filter((row: any, index: number) => 
      index === 0 || row[0] !== templateId
    );

    await googleSheets.clearData(this.TEMPLATES_RANGE);
    if (filteredData.length > 0) {
      await googleSheets.writeData(this.TEMPLATES_RANGE, filteredData);
    }
  }

  private async deleteTemplateExerciseFromSheets(exerciseId: string): Promise<void> {
    const data = await googleSheets.readData(this.TEMPLATE_EXERCISES_RANGE);
    if (!data || data.length <= 1) return;

    const filteredData = data.filter((row: any, index: number) => 
      index === 0 || row[0] !== exerciseId
    );

    await googleSheets.clearData(this.TEMPLATE_EXERCISES_RANGE);
    if (filteredData.length > 0) {
      await googleSheets.writeData(this.TEMPLATE_EXERCISES_RANGE, filteredData);
    }
  }

  private async deleteAllTemplateExercises(templateId: string): Promise<void> {
    const data = await googleSheets.readData(this.TEMPLATE_EXERCISES_RANGE);
    if (!data || data.length <= 1) return;

    const filteredData = data.filter((row: any, index: number) => 
      index === 0 || row[1] !== templateId
    );

    await googleSheets.clearData(this.TEMPLATE_EXERCISES_RANGE);
    if (filteredData.length > 0) {
      await googleSheets.writeData(this.TEMPLATE_EXERCISES_RANGE, filteredData);
    }
  }

  private async reorderTemplateExercises(templateId: string): Promise<void> {
    const exercises = await this.getTemplateExercises(templateId);
    
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      if (exercise.order !== i + 1) {
        exercise.order = i + 1;
        await this.updateTemplateExerciseInSheets(exercise);
      }
    }
  }

  private parseTemplatesFromSheets(rows: any[][]): Template[] {
    return rows.map((row: any) => ({
      template_id: row[0] || '',
      user_id: row[1] || '',
      name: row[2] || '',
      description: row[3] || undefined,
      type: row[4] as TemplateType || TemplateType.STRENGTH,
      difficulty: row[5] as TemplateDifficulty || TemplateDifficulty.BEGINNER,
      visibility: row[6] as TemplateVisibility || TemplateVisibility.PRIVATE,
      estimated_duration: parseInt(row[7]) || 60,
      target_muscle_groups: row[8] || undefined,
      tags: row[9] || undefined,
      use_count: parseInt(row[10]) || 0,
      rating: parseFloat(row[11]) || 0,
      rating_count: parseInt(row[12]) || 0,
      last_used_at: row[13] || undefined,
      is_favorite: row[14] === 'true',
      created_at: row[15] || new Date().toISOString(),
      updated_at: row[16] || new Date().toISOString()
    }));
  }

  private parseTemplateExercisesFromSheets(rows: any[][]): TemplateExercise[] {
    return rows.map((row: any) => ({
      template_exercise_id: row[0] || '',
      template_id: row[1] || '',
      exercise_id: row[2] || '',
      target_sets: parseInt(row[3]) || 1,
      target_reps: row[4] || '10',
      target_weight: row[5] ? parseFloat(row[5]) : undefined,
      rest_time: row[6] ? parseInt(row[6]) : undefined,
      order: parseInt(row[7]) || 1,
      notes: row[8] || undefined,
      created_at: row[9] || new Date().toISOString()
    }));
  }

  private templateToSheetRow(template: Template): any[] {
    return [
      template.template_id,
      template.user_id,
      template.name,
      template.description || '',
      template.type,
      template.difficulty,
      template.visibility,
      template.estimated_duration.toString(),
      template.target_muscle_groups || '',
      template.tags || '',
      template.use_count.toString(),
      template.rating.toString(),
      template.rating_count.toString(),
      template.last_used_at || '',
      template.is_favorite.toString(),
      template.created_at,
      template.updated_at
    ];
  }

  private templateExerciseToSheetRow(exercise: TemplateExercise): any[] {
    return [
      exercise.template_exercise_id,
      exercise.template_id,
      exercise.exercise_id,
      exercise.target_sets.toString(),
      exercise.target_reps,
      exercise.target_weight?.toString() || '',
      exercise.rest_time?.toString() || '',
      exercise.order.toString(),
      exercise.notes || '',
      exercise.created_at
    ];
  }
}

export default new TemplateService();