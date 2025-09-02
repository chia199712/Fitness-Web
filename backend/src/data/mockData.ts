// Mock data for fitness app development
export const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'demo_user',
    password: '$2b$10$hash_for_password123', // password: password123
    name: 'Demo User',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2', 
    email: 'john@example.com',
    username: 'john_doe',
    password: '$2b$10$hash_for_john123', // password: john123
    name: 'John Doe',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

export const mockExercises = [
  {
    id: '1',
    name: '伏地挺身',
    englishName: 'Push-ups',
    category: 'chest',
    muscleGroup: ['胸肌', '三頭肌', '前三角肌'],
    equipment: 'bodyweight',
    instructions: [
      '雙手撐地，與肩同寬',
      '身體保持一直線',
      '慢慢下降至胸部接近地面',
      '用力推起回到起始位置'
    ],
    difficulty: 'beginner',
    tips: [
      '保持核心穩定',
      '控制動作節奏',
      '呼吸要規律'
    ]
  },
  {
    id: '2',
    name: '深蹲',
    englishName: 'Squats',
    category: 'legs',
    muscleGroup: ['股四頭肌', '臀肌', '核心'],
    equipment: 'bodyweight',
    instructions: [
      '雙腳與肩同寬站立',
      '腳尖略向外',
      '慢慢下蹲至大腿與地面平行',
      '用力站起回到起始位置'
    ],
    difficulty: 'beginner',
    tips: [
      '膝蓋不要超過腳尖',
      '保持背部挺直',
      '重量集中在腳跟'
    ]
  },
  {
    id: '3',
    name: '引體向上',
    englishName: 'Pull-ups',
    category: 'back',
    muscleGroup: ['背闊肌', '二頭肌', '後三角肌'],
    equipment: 'pullup_bar',
    instructions: [
      '握住橫槓，手臂完全伸直',
      '用背部力量拉起身體',
      '下巴超過橫槓',
      '緩慢下降至起始位置'
    ],
    difficulty: 'intermediate',
    tips: [
      '避免搖擺身體',
      '集中使用背部力量',
      '控制下降速度'
    ]
  },
  {
    id: '4',
    name: '啞鈴胸推',
    englishName: 'Dumbbell Bench Press',
    category: 'chest',
    muscleGroup: ['胸肌', '三頭肌', '前三角肌'],
    equipment: 'dumbbells',
    instructions: [
      '仰臥在長椅上，雙手各握一個啞鈴',
      '啞鈴位於胸部上方',
      '慢慢下降至胸部',
      '用力推起至起始位置'
    ],
    difficulty: 'intermediate',
    tips: [
      '保持肘部角度適中',
      '專注胸部收縮',
      '控制重量'
    ]
  },
  {
    id: '5',
    name: '平板支撐',
    englishName: 'Plank',
    category: 'core',
    muscleGroup: ['核心', '前三角肌', '臀肌'],
    equipment: 'bodyweight',
    instructions: [
      '前臂撐地，肘部位於肩膀下方',
      '身體保持一直線',
      '保持這個姿勢',
      '正常呼吸'
    ],
    difficulty: 'beginner',
    tips: [
      '不要塌腰或翹臀',
      '保持頸部中立',
      '專注核心收縮'
    ]
  }
];

