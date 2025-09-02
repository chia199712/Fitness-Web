/**
 * 動作資料庫 - 包含肌群分類和動作信息
 */

export interface ExerciseInfo {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  category: string;
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const MUSCLE_GROUPS = {
  chest: '胸部',
  back: '背部',
  shoulders: '肩膀',
  arms: '手臂',
  legs: '腿部',
  core: '核心',
  glutes: '臀部',
  calves: '小腿',
} as const;

export const EXERCISE_DATABASE: ExerciseInfo[] = [
  // 胸部動作
  {
    id: 'bench-press',
    name: '臥推',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'arms'],
    category: '力量訓練',
    equipment: ['槓鈴', '臥推架'],
    difficulty: 'intermediate'
  },
  {
    id: 'push-ups',
    name: '伏地挺身',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'arms', 'core'],
    category: '自重訓練',
    equipment: [],
    difficulty: 'beginner'
  },
  {
    id: 'dumbbell-fly',
    name: '啞鈴飛鳥',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    category: '力量訓練',
    equipment: ['啞鈴'],
    difficulty: 'intermediate'
  },

  // 背部動作
  {
    id: 'pull-ups',
    name: '引體向上',
    primaryMuscles: ['back'],
    secondaryMuscles: ['arms'],
    category: '自重訓練',
    equipment: ['單槓'],
    difficulty: 'intermediate'
  },
  {
    id: 'deadlift',
    name: '硬舉',
    primaryMuscles: ['back', 'legs'],
    secondaryMuscles: ['glutes', 'core'],
    category: '力量訓練',
    equipment: ['槓鈴'],
    difficulty: 'advanced'
  },
  {
    id: 'lat-pulldown',
    name: '滑輪下拉',
    primaryMuscles: ['back'],
    secondaryMuscles: ['arms'],
    category: '力量訓練',
    equipment: ['滑輪機'],
    difficulty: 'beginner'
  },

  // 腿部動作
  {
    id: 'squat',
    name: '深蹲',
    primaryMuscles: ['legs'],
    secondaryMuscles: ['glutes', 'core'],
    category: '力量訓練',
    equipment: ['槓鈴'],
    difficulty: 'intermediate'
  },
  {
    id: 'lunges',
    name: '弓箭步',
    primaryMuscles: ['legs'],
    secondaryMuscles: ['glutes', 'core'],
    category: '自重訓練',
    equipment: [],
    difficulty: 'beginner'
  },
  {
    id: 'leg-press',
    name: '腿部推舉',
    primaryMuscles: ['legs'],
    secondaryMuscles: ['glutes'],
    category: '力量訓練',
    equipment: ['腿部推舉機'],
    difficulty: 'beginner'
  },

  // 肩膀動作
  {
    id: 'shoulder-press',
    name: '肩推',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['arms', 'core'],
    category: '力量訓練',
    equipment: ['啞鈴', '槓鈴'],
    difficulty: 'intermediate'
  },
  {
    id: 'lateral-raise',
    name: '側平舉',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    category: '力量訓練',
    equipment: ['啞鈴'],
    difficulty: 'beginner'
  },

  // 手臂動作
  {
    id: 'bicep-curl',
    name: '二頭彎舉',
    primaryMuscles: ['arms'],
    secondaryMuscles: [],
    category: '力量訓練',
    equipment: ['啞鈴', '槓鈴'],
    difficulty: 'beginner'
  },
  {
    id: 'tricep-dips',
    name: '三頭肌撐體',
    primaryMuscles: ['arms'],
    secondaryMuscles: ['shoulders', 'chest'],
    category: '自重訓練',
    equipment: ['雙槓'],
    difficulty: 'intermediate'
  },

  // 核心動作
  {
    id: 'plank',
    name: '棒式',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders'],
    category: '自重訓練',
    equipment: [],
    difficulty: 'beginner'
  },
  {
    id: 'crunches',
    name: '仰臥起坐',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    category: '自重訓練',
    equipment: [],
    difficulty: 'beginner'
  },
];

/**
 * 根據動作名稱查找肌群
 */
