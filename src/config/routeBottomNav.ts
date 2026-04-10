import type { RouteLocationRaw } from 'vue-router'

export type BottomNavAction = 'back' | 'next' | 'home' | 'menu'

export type NavTarget =
  | { type: 'route'; to: RouteLocationRaw }
  | { type: 'history'; delta: number }
  | { type: 'exam_flow' }
  | { type: 'exam_flow_test' }
  | { type: 'vision_flow' }

export type BottomNavButtonSpec = {
  label?: string
  target: NavTarget
}

export type RouteBottomNavSpec = {
  showNav: boolean
  nextLabel?: string
  requiredStageToEnter?: number
  buttons: Partial<Record<BottomNavAction, BottomNavButtonSpec>>
}

export const routeBottomNavConfig: Record<string, RouteBottomNavSpec> = {
  Home: { showNav: false, buttons: {} },
  Intro: { showNav: false, buttons: {} },
  UserProfile: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },

  Theory: {
    showNav: true,
    buttons: {
      back: { label: '返回主页', target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  PaperDetail: {
    showNav: true,
    buttons: {
      back: { target: { type: 'route', to: { name: 'Theory' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },

  TrainingMenu: {
    showNav: true,
    buttons: {
      back: { label: '返回主页', target: { type: 'route', to: { name: 'Home' } } }
    }
  },

  SectionIntroExam: {
    showNav: true,
    nextLabel: '开始体验',
    buttons: {
      next: { target: { type: 'exam_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  LensSelection: {
    showNav: true,
    buttons: {
      back: { target: { type: 'exam_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  LensConfirmation: {
    showNav: true,
    nextLabel: '确认配置',
    buttons: {
      back: { target: { type: 'exam_flow' } },
      next: { target: { type: 'exam_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  DistanceAdvice: {
    showNav: true,
    nextLabel: '开始测试',
    buttons: {
      back: { target: { type: 'exam_flow' } },
      next: { target: { type: 'exam_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  SuppressionTest: {
    showNav: true,
    nextLabel: '开始测试',
    buttons: {
      back: { target: { type: 'exam_flow' } },
      next: { target: { type: 'exam_flow_test' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  ContrastTest: {
    showNav: true,
    nextLabel: '开始测试',
    buttons: {
      back: { target: { type: 'exam_flow' } },
      next: { target: { type: 'exam_flow_test' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  SectionIntroAlignment: {
    showNav: true,
    buttons: {
      back: { target: { type: 'exam_flow' } },
      next: { target: { type: 'exam_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },

  // exercise 本身只在特定页面显示 bottom nav
  AlignmentExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'exam_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  AlignmentAdvice: {
    showNav: true,
    nextLabel: '回到主页',
    buttons: {
      back: { target: { type: 'exam_flow' } }, // 回到对齐训练（通常上一页）
      next: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },

  SectionIntroVision: {
    showNav: true,
    nextLabel: '开始体验',
    buttons: {
      next: { target: { type: 'vision_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  VisionDistanceAdvice: {
    showNav: true,
    nextLabel: '开始测试',
    buttons: {
      back: { target: { type: 'vision_flow' } },
      next: { target: { type: 'vision_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  VisionTest: {
    showNav: true,
    buttons: {
      back: { target: { type: 'vision_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  VisionAdvice: {
    showNav: true,
    buttons: {
      back: { target: { type: 'vision_flow' } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },

  SectionIntroTraining: {
    showNav: true,
    requiredStageToEnter: 1,
    buttons: {
      back: { target: { type: 'route', to: { name: 'TrainingMenu' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  SectionIntroTraining2: {
    showNav: true,
    requiredStageToEnter: 2,
    buttons: {
      back: { target: { type: 'route', to: { name: 'TrainingMenu' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  SectionIntroTraining3: {
    showNav: true,
    requiredStageToEnter: 3,
    buttons: {
      back: { target: { type: 'route', to: { name: 'TrainingMenu' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  SectionIntroTraining4: {
    showNav: true,
    requiredStageToEnter: 4,
    buttons: {
      back: { target: { type: 'route', to: { name: 'TrainingMenu' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },

  // training exercises 显示 bottom nav
  ShuffleExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  BoxesExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  SaccadicTrackingExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  SpiralExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  ParticlesExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  VergenceCardsExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  BrockStringExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  TetrisExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  }
}
