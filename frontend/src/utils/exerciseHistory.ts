/**
 * 動作歷史記錄系統
 */

export interface ExerciseRecord {
  id: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: number;
  weight: number;
  restTime?: number;
  date: string;
  frequency: number; // 使用次數
  lastUsed: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: ExerciseRecord[];
  totalVolume: number;
  estimatedDuration: number;
  tags: string[];
  createdDate: string;
  lastUsed?: string;
  useCount: number;
}

interface WorkoutData {
  date: string;
  exercises: ExerciseRecord[];
  totalVolume: number;
}

/**
 * 獲取動作歷史記錄
 */
export const getExerciseHistory = (): ExerciseRecord[] => {
  try {
    const history = localStorage.getItem('fitness-exercise-history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading exercise history:', error);
    return [];
  }
};

/**
 * 保存動作到歷史記錄
 */
export const saveExerciseToHistory = (exercise: {
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: number;
  weight: number;
  restTime?: number;
}): void => {
  try {
    const history = getExerciseHistory();
    const existingIndex = history.findIndex(record => 
      record.name.toLowerCase() === exercise.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      // 更新現有記錄
      history[existingIndex] = {
        ...history[existingIndex],
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        restTime: exercise.restTime,
        lastUsed: new Date().toISOString(),
        frequency: history[existingIndex].frequency + 1
      };
    } else {
      // 創建新記錄
      const newRecord: ExerciseRecord = {
        id: `exercise-${Date.now()}`,
        name: exercise.name,
        muscleGroups: exercise.muscleGroups,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        restTime: exercise.restTime,
        date: new Date().toISOString(),
        frequency: 1,
        lastUsed: new Date().toISOString()
      };
      history.unshift(newRecord);
    }

    // 保持最近50個動作記錄
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem('fitness-exercise-history', JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving exercise to history:', error);
  }
};

/**
 * 獲取最常用的動作
 */
export const getMostUsedExercises = (limit: number = 10): ExerciseRecord[] => {
  const history = getExerciseHistory();
  return history
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
};

/**
 * 獲取最近使用的動作
 */
export const getRecentExercises = (limit: number = 10): ExerciseRecord[] => {
  const history = getExerciseHistory();
  return history
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, limit);
};

/**
 * 搜索動作歷史
 */
export const searchExerciseHistory = (query: string): ExerciseRecord[] => {
  const history = getExerciseHistory();
  const lowerQuery = query.toLowerCase();
  
  return history.filter(record =>
    record.name.toLowerCase().includes(lowerQuery) ||
    record.muscleGroups.some(group => group.toLowerCase().includes(lowerQuery))
  );
};

/**
 * 獲取訓練課表模板
 */
export const getWorkoutTemplates = (): WorkoutTemplate[] => {
  try {
    const templates = localStorage.getItem('fitness-workout-templates');
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error('Error loading workout templates:', error);
    return [];
  }
};

/**
 * 保存訓練課表模板
 */
export const saveWorkoutTemplate = (template: Omit<WorkoutTemplate, 'id' | 'createdDate' | 'useCount'>): void => {
  try {
    const templates = getWorkoutTemplates();
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdDate: new Date().toISOString(),
      useCount: 0
    };
    
    templates.unshift(newTemplate);
    
    // 保持最多20個模板
    const limitedTemplates = templates.slice(0, 20);
    localStorage.setItem('fitness-workout-templates', JSON.stringify(limitedTemplates));
  } catch (error) {
    console.error('Error saving workout template:', error);
  }
};

/**
 * 從歷史訓練創建模板
 */
export const createTemplateFromWorkout = (workoutDate: string, templateName: string): void => {
  try {
    const workouts = JSON.parse(localStorage.getItem('fitness-workouts') || '[]');
    const targetWorkout = workouts.find((w: WorkoutData) => w.date === workoutDate);
    
    if (!targetWorkout) {
      throw new Error('找不到指定日期的訓練記錄');
    }

    const template: Omit<WorkoutTemplate, 'id' | 'createdDate' | 'useCount'> = {
      name: templateName,
      description: `從 ${workoutDate} 的訓練創建`,
      exercises: targetWorkout.exercises.map((ex: ExerciseRecord) => ({
        ...ex,
        id: `exercise-${Date.now()}-${Math.random()}`,
        date: new Date().toISOString(),
        frequency: 1,
        lastUsed: new Date().toISOString()
      })),
      totalVolume: targetWorkout.totalVolume,
      estimatedDuration: Math.round(targetWorkout.exercises.length * 3.5), // 估算時間
      tags: targetWorkout.exercises.flatMap((ex: ExerciseRecord) => ex.muscleGroups),
      lastUsed: new Date().toISOString()
    };

    saveWorkoutTemplate(template);
  } catch (error) {
    console.error('Error creating template from workout:', error);
    throw error;
  }
};

/**
 * 使用模板並更新使用次數
 */
export const useWorkoutTemplate = (templateId: string): WorkoutTemplate | null => {
  try {
    const templates = getWorkoutTemplates();
    const templateIndex = templates.findIndex(t => t.id === templateId);
    
    if (templateIndex >= 0) {
      templates[templateIndex].useCount++;
      templates[templateIndex].lastUsed = new Date().toISOString();
      
      localStorage.setItem('fitness-workout-templates', JSON.stringify(templates));
      return templates[templateIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error using workout template:', error);
    return null;
  }
};

/**
 * 刪除模板
 */
export const deleteWorkoutTemplate = (templateId: string): void => {
  try {
    const templates = getWorkoutTemplates();
    const filteredTemplates = templates.filter(t => t.id !== templateId);
    localStorage.setItem('fitness-workout-templates', JSON.stringify(filteredTemplates));
  } catch (error) {
    console.error('Error deleting workout template:', error);
  }
};

/**
 * 獲取推薦的課表標籤
 */
export const getRecommendedTags = (): string[] => {
  return [
    '推日', '拉日', '腿日',
    '胸背', '肩臂', '全身',
    '力量', '肌肥大', '減脂',
    '新手', '中級', '高級',
    '快速', '標準', '高強度'
  ];
};