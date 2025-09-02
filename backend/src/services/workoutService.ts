import { v4 as uuidv4 } from 'uuid';
import googleSheetsService from './googleSheets';
import exerciseService from './exerciseService';
import {
  Workout,
  WorkoutExercise,
  Set,
  WorkoutWithDetails,
  WorkoutExerciseWithDetails,
  WorkoutStatus,
  CreateWorkoutRequest,
  UpdateWorkoutRequest,
  AddWorkoutExerciseRequest,
  UpdateWorkoutExerciseRequest,
  AddSetRequest,
  UpdateSetRequest,
  WorkoutSearchParams,
  WorkoutStats,
  Exercise
} from '../types';

class WorkoutService {
  private readonly WORKOUTS_RANGE = 'Workouts!A:P';
  private readonly WORKOUT_EXERCISES_RANGE = 'WorkoutExercises!A:H';
  private readonly SETS_RANGE = 'Sets!A:J';

  /**
   * 初始化訓練相關的工作表
   */
  async initializeWorkoutSheets(): Promise<void> {
    try {
      console.log('初始化訓練工作表...');
      
      // 初始化訓練表
      await this.initializeWorkoutsSheet();
      console.log('Workouts 表初始化完成');
      
      // 初始化訓練動作表
      await this.initializeWorkoutExercisesSheet();
      console.log('WorkoutExercises 表初始化完成');
      
      // 初始化組數表
      await this.initializeSetsSheet();
      console.log('Sets 表初始化完成');
      
    } catch (error) {
      console.error('訓練工作表初始化失敗:', error);
      throw error;
    }
  }

  private async initializeWorkoutsSheet(): Promise<void> {
    try {
      const data = await googleSheetsService.readData(this.WORKOUTS_RANGE);
      if (data.length === 0) {
        // 創建標題行
        const headers = [
          'workout_id',
          'user_id', 
          'title',
          'date',
          'start_time',
          'end_time',
          'duration',
          'status',
          'total_volume',
          'total_sets',
          'total_reps',
          'notes',
          'created_at',
          'updated_at'
        ];
        await googleSheetsService.writeData(this.WORKOUTS_RANGE, [headers]);
      }
    } catch (error) {
      console.error('初始化 Workouts 表失敗:', error);
      throw error;
    }
  }

  private async initializeWorkoutExercisesSheet(): Promise<void> {
    try {
      const data = await googleSheetsService.readData(this.WORKOUT_EXERCISES_RANGE);
      if (data.length === 0) {
        // 創建標題行
        const headers = [
          'workout_exercise_id',
          'workout_id',
          'exercise_id',
          'order',
          'notes',
          'created_at'
        ];
        await googleSheetsService.writeData(this.WORKOUT_EXERCISES_RANGE, [headers]);
      }
    } catch (error) {
      console.error('初始化 WorkoutExercises 表失敗:', error);
      throw error;
    }
  }

  private async initializeSetsSheet(): Promise<void> {
    try {
      const data = await googleSheetsService.readData(this.SETS_RANGE);
      if (data.length === 0) {
        // 創建標題行
        const headers = [
          'set_id',
          'workout_exercise_id',
          'set_number',
          'weight',
          'reps',
          'completed',
          'rest_time',
          'notes',
          'completed_at',
          'created_at'
        ];
        await googleSheetsService.writeData(this.SETS_RANGE, [headers]);
      }
    } catch (error) {
      console.error('初始化 Sets 表失敗:', error);
      throw error;
    }
  }

  /**
   * 創建新訓練
   */
  async createWorkout(userId: string, data: CreateWorkoutRequest): Promise<Workout> {
    const workoutId = uuidv4();
    const now = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0];

    const workout: Workout = {
      workout_id: workoutId,
      user_id: userId,
      title: data.title,
      date,
      start_time: now,
      end_time: undefined,
      duration: 0,
      status: WorkoutStatus.ACTIVE,
      total_volume: 0,
      total_sets: 0,
      total_reps: 0,
      notes: data.notes || '',
      created_at: now,
      updated_at: now
    };