export const mockWorkouts = [
  // 最近一週的訓練記錄
  {
    id: '1',
    user_id: '1',
    name: '胸肌專項訓練',
    date: '2024-02-01T10:00:00.000Z',
    duration: 4200, // 70 minutes
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: [
          { reps: 15, weight: 0 },
          { reps: 12, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 }
        ]
      },
      {
        exercise_id: '4',
        exercise_name: '啞鈴胸推',
        sets: [
          { reps: 12, weight: 25 },
          { reps: 10, weight: 30 },
          { reps: 8, weight: 35 },
          { reps: 6, weight: 40 }
        ]
      }
    ],
    notes: '胸肌訓練達到新高度！',
    created_at: '2024-02-01T10:00:00.000Z'
  },
  {
    id: '2',
    user_id: '1',
    name: '腿部力量訓練',
    date: '2024-01-30T14:00:00.000Z',
    duration: 3900, // 65 minutes
    exercises: [
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: [
          { reps: 15, weight: 40 },
          { reps: 12, weight: 50 },
          { reps: 10, weight: 60 },
          { reps: 8, weight: 70 }
        ]
      }
    ],
    notes: '突破個人記錄！深蹲70kg',
    created_at: '2024-01-30T14:00:00.000Z'
  },
  {
    id: '3',
    user_id: '1',
    name: '背部拉力訓練',
    date: '2024-01-28T09:00:00.000Z',
    duration: 3600, // 60 minutes
    exercises: [
      {
        exercise_id: '3',
        exercise_name: '引體向上',
        sets: [
          { reps: 10, weight: 0 },
          { reps: 8, weight: 5 },
          { reps: 6, weight: 10 },
          { reps: 4, weight: 15 }
        ]
      }
    ],
    notes: '加重引體向上進步明顯',
    created_at: '2024-01-28T09:00:00.000Z'
  },
  // 上週的訓練記錄
  {
    id: '4',
    user_id: '1',
    name: '全身循環訓練',
    date: '2024-01-25T16:00:00.000Z',
    duration: 5400, // 90 minutes
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: [{ reps: 20, weight: 0 }, { reps: 18, weight: 0 }, { reps: 15, weight: 0 }]
      },
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: [{ reps: 25, weight: 30 }, { reps: 20, weight: 35 }, { reps: 15, weight: 40 }]
      },
      {
        exercise_id: '5',
        exercise_name: '平板支撐',
        sets: [{ duration: 90, weight: 0 }, { duration: 75, weight: 0 }, { duration: 60, weight: 0 }]
      }
    ],
    notes: '高強度全身訓練，消耗大量卡路里',
    created_at: '2024-01-25T16:00:00.000Z'
  },
  {
    id: '5',
    user_id: '1',
    name: '上肢力量強化',
    date: '2024-01-23T11:00:00.000Z',
    duration: 4800, // 80 minutes
    exercises: [
      {
        exercise_id: '4',
        exercise_name: '啞鈴胸推',
        sets: [
          { reps: 10, weight: 30 },
          { reps: 8, weight: 35 },
          { reps: 6, weight: 40 }
        ]
      },
      {
        exercise_id: '3',
        exercise_name: '引體向上',
        sets: [
          { reps: 8, weight: 0 },
          { reps: 6, weight: 5 },
          { reps: 4, weight: 10 }
        ]
      }
    ],
    notes: '上肢力量穩步提升',
    created_at: '2024-01-23T11:00:00.000Z'
  },
  // 更早期的訓練記錄 - 用於趨勢分析
  {
    id: '6',
    user_id: '1',
    name: '基礎力量建構',
    date: '2024-01-15T10:00:00.000Z',
    duration: 3000, // 50 minutes
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }, { reps: 5, weight: 0 }]
      },
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: [{ reps: 12, weight: 20 }, { reps: 10, weight: 25 }]
      }
    ],
    notes: '剛開始健身，基礎動作練習',
    created_at: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '7',
    user_id: '1',
    name: '耐力訓練',
    date: '2024-01-10T15:00:00.000Z',
    duration: 2400, // 40 minutes
    exercises: [
      {
        exercise_id: '5',
        exercise_name: '平板支撐',
        sets: [{ duration: 30, weight: 0 }, { duration: 25, weight: 0 }, { duration: 20, weight: 0 }]
      }
    ],
    notes: '核心耐力訓練',
    created_at: '2024-01-10T15:00:00.000Z'
  },
  // John 的訓練記錄
  {
    id: '8',
    user_id: '2',
    name: 'John的高強度訓練',
    date: '2024-02-01T07:00:00.000Z',
    duration: 5400, // 90 minutes
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: [
          { reps: 25, weight: 0 },
          { reps: 22, weight: 0 },
          { reps: 20, weight: 0 },
          { reps: 18, weight: 0 }
        ]
      },
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: [
          { reps: 30, weight: 50 },
          { reps: 25, weight: 60 },
          { reps: 20, weight: 70 }
        ]
      },
      {
        exercise_id: '3',
        exercise_name: '引體向上',
        sets: [
          { reps: 15, weight: 0 },
          { reps: 12, weight: 10 },
          { reps: 10, weight: 20 }
        ]
      }
    ],
    notes: 'John的週末強化訓練，狀態極佳',
    created_at: '2024-02-01T07:00:00.000Z'
  },
  {
    id: '9',
    user_id: '2',
    name: '晨間快速訓練',
    date: '2024-01-29T06:30:00.000Z',
    duration: 1800, // 30 minutes
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: [{ reps: 20, weight: 0 }, { reps: 15, weight: 0 }]
      },
      {
        exercise_id: '5',
        exercise_name: '平板支撐',
        sets: [{ duration: 60, weight: 0 }, { duration: 45, weight: 0 }]
      }
    ],
    notes: '晨間快速訓練保持狀態',
    created_at: '2024-01-29T06:30:00.000Z'
  },
  {
    id: '10',
    user_id: '2',
    name: 'John的力量測試',
    date: '2024-01-16T09:00:00.000Z',
    duration: 4500, // 75 minutes
    exercises: [
      {
        exercise_id: '4',
        exercise_name: '啞鈴胸推',
        sets: [
          { reps: 12, weight: 40 },
          { reps: 10, weight: 45 },
          { reps: 8, weight: 50 }
        ]
      },
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: [
          { reps: 15, weight: 60 },
          { reps: 12, weight: 70 },
          { reps: 10, weight: 80 }
        ]
      }
    ],
    notes: '力量測試日，表現優異',
    created_at: '2024-01-16T09:00:00.000Z'
  }
];

