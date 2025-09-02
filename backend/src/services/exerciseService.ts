import { v4 as uuidv4 } from 'uuid';
import GoogleSheetsService from './googleSheets';
import { 
  Exercise, 
  CreateExerciseRequest, 
  UpdateExerciseRequest, 
  ExerciseSearchParams 
} from '../types';

class ExerciseService {
  private sheetName = 'Exercises';
  private headers = [
    'exercise_id', 
    'name', 
    'primary_muscle', 
    'secondary_muscles', 
    'category', 
    'description', 
    'instructions', 
    'is_system', 
    'user_id', 
    'created_at'
  ];

  // 初始化動作工作表
  async initializeExerciseSheet(): Promise<void> {
    try {
      // 檢查工作表是否已有標題
      const existingData = await GoogleSheetsService.readData(`${this.sheetName}!A1:J1`);
      
      if (existingData.length === 0 || !existingData[0].includes('exercise_id')) {
        // 添加標題行
        await GoogleSheetsService.writeData(`${this.sheetName}!A1:J1`, [this.headers]);
        console.log('動作工作表標題已初始化');
      }
    } catch (error) {
      console.error('初始化動作工作表失敗:', error);
      throw error;
    }
  }

  // 初始化系統內建動作
  async initializeSystemExercises(): Promise<void> {
    try {
      // 檢查是否已有系統動作
      const existingExercises = await this.getAllExercises({ is_system: true });
      
      if (existingExercises.length > 0) {
        console.log('系統動作已存在，跳過初始化');
        return;
      }

      const systemExercises = this.getSystemExercisesData();
      
      for (const exercise of systemExercises) {
        await this.createExercise(exercise, true);
      }
      
      console.log(`已初始化 ${systemExercises.length} 個系統內建動作`);
    } catch (error) {
      console.error('初始化系統動作失敗:', error);
      throw error;
    }
  }

  // 取得系統內建動作資料
  private getSystemExercisesData(): CreateExerciseRequest[] {
    return [
      {
        name: '深蹲',
        primary_muscle: '腿部',
        secondary_muscles: '臀部,核心',
        category: '複合動作',
        description: '基礎下肢力量訓練動作',
        instructions: '雙腳與肩同寬，蹲下時膝蓋不超過腳尖，保持背部挺直'
      },
      {
        name: '臥推',
        primary_muscle: '胸部',
        secondary_muscles: '三頭肌,前三角肌',
        category: '複合動作',
        description: '上肢推力訓練的經典動作',
        instructions: '躺在臥推椅上，雙手握槓，慢慢下降至胸部後推起'
      },
      {
        name: '硬舉',
        primary_muscle: '背部',
        secondary_muscles: '腿部,臀部,核心',
        category: '複合動作',
        description: '全身性力量訓練動作',
        instructions: '雙腳與髖同寬，保持背部挺直，以髖部為軸心拉起'
      },
      {
        name: '引體向上',
        primary_muscle: '背部',
        secondary_muscles: '二頭肌,核心',
        category: '複合動作',
        description: '上肢拉力訓練動作',
        instructions: '懸掛在單槓上，拉起身體直到下巴超過單槓'
      },
      {
        name: '肩推',
        primary_muscle: '肩部',
        secondary_muscles: '三頭肌,核心',
        category: '複合動作',
        description: '肩部力量訓練動作',
        instructions: '站立或坐姿，將重量從肩部推至頭頂上方'
      },
      {
        name: '划船',
        primary_muscle: '背部',
        secondary_muscles: '二頭肌,後三角肌',
        category: '複合動作',
        description: '背部中段訓練動作',
        instructions: '俯身或坐姿，將重量拉向身體'
      },
      {
        name: '二頭肌彎舉',
        primary_muscle: '二頭肌',
        secondary_muscles: '',
        category: '單關節動作',
        description: '二頭肌孤立訓練動作',
        instructions: '保持上臂不動，彎曲前臂將重量舉起'
      },
      {
        name: '三頭肌下壓',
        primary_muscle: '三頭肌',
        secondary_muscles: '',
        category: '單關節動作',
        description: '三頭肌孤立訓練動作',
        instructions: '保持上臂不動，向下壓動重量'
      },
      {
        name: '側平舉',
        primary_muscle: '肩部',
        secondary_muscles: '',
        category: '單關節動作',
        description: '三角肌中束訓練動作',
        instructions: '雙臂側舉至與肩平行'
      },
      {
        name: '腿舉',
        primary_muscle: '腿部',
        secondary_muscles: '臀部',
        category: '複合動作',
        description: '下肢力量訓練機械動作',
        instructions: '坐在腿舉機上，雙腳推動重量'
      }
    ];
  }