    // 如果有模板，複製模板的動作
    if (data.template_id) {
      await this.copyTemplateToWorkout(workoutId, data.template_id);
    }

    await this.saveWorkout(workout);
    return workout;
  }

  /**
   * 獲取訓練列表
   */
  async getWorkouts(userId: string, params: WorkoutSearchParams = {}): Promise<{
    workouts: Workout[];
    total: number;
    page: number;
    limit: number;
  }> {
    const allWorkouts = await this.getAllWorkouts();
    let filteredWorkouts = allWorkouts.filter(w => w.user_id === userId);

    // 應用篩選條件
    if (params.start_date) {
      filteredWorkouts = filteredWorkouts.filter(w => w.date >= params.start_date!);
    }
    if (params.end_date) {
      filteredWorkouts = filteredWorkouts.filter(w => w.date <= params.end_date!);
    }
    if (params.status) {
      filteredWorkouts = filteredWorkouts.filter(w => w.status === params.status);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredWorkouts = filteredWorkouts.filter(w => 
        w.title.toLowerCase().includes(searchLower) ||
        (w.notes && w.notes.toLowerCase().includes(searchLower))
      );
    }

    // 排序：最新的在前
    filteredWorkouts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 分頁
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    const paginatedWorkouts = filteredWorkouts.slice(offset, offset + limit);

    return {
      workouts: paginatedWorkouts,
      total: filteredWorkouts.length,
      page,
      limit
    };
  }

  /**
   * 獲取單一訓練詳情
   */
  async getWorkoutWithDetails(userId: string, workoutId: string): Promise<WorkoutWithDetails | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    const exercises = await this.getWorkoutExercisesWithDetails(workoutId);

    return {
      ...workout,
      exercises
    };
  }

  /**
   * 更新訓練
   */
  async updateWorkout(userId: string, workoutId: string, data: UpdateWorkoutRequest): Promise<Workout | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    const updatedWorkout: Workout = {
      ...workout,
      ...data,
      updated_at: new Date().toISOString()
    };

    await this.saveWorkout(updatedWorkout);
    return updatedWorkout;
  }

  /**
   * 完成訓練
   */
  async finishWorkout(userId: string, workoutId: string): Promise<Workout | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    const endTime = new Date().toISOString();
    const startTime = new Date(workout.start_time);
    const duration = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 1000);

    // 重新計算統計數據
    const stats = await this.calculateWorkoutStats(workoutId);

    const updatedWorkout: Workout = {
      ...workout,
      status: WorkoutStatus.COMPLETED,
      end_time: endTime,
      duration,
      total_volume: stats.total_volume,
      total_sets: stats.total_sets,
      total_reps: stats.total_reps,
      updated_at: new Date().toISOString()
    };

    await this.saveWorkout(updatedWorkout);
    return updatedWorkout;
  }

  /**
   * 刪除訓練
   */
  async deleteWorkout(userId: string, workoutId: string): Promise<boolean> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return false;
    }

    // 刪除相關的組數記錄
    await this.deleteSetsForWorkout(workoutId);
    
    // 刪除相關的訓練動作
    await this.deleteWorkoutExercisesForWorkout(workoutId);
    
    // 刪除訓練記錄
    await this.deleteWorkoutRecord(workoutId);

    return true;
  }

  /**
   * 添加動作到訓練
   */
  async addExerciseToWorkout(
    userId: string,
    workoutId: string,
    data: AddWorkoutExerciseRequest
  ): Promise<WorkoutExercise | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    // 檢查動作是否存在
    const exercise = await exerciseService.getExerciseById(data.exercise_id);
    if (!exercise) {
      throw new Error('動作不存在');
    }

    // 檢查是否已經添加過此動作
    const existingExercises = await this.getWorkoutExercises(workoutId);
    if (existingExercises.some(e => e.exercise_id === data.exercise_id)) {
      throw new Error('此動作已經添加到訓練中');
    }

    const workoutExerciseId = uuidv4();
    const order = existingExercises.length + 1;

    const workoutExercise: WorkoutExercise = {
      workout_exercise_id: workoutExerciseId,
      workout_id: workoutId,
      exercise_id: data.exercise_id,
      order,
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };

    await this.saveWorkoutExercise(workoutExercise);
    return workoutExercise;
  }

  /**
   * 更新訓練動作
   */
  async updateWorkoutExercise(
    userId: string,
    workoutId: string,
    exerciseId: string,
    data: UpdateWorkoutExerciseRequest
  ): Promise<WorkoutExercise | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    const workoutExercise = await this.getWorkoutExerciseByIds(workoutId, exerciseId);
    if (!workoutExercise) {
      return null;
    }

    const updatedWorkoutExercise: WorkoutExercise = {
      ...workoutExercise,
      ...data
    };

    await this.saveWorkoutExercise(updatedWorkoutExercise);
    return updatedWorkoutExercise;
  }

  /**
   * 移除訓練動作
   */
  async removeExerciseFromWorkout(
    userId: string,
    workoutId: string,
    exerciseId: string
  ): Promise<boolean> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return false;
    }

    const workoutExercise = await this.getWorkoutExerciseByIds(workoutId, exerciseId);
    if (!workoutExercise) {
      return false;
    }

    // 刪除相關的組數記錄
    await this.deleteSetsForWorkoutExercise(workoutExercise.workout_exercise_id);
    
    // 刪除訓練動作記錄
    await this.deleteWorkoutExerciseRecord(workoutExercise.workout_exercise_id);

    return true;
  }

  /**
   * 添加組數
   */
  async addSet(
    userId: string,
    workoutId: string,
    exerciseId: string,
    data: AddSetRequest
  ): Promise<Set | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    const workoutExercise = await this.getWorkoutExerciseByIds(workoutId, exerciseId);
    if (!workoutExercise) {
      return null;
    }

    const existingSets = await this.getSetsForWorkoutExercise(workoutExercise.workout_exercise_id);
    const setNumber = existingSets.length + 1;

    const set: Set = {
      set_id: uuidv4(),
      workout_exercise_id: workoutExercise.workout_exercise_id,
      set_number: setNumber,
      weight: data.weight,
      reps: data.reps,
      completed: true,
      rest_time: undefined,
      notes: data.notes || '',
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    await this.saveSet(set);
    
    // 更新訓練統計
    await this.updateWorkoutStats(workoutId);

    return set;
  }

  /**
   * 更新組數
   */
  async updateSet(
    userId: string,
    workoutId: string,
    exerciseId: string,
    setId: string,
    data: UpdateSetRequest
  ): Promise<Set | null> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return null;
    }

    const set = await this.getSetById(setId);
    if (!set) {
      return null;
    }

    const updatedSet: Set = {
      ...set,
      ...data,
      completed_at: data.completed ? new Date().toISOString() : set.completed_at
    };

    await this.saveSet(updatedSet);
    
    // 更新訓練統計
    await this.updateWorkoutStats(workoutId);

    return updatedSet;
  }

  /**
   * 刪除組數
   */
  async deleteSet(
    userId: string,
    workoutId: string,
    exerciseId: string,
    setId: string
  ): Promise<boolean> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout || workout.user_id !== userId) {
      return false;
    }

    const set = await this.getSetById(setId);
    if (!set) {
      return false;
    }

    await this.deleteSetRecord(setId);
    
    // 更新訓練統計
    await this.updateWorkoutStats(workoutId);

    return true;
  }

  /**
   * 獲取用戶訓練統計
   */
  async getWorkoutStats(userId: string, startDate?: string, endDate?: string): Promise<WorkoutStats> {
    const allWorkouts = await this.getAllWorkouts();
    let userWorkouts = allWorkouts.filter(w => w.user_id === userId && w.status === WorkoutStatus.COMPLETED);

    if (startDate) {
      userWorkouts = userWorkouts.filter(w => w.date >= startDate);
    }
    if (endDate) {
      userWorkouts = userWorkouts.filter(w => w.date <= endDate);
    }

    const totalWorkouts = userWorkouts.length;
    const totalDuration = userWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalVolume = userWorkouts.reduce((sum, w) => sum + w.total_volume, 0);
    const totalSets = userWorkouts.reduce((sum, w) => sum + w.total_sets, 0);
    const totalReps = userWorkouts.reduce((sum, w) => sum + w.total_reps, 0);
    const averageWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    // 計算最愛動作
    const exerciseUsage = new Map<string, number>();
    for (const workout of userWorkouts) {
      const exercises = await this.getWorkoutExercises(workout.workout_id);
      for (const exercise of exercises) {
        const count = exerciseUsage.get(exercise.exercise_id) || 0;
        exerciseUsage.set(exercise.exercise_id, count + 1);
      }
    }

    const favoriteExercises = [];
    for (const [exerciseId, count] of exerciseUsage.entries()) {
      const exercise = await exerciseService.getExerciseById(exerciseId);
      if (exercise) {
        favoriteExercises.push({
          exercise_id: exerciseId,
          name: exercise.name,
          count
        });
      }
    }
    favoriteExercises.sort((a, b) => b.count - a.count).splice(5); // 取前5個

    // 計算月度訓練量
    const monthlyVolume = new Map<string, number>();
    for (const workout of userWorkouts) {
      const month = workout.date.substring(0, 7); // YYYY-MM
      const volume = monthlyVolume.get(month) || 0;
      monthlyVolume.set(month, volume + workout.total_volume);
    }

    const monthlyVolumeArray = Array.from(monthlyVolume.entries())
      .map(([month, volume]) => ({ month, volume }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      total_workouts: totalWorkouts,
      total_duration: totalDuration,
      total_volume: totalVolume,
      total_sets: totalSets,
      total_reps: totalReps,
      average_workout_duration: averageWorkoutDuration,
      favorite_exercises: favoriteExercises,
      monthly_volume: monthlyVolumeArray
    };
  }

  // 私有方法 - Google Sheets 操作

  private async getAllWorkouts(): Promise<Workout[]> {
    try {
      const rows = await googleSheetsService.readData(this.WORKOUTS_RANGE);
      if (rows.length <= 1) return []; // 跳過標題行

      return rows.slice(1).map(this.parseWorkoutRow);
    } catch (error) {
      console.error('Error reading workouts:', error);
      return [];
    }
  }

  private async getWorkoutById(workoutId: string): Promise<Workout | null> {
    const workouts = await this.getAllWorkouts();
    return workouts.find(w => w.workout_id === workoutId) || null;
  }

  private async saveWorkout(workout: Workout): Promise<void> {
    const allWorkouts = await this.getAllWorkouts();
    const existingIndex = allWorkouts.findIndex(w => w.workout_id === workout.workout_id);
    
    const workoutRow = this.formatWorkoutRow(workout);

    if (existingIndex >= 0) {
      // 更新現有記錄
      const rowIndex = existingIndex + 2; // +1 for header, +1 for 1-indexed
      await googleSheetsService.writeData(`Workouts!A${rowIndex}:P${rowIndex}`, [workoutRow]);
    } else {
      // 新增記錄
      await googleSheetsService.appendData('Workouts!A:P', [workoutRow]);
    }
  }

  private async deleteWorkoutRecord(workoutId: string): Promise<void> {
    // 實作刪除邏輯（標記為已刪除或實際刪除行）
    const allWorkouts = await this.getAllWorkouts();
    const filteredWorkouts = allWorkouts.filter(w => w.workout_id !== workoutId);
    
    // 清空範圍並重新寫入
    await googleSheetsService.clearData(this.WORKOUTS_RANGE);
    const header = ['workout_id', 'user_id', 'title', 'date', 'start_time', 'end_time', 'duration', 'status', 'total_volume', 'total_sets', 'total_reps', 'notes', 'created_at', 'updated_at'];
    const rows = [header, ...filteredWorkouts.map(this.formatWorkoutRow)];
    await googleSheetsService.writeData(this.WORKOUTS_RANGE, rows);
  }

  private async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    try {
      const rows = await googleSheetsService.readData(this.WORKOUT_EXERCISES_RANGE);
      if (rows.length <= 1) return [];

      return rows.slice(1)
        .map(this.parseWorkoutExerciseRow)
        .filter((we: WorkoutExercise) => we.workout_id === workoutId)
        .sort((a: WorkoutExercise, b: WorkoutExercise) => a.order - b.order);
    } catch (error) {
      console.error('Error reading workout exercises:', error);
      return [];
    }
  }

  private async getWorkoutExercisesWithDetails(workoutId: string): Promise<WorkoutExerciseWithDetails[]> {
    const workoutExercises = await this.getWorkoutExercises(workoutId);
    const exercisesWithDetails: WorkoutExerciseWithDetails[] = [];

    for (const we of workoutExercises) {
      const exercise = await exerciseService.getExerciseById(we.exercise_id);
      const sets = await this.getSetsForWorkoutExercise(we.workout_exercise_id);

      if (exercise) {
        exercisesWithDetails.push({
          ...we,
          exercise,
          sets
        });
      }
    }

    return exercisesWithDetails;
  }

  private async getWorkoutExerciseByIds(workoutId: string, exerciseId: string): Promise<WorkoutExercise | null> {
    const workoutExercises = await this.getWorkoutExercises(workoutId);
    return workoutExercises.find(we => we.exercise_id === exerciseId) || null;
  }

  private async saveWorkoutExercise(workoutExercise: WorkoutExercise): Promise<void> {
    const allWorkoutExercises = await this.getAllWorkoutExercises();
    const existingIndex = allWorkoutExercises.findIndex(we => we.workout_exercise_id === workoutExercise.workout_exercise_id);
    
    const row = this.formatWorkoutExerciseRow(workoutExercise);

    if (existingIndex >= 0) {
      const rowIndex = existingIndex + 2;
      await googleSheetsService.writeData(`WorkoutExercises!A${rowIndex}:H${rowIndex}`, [row]);
    } else {
      await googleSheetsService.appendData('WorkoutExercises!A:H', [row]);
    }
  }

  private async getAllWorkoutExercises(): Promise<WorkoutExercise[]> {
    try {
      const rows = await googleSheetsService.readData(this.WORKOUT_EXERCISES_RANGE);
      if (rows.length <= 1) return [];

      return rows.slice(1).map(this.parseWorkoutExerciseRow);
    } catch (error) {
      console.error('Error reading workout exercises:', error);
      return [];
    }
  }

  private async deleteWorkoutExercisesForWorkout(workoutId: string): Promise<void> {
    const allWorkoutExercises = await this.getAllWorkoutExercises();
    const filteredExercises = allWorkoutExercises.filter(we => we.workout_id !== workoutId);
    
    await googleSheetsService.clearData(this.WORKOUT_EXERCISES_RANGE);
    const header = ['workout_exercise_id', 'workout_id', 'exercise_id', 'order', 'notes', 'created_at'];
    const rows = [header, ...filteredExercises.map(this.formatWorkoutExerciseRow)];
    await googleSheetsService.writeData(this.WORKOUT_EXERCISES_RANGE, rows);
  }

  private async deleteWorkoutExerciseRecord(workoutExerciseId: string): Promise<void> {
    const allWorkoutExercises = await this.getAllWorkoutExercises();
    const filteredExercises = allWorkoutExercises.filter(we => we.workout_exercise_id !== workoutExerciseId);
    
    await googleSheetsService.clearData(this.WORKOUT_EXERCISES_RANGE);
    const header = ['workout_exercise_id', 'workout_id', 'exercise_id', 'order', 'notes', 'created_at'];
    const rows = [header, ...filteredExercises.map(this.formatWorkoutExerciseRow)];
    await googleSheetsService.writeData(this.WORKOUT_EXERCISES_RANGE, rows);
  }

  private async getSetsForWorkoutExercise(workoutExerciseId: string): Promise<Set[]> {
    try {
      const rows = await googleSheetsService.readData(this.SETS_RANGE);
      if (rows.length <= 1) return [];

      return rows.slice(1)
        .map(this.parseSetRow)
        .filter((set: Set) => set.workout_exercise_id === workoutExerciseId)
        .sort((a: Set, b: Set) => a.set_number - b.set_number);
    } catch (error) {
      console.error('Error reading sets:', error);
      return [];
    }
  }

  private async getSetById(setId: string): Promise<Set | null> {
    const allSets = await this.getAllSets();
    return allSets.find(s => s.set_id === setId) || null;
  }

  private async getAllSets(): Promise<Set[]> {
    try {
      const rows = await googleSheetsService.readData(this.SETS_RANGE);
      if (rows.length <= 1) return [];

      return rows.slice(1).map(this.parseSetRow);
    } catch (error) {
      console.error('Error reading sets:', error);
      return [];
    }
  }

  private async saveSet(set: Set): Promise<void> {
    const allSets = await this.getAllSets();
    const existingIndex = allSets.findIndex(s => s.set_id === set.set_id);
    
    const row = this.formatSetRow(set);

    if (existingIndex >= 0) {
      const rowIndex = existingIndex + 2;
      await googleSheetsService.writeData(`Sets!A${rowIndex}:J${rowIndex}`, [row]);
    } else {
      await googleSheetsService.appendData('Sets!A:J', [row]);
    }
  }

  private async deleteSetsForWorkout(workoutId: string): Promise<void> {
    const workoutExercises = await this.getWorkoutExercises(workoutId);
    const workoutExerciseIds = workoutExercises.map(we => we.workout_exercise_id);
    
    const allSets = await this.getAllSets();
    const filteredSets = allSets.filter(set => !workoutExerciseIds.includes(set.workout_exercise_id));
    
    await googleSheetsService.clearData(this.SETS_RANGE);
    const header = ['set_id', 'workout_exercise_id', 'set_number', 'weight', 'reps', 'completed', 'rest_time', 'notes', 'completed_at', 'created_at'];
    const rows = [header, ...filteredSets.map(this.formatSetRow)];
    await googleSheetsService.writeData(this.SETS_RANGE, rows);
  }

  private async deleteSetsForWorkoutExercise(workoutExerciseId: string): Promise<void> {
    const allSets = await this.getAllSets();
    const filteredSets = allSets.filter(set => set.workout_exercise_id !== workoutExerciseId);
    
    await googleSheetsService.clearData(this.SETS_RANGE);
    const header = ['set_id', 'workout_exercise_id', 'set_number', 'weight', 'reps', 'completed', 'rest_time', 'notes', 'completed_at', 'created_at'];
    const rows = [header, ...filteredSets.map(this.formatSetRow)];
    await googleSheetsService.writeData(this.SETS_RANGE, rows);
  }

  private async deleteSetRecord(setId: string): Promise<void> {
    const allSets = await this.getAllSets();
    const filteredSets = allSets.filter(s => s.set_id !== setId);
    
    await googleSheetsService.clearData(this.SETS_RANGE);
    const header = ['set_id', 'workout_exercise_id', 'set_number', 'weight', 'reps', 'completed', 'rest_time', 'notes', 'completed_at', 'created_at'];
    const rows = [header, ...filteredSets.map(this.formatSetRow)];
    await googleSheetsService.writeData(this.SETS_RANGE, rows);
  }

  private async calculateWorkoutStats(workoutId: string): Promise<{
    total_volume: number;
    total_sets: number;
    total_reps: number;
  }> {
    const workoutExercises = await this.getWorkoutExercises(workoutId);
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    for (const we of workoutExercises) {
      const sets = await this.getSetsForWorkoutExercise(we.workout_exercise_id);
      const completedSets = sets.filter(s => s.completed);
      
      totalSets += completedSets.length;
      for (const set of completedSets) {
        totalReps += set.reps;
        totalVolume += set.weight * set.reps;
      }
    }

    return { total_volume: totalVolume, total_sets: totalSets, total_reps: totalReps };
  }

  private async updateWorkoutStats(workoutId: string): Promise<void> {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout) return;

    const stats = await this.calculateWorkoutStats(workoutId);
    const updatedWorkout: Workout = {
      ...workout,
      total_volume: stats.total_volume,
      total_sets: stats.total_sets,
      total_reps: stats.total_reps,
      updated_at: new Date().toISOString()
    };

    await this.saveWorkout(updatedWorkout);
  }

  private async copyTemplateToWorkout(workoutId: string, templateId: string): Promise<void> {
    // 實作模板複製邏輯（需要模板服務支援）
    // 這裡先留空，等模板功能實作後再填入
  }

  // 資料格式化方法

  private parseWorkoutRow(row: string[]): Workout {
    return {
      workout_id: row[0] || '',
      user_id: row[1] || '',
      title: row[2] || '',
      date: row[3] || '',
      start_time: row[4] || '',
      end_time: row[5] || undefined,
      duration: parseInt(row[6]) || 0,
      status: (row[7] as WorkoutStatus) || WorkoutStatus.ACTIVE,
      total_volume: parseFloat(row[8]) || 0,
      total_sets: parseInt(row[9]) || 0,
      total_reps: parseInt(row[10]) || 0,
      notes: row[11] || '',
      created_at: row[12] || '',
      updated_at: row[13] || ''
    };
  }

  private formatWorkoutRow(workout: Workout): string[] {
    return [
      workout.workout_id,
      workout.user_id,
      workout.title,
      workout.date,
      workout.start_time,
      workout.end_time || '',
      workout.duration.toString(),
      workout.status,
      workout.total_volume.toString(),
      workout.total_sets.toString(),
      workout.total_reps.toString(),
      workout.notes || '',
      workout.created_at,
      workout.updated_at
    ];
  }

  private parseWorkoutExerciseRow(row: string[]): WorkoutExercise {
    return {
      workout_exercise_id: row[0] || '',
      workout_id: row[1] || '',
      exercise_id: row[2] || '',
      order: parseInt(row[3]) || 0,
      notes: row[4] || '',
      created_at: row[5] || ''
    };
  }

  private formatWorkoutExerciseRow(workoutExercise: WorkoutExercise): string[] {
    return [
      workoutExercise.workout_exercise_id,
      workoutExercise.workout_id,
      workoutExercise.exercise_id,
      workoutExercise.order.toString(),
      workoutExercise.notes || '',
      workoutExercise.created_at
    ];
  }

  private parseSetRow(row: string[]): Set {
    return {
      set_id: row[0] || '',
      workout_exercise_id: row[1] || '',
      set_number: parseInt(row[2]) || 0,
      weight: parseFloat(row[3]) || 0,
      reps: parseInt(row[4]) || 0,
      completed: row[5] === 'true',
      rest_time: row[6] ? parseInt(row[6]) : undefined,
      notes: row[7] || '',
      completed_at: row[8] || undefined,
      created_at: row[9] || ''
    };
  }

  private formatSetRow(set: Set): string[] {
    return [
      set.set_id,
      set.workout_exercise_id,
      set.set_number.toString(),
      set.weight.toString(),
      set.reps.toString(),
      set.completed.toString(),
      set.rest_time?.toString() || '',
      set.notes || '',
      set.completed_at || '',
      set.created_at
    ];
  }
}

export default new WorkoutService();