export const mockTemplates = [
  {
    id: '1',
    user_id: '1',
    name: '新手入門訓練',
    description: '適合健身新手的基礎訓練計畫',
    category: 'beginner',
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: 3,
        reps: 10,
        rest_time: 60
      },
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: 3,
        reps: 15,
        rest_time: 60
      },
      {
        exercise_id: '5',
        exercise_name: '平板支撐',
        sets: 3,
        duration: 30,
        rest_time: 60
      }
    ],
    estimated_duration: 1800, // 30 minutes
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    user_id: '1',
    name: '胸部專項訓練',
    description: '專注胸部肌群的進階訓練',
    category: 'chest',
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: 4,
        reps: 12,
        rest_time: 90
      },
      {
        exercise_id: '4',
        exercise_name: '啞鈴胸推',
        sets: 4,
        reps: 10,
        rest_time: 120
      }
    ],
    estimated_duration: 2400, // 40 minutes
    created_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '3',
    user_id: '2',
    name: 'John的日常訓練',
    description: 'John的個人化日常訓練計畫',
    category: 'full_body',
    exercises: [
      {
        exercise_id: '1',
        exercise_name: '伏地挺身',
        sets: 3,
        reps: 20,
        rest_time: 60
      },
      {
        exercise_id: '2',
        exercise_name: '深蹲',
        sets: 4,
        reps: 25,
        rest_time: 90
      },
      {
        exercise_id: '3',
        exercise_name: '引體向上',
        sets: 3,
        reps: 8,
        rest_time: 120
      }
    ],
    estimated_duration: 3600, // 60 minutes
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

export const mockSettings = [
  {
    id: '1',
    user_id: '1',
    preferences: {
      units: 'metric', // metric or imperial
      language: 'zh-TW',
      theme: 'light',
      notifications: {
        workout_reminders: true,
        progress_updates: true,
        achievement_alerts: true
      },
      privacy: {
        profile_public: false,
        workout_data_public: false
      }
    },
    goals: {
      weekly_workouts: 4,
      target_weight: 70,
      target_body_fat: 15,
      primary_goal: 'muscle_gain' // options: weight_loss, muscle_gain, strength, endurance
    },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    user_id: '2',
    preferences: {
      units: 'metric',
      language: 'en-US',
      theme: 'dark',
      notifications: {
        workout_reminders: false,
        progress_updates: true,
        achievement_alerts: true
      },
      privacy: {
        profile_public: true,
        workout_data_public: false
      }
    },
    goals: {
      weekly_workouts: 5,
      target_weight: 75,
      target_body_fat: 12,
      primary_goal: 'strength'
    },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-16T00:00:00.000Z'
  }
];