  // 創建動作
  async createExercise(exerciseData: CreateExerciseRequest, isSystem = false, userId?: string): Promise<Exercise> {
    try {
      const exerciseId = uuidv4();
      const now = new Date().toISOString();
      
      const exercise: Exercise = {
        exercise_id: exerciseId,
        name: exerciseData.name,
        primary_muscle: exerciseData.primary_muscle,
        secondary_muscles: exerciseData.secondary_muscles || '',
        category: exerciseData.category,
        description: exerciseData.description || '',
        instructions: exerciseData.instructions || '',
        is_system: isSystem,
        user_id: isSystem ? undefined : userId,
        created_at: now
      };

      const row = [
        exercise.exercise_id,
        exercise.name,
        exercise.primary_muscle,
        exercise.secondary_muscles,
        exercise.category,
        exercise.description,
        exercise.instructions,
        exercise.is_system.toString(),
        exercise.user_id || '',
        exercise.created_at
      ];

      await GoogleSheetsService.appendData(`${this.sheetName}!A:J`, [row]);
      
      return exercise;
    } catch (error) {
      console.error('創建動作失敗:', error);
      throw error;
    }
  }

  // 取得動作列表
  async getAllExercises(params: ExerciseSearchParams = {}): Promise<Exercise[]> {
    try {
      const data = await GoogleSheetsService.readData(`${this.sheetName}!A2:J`);
      
      if (!data || data.length === 0) {
        return [];
      }

      let exercises: Exercise[] = data.map((row: any[]) => ({
        exercise_id: row[0] || '',
        name: row[1] || '',
        primary_muscle: row[2] || '',
        secondary_muscles: row[3] || '',
        category: row[4] || '',
        description: row[5] || '',
        instructions: row[6] || '',
        is_system: row[7] === 'true',
        user_id: row[8] || undefined,
        created_at: row[9] || ''
      }));

      // 應用篩選條件
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        exercises = exercises.filter(exercise => 
          exercise.name.toLowerCase().includes(searchLower) ||
          exercise.primary_muscle.toLowerCase().includes(searchLower) ||
          exercise.category.toLowerCase().includes(searchLower)
        );
      }

      if (params.category) {
        exercises = exercises.filter(exercise => exercise.category === params.category);
      }

      if (params.primary_muscle) {
        exercises = exercises.filter(exercise => exercise.primary_muscle === params.primary_muscle);
      }

      if (params.is_system !== undefined) {
        exercises = exercises.filter(exercise => exercise.is_system === params.is_system);
      }

      // 分頁
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return exercises.slice(startIndex, endIndex);
    } catch (error) {
      console.error('取得動作列表失敗:', error);
      throw error;
    }
  }

  // 根據 ID 取得動作
  async getExerciseById(exerciseId: string): Promise<Exercise | null> {
    try {
      const exercises = await this.getAllExercises();
      return exercises.find(exercise => exercise.exercise_id === exerciseId) || null;
    } catch (error) {
      console.error('取得動作失敗:', error);
      throw error;
    }
  }

  // 更新動作
  async updateExercise(exerciseId: string, updateData: UpdateExerciseRequest, userId: string): Promise<Exercise | null> {
    try {
      const data = await GoogleSheetsService.readData(`${this.sheetName}!A2:J`);
      
      if (!data || data.length === 0) {
        return null;
      }

      const exerciseIndex = data.findIndex((row: any[]) => row[0] === exerciseId);
      
      if (exerciseIndex === -1) {
        return null;
      }

      const exerciseRow = data[exerciseIndex];
      const isSystem = exerciseRow[7] === 'true';
      const exerciseUserId = exerciseRow[8];

      // 檢查權限：系統動作不能修改，自訂動作只能由創建者修改
      if (isSystem || (exerciseUserId && exerciseUserId !== userId)) {
        throw new Error('沒有權限修改此動作');
      }

      // 更新資料
      const updatedExercise: Exercise = {
        exercise_id: exerciseRow[0],
        name: updateData.name || exerciseRow[1],
        primary_muscle: updateData.primary_muscle || exerciseRow[2],
        secondary_muscles: updateData.secondary_muscles !== undefined ? updateData.secondary_muscles : exerciseRow[3],
        category: updateData.category || exerciseRow[4],
        description: updateData.description !== undefined ? updateData.description : exerciseRow[5],
        instructions: updateData.instructions !== undefined ? updateData.instructions : exerciseRow[6],
        is_system: isSystem,
        user_id: exerciseUserId || undefined,
        created_at: exerciseRow[9]
      };

      const updatedRow = [
        updatedExercise.exercise_id,
        updatedExercise.name,
        updatedExercise.primary_muscle,
        updatedExercise.secondary_muscles,
        updatedExercise.category,
        updatedExercise.description,
        updatedExercise.instructions,
        updatedExercise.is_system.toString(),
        updatedExercise.user_id || '',
        updatedExercise.created_at
      ];

      // 更新 Google Sheets 中的行（+2 因為從第2行開始，且索引從0開始）
      const rowNumber = exerciseIndex + 2;
      await GoogleSheetsService.writeData(`${this.sheetName}!A${rowNumber}:J${rowNumber}`, [updatedRow]);

      return updatedExercise;
    } catch (error) {
      console.error('更新動作失敗:', error);
      throw error;
    }
  }

  // 刪除動作
  async deleteExercise(exerciseId: string, userId: string): Promise<boolean> {
    try {
      const data = await GoogleSheetsService.readData(`${this.sheetName}!A2:J`);
      
      if (!data || data.length === 0) {
        return false;
      }

      const exerciseIndex = data.findIndex((row: any[]) => row[0] === exerciseId);
      
      if (exerciseIndex === -1) {
        return false;
      }

      const exerciseRow = data[exerciseIndex];
      const isSystem = exerciseRow[7] === 'true';
      const exerciseUserId = exerciseRow[8];

      // 檢查權限：系統動作不能刪除，自訂動作只能由創建者刪除
      if (isSystem || (exerciseUserId && exerciseUserId !== userId)) {
        throw new Error('沒有權限刪除此動作');
      }

      // 移除該行資料
      data.splice(exerciseIndex, 1);
      
      // 清空工作表並重新寫入（保留標題）
      await GoogleSheetsService.clearData(`${this.sheetName}!A2:J`);
      
      if (data.length > 0) {
        await GoogleSheetsService.writeData(`${this.sheetName}!A2:J`, data);
      }

      return true;
    } catch (error) {
      console.error('刪除動作失敗:', error);
      throw error;
    }
  }

  // 取得用戶的自訂動作
  async getUserExercises(userId: string): Promise<Exercise[]> {
    try {
      return await this.getAllExercises({ is_system: false });
    } catch (error) {
      console.error('取得用戶動作失敗:', error);
      throw error;
    }
  }

  // 取得動作數量統計
  async getExerciseStats(): Promise<{ total: number; system: number; custom: number }> {
    try {
      const allExercises = await this.getAllExercises();
      const systemExercises = allExercises.filter(exercise => exercise.is_system);
      const customExercises = allExercises.filter(exercise => !exercise.is_system);

      return {
        total: allExercises.length,
        system: systemExercises.length,
        custom: customExercises.length
      };
    } catch (error) {
      console.error('取得動作統計失敗:', error);
      throw error;
    }
  }
}

export default new ExerciseService();