export const findExerciseMuscleGroups = (exerciseName: string): string[] => {
  // 先檢查用戶自定義的動作
  const userExercises = getUserDefinedExercises();
  const userExercise = userExercises.find(ex => 
    ex.name.toLowerCase() === exerciseName.toLowerCase()
  );
  
  if (userExercise) {
    return [...userExercise.primaryMuscles, ...userExercise.secondaryMuscles];
  }

  // 檢查系統預定義動作
  const exercise = EXERCISE_DATABASE.find(ex => 
    ex.name.toLowerCase().includes(exerciseName.toLowerCase()) ||
    exerciseName.toLowerCase().includes(ex.name.toLowerCase())
  );
  
  if (exercise) {
    return [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
  }
  
  // 如果找不到，嘗試關鍵字匹配
  const keywords = {
    chest: ['胸', '臥推', '推胸', '飛鳥', '伏地挺身', 'bench', 'press', 'chest', 'push'],
    back: ['背', '拉', '划船', '硬舉', '引體', '下拉', 'pull', 'row', 'deadlift', 'lat'],
    shoulders: ['肩', '肩推', '側舉', '肩膀', '前舉', 'shoulder', 'raise', 'press'],
    arms: ['臂', '彎舉', '三頭', '二頭', '手臂', 'curl', 'tricep', 'bicep', 'arm'],
    legs: ['腿', '蹲', '腿推', '腿彎舉', '股四頭', '股二頭', 'squat', 'leg', 'quad'],
    core: ['腹', '核心', '棒式', '仰臥', '腰部', 'core', 'ab', 'plank', 'crunch'],
    glutes: ['臀', '臀部', '屁股', 'glute', 'hip'],
    calves: ['小腿', '腓腸肌', 'calf', 'calves'],
  };
  
  const matchedGroups: string[] = [];
  Object.entries(keywords).forEach(([group, words]) => {
    if (words.some(word => exerciseName.toLowerCase().includes(word.toLowerCase()))) {
      matchedGroups.push(group);
    }
  });
  
  return matchedGroups.length > 0 ? matchedGroups : [];
};

/**
 * 獲取用戶自定義的動作
 */
export const getUserDefinedExercises = (): ExerciseInfo[] => {
  try {
    const stored = localStorage.getItem('fitness-user-exercises');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading user exercises:', error);
    return [];
  }
};

/**
 * 保存用戶自定義動作
 */
export const saveUserDefinedExercise = (exercise: ExerciseInfo): void => {
  try {
    const userExercises = getUserDefinedExercises();
    const existingIndex = userExercises.findIndex(ex => ex.id === exercise.id);
    
    if (existingIndex >= 0) {
      userExercises[existingIndex] = exercise;
    } else {
      userExercises.push(exercise);
    }
    
    localStorage.setItem('fitness-user-exercises', JSON.stringify(userExercises));
  } catch (error) {
    console.error('Error saving user exercise:', error);
  }
};

/**
 * 檢查動作是否為未知動作
 */
export const isUnknownExercise = (exerciseName: string): boolean => {
  const groups = findExerciseMuscleGroups(exerciseName);
  return groups.length === 0;
};

/**
 * 獲取所有可用的肌群選項
 */
export const getAllMuscleGroupOptions = () => {
  return Object.entries(MUSCLE_GROUPS).map(([key, value]) => ({
    key,
    value,
    description: getMuscleGroupDescription(key)
  }));
};

/**
 * 獲取肌群描述
 */
const getMuscleGroupDescription = (group: string): string => {
  const descriptions: Record<string, string> = {
    chest: '胸大肌、胸小肌等胸部肌肉',
    back: '背闊肌、菱形肌、斜方肌等背部肌肉',
    shoulders: '三角肌前束、中束、後束',
    arms: '二頭肌、三頭肌、前臂肌群',
    legs: '股四頭肌、股二頭肌、小腿肌群',
    core: '腹直肌、腹橫肌、腰部肌群',
    glutes: '臀大肌、臀中肌、臀小肌',
    calves: '腓腸肌、比目魚肌',
  };
  return descriptions[group] || '';
};

/**
 * 獲取動作建議
 */
export const getExerciseSuggestions = (partialName: string): ExerciseInfo[] => {
  return EXERCISE_DATABASE.filter(exercise =>
    exercise.name.toLowerCase().includes(partialName.toLowerCase())
  ).slice(0, 5);
};