export const mockDashboardData = {
  user_id: '1',
  weekly_stats: {
    workouts_completed: 4,
    total_duration: 16500, // seconds (4.58 hours)
    exercises_performed: 12,
    total_volume: 2850, // kg
    average_workout_duration: 4125,
    calories_burned: 1680,
    personal_records: 2
  },
  monthly_stats: {
    workouts_completed: 15,
    total_duration: 54900, // seconds (15.25 hours)
    exercises_performed: 45,
    total_volume: 8750, // kg
    average_workout_duration: 3660,
    calories_burned: 6200,
    personal_records: 5
  },
  recent_workouts: mockWorkouts.slice(0, 5),
  progress_charts: {
    weekly_workout_count: [
      { date: '2024-01-01', workouts: 2, duration: 7200, volume: 1200 },
      { date: '2024-01-08', workouts: 3, duration: 9900, volume: 1800 },
      { date: '2024-01-15', workouts: 4, duration: 13200, volume: 2400 },
      { date: '2024-01-22', workouts: 3, duration: 12300, volume: 2200 },
      { date: '2024-01-29', workouts: 4, duration: 16500, volume: 2850 }
    ],
    monthly_volume: [
      { month: '2023-10', volume: 2800, workouts: 8, avg_duration: 3000 },
      { month: '2023-11', volume: 4200, workouts: 12, avg_duration: 3200 },
      { month: '2023-12', volume: 5800, workouts: 16, avg_duration: 3400 },
      { month: '2024-01', volume: 8750, workouts: 20, avg_duration: 3660 }
    ],
    strength_progression: [
      { exercise: '深蹲', dates: ['2024-01-10', '2024-01-17', '2024-01-24', '2024-01-30'], weights: [40, 50, 60, 70] },
      { exercise: '啞鈴胸推', dates: ['2024-01-12', '2024-01-19', '2024-01-26', '2024-02-01'], weights: [20, 25, 30, 40] },
      { exercise: '引體向上', dates: ['2024-01-14', '2024-01-21', '2024-01-28'], weights: [0, 5, 15] }
    ],
    workout_distribution: [
      { type: '胸部訓練', count: 6, percentage: 30 },
      { type: '腿部訓練', count: 5, percentage: 25 },
      { type: '背部訓練', count: 4, percentage: 20 },
      { type: '全身訓練', count: 3, percentage: 15 },
      { type: '核心訓練', count: 2, percentage: 10 }
    ]
  },
  muscle_group_analysis: {
    chest: { workouts: 6, total_sets: 24, avg_weight: 28.5, progress: 85 },
    legs: { workouts: 5, total_sets: 20, avg_weight: 45.2, progress: 92 },
    back: { workouts: 4, total_sets: 16, avg_weight: 8.5, progress: 78 },
    core: { workouts: 2, total_sets: 8, avg_weight: 0, progress: 65 },
    shoulders: { workouts: 2, total_sets: 8, avg_weight: 15.0, progress: 70 }
  },
  personal_records: [
    {
      id: '1',
      exercise_name: '深蹲',
      previous_max: 60,
      new_max: 70,
      improvement: 16.7,
      achieved_date: '2024-01-30T14:00:00.000Z',
      type: 'weight'
    },
    {
      id: '2',
      exercise_name: '啞鈴胸推',
      previous_max: 30,
      new_max: 40,
      improvement: 33.3,
      achieved_date: '2024-02-01T10:00:00.000Z',
      type: 'weight'
    },
    {
      id: '3',
      exercise_name: '平板支撐',
      previous_max: 60,
      new_max: 90,
      improvement: 50.0,
      achieved_date: '2024-01-25T16:00:00.000Z',
      type: 'duration'
    }
  ],
  achievements: [
    {
      id: '1',
      title: '重量突破者',
      description: '深蹲達到70公斤',
      earned_date: '2024-01-30T00:00:00.000Z',
      icon: '💪',
      category: 'strength',
      rarity: 'rare'
    },
    {
      id: '2', 
      title: '連續挑戰者',
      description: '連續兩週每週完成4次訓練',
      earned_date: '2024-02-01T00:00:00.000Z',
      icon: '🔥',
      category: 'consistency',
      rarity: 'epic'
    },
    {
      id: '3',
      title: '耐力大師',
      description: '平板支撐超過90秒',
      earned_date: '2024-01-25T00:00:00.000Z',
      icon: '⏱️',
      category: 'endurance',
      rarity: 'uncommon'
    },
    {
      id: '4',
      title: '訓練狂熱者',
      description: '本月完成15次訓練',
      earned_date: '2024-01-31T00:00:00.000Z',
      icon: '🏆',
      category: 'volume',
      rarity: 'legendary'
    }
  ],
  workout_insights: [
    {
      type: 'performance',
      title: '力量進步顯著',
      message: '過去兩週你的深蹲重量增加了40%，表現優異！',
      priority: 'high',
      actionable: true,
      recommendation: '繼續保持當前的訓練強度，並注意充分休息'
    },
    {
      type: 'balance',
      title: '訓練均衡度良好',
      message: '你的訓練涵蓋了所有主要肌群，保持了良好的平衡',
      priority: 'medium',
      actionable: false
    },
    {
      type: 'consistency',
      title: '訓練頻率提升',
      message: '本週比上週多完成了1次訓練，一致性有所改善',
      priority: 'medium',
      actionable: true,
      recommendation: '嘗試維持每週4次的訓練頻率'
    },
    {
      type: 'recovery',
      title: '注意休息時間',
      message: '建議在高強度訓練後安排充足的休息日',
      priority: 'low',
      actionable: true,
      recommendation: '每週安排1-2個完全休息日'
    }
  ],
  goals_progress: {
    weekly_target: { current: 4, target: 4, percentage: 100, status: 'completed' },
    monthly_target: { current: 15, target: 16, percentage: 93.75, status: 'on_track' },
    strength_goal: { current: 70, target: 80, percentage: 87.5, status: 'on_track', metric: 'kg', exercise: '深蹲' },
    consistency_goal: { current: 8, target: 10, percentage: 80, status: 'behind', metric: 'days' }
  }
};