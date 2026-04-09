import type { RouteLocationRaw } from 'vue-router'

export type BottomNavAction = 'back' | 'next' | 'home' | 'menu'

export type NavTarget =
  | { type: 'route'; to: RouteLocationRaw }
  | { type: 'history'; delta: number }

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
      next: { target: { type: 'route', to: { name: 'LensSelection' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },
  LensSelection: {
    showNav: true,
    buttons: {
      back: { target: { type: 'route', to: { name: 'SectionIntroExam' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  LensConfirmation: {
    showNav: true,
    buttons: {
      back: { target: { type: 'route', to: { name: 'LensSelection' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  SuppressionTest: {
    showNav: true,
    buttons: {
      back: { target: { type: 'route', to: { name: 'LensConfirmation' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  SectionIntroAlignment: {
    showNav: true,
    buttons: {
      back: { target: { type: 'route', to: { name: 'SuppressionTest' } } },
      next: { target: { type: 'route', to: { name: 'AlignmentExercise' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } }
    }
  },

  // exercise 本身只在特定页面显示 bottom nav
  AlignmentExercise: {
    showNav: true,
    buttons: {
      back: { target: { type: 'route', to: { name: 'SectionIntroAlignment' } } },
      home: { target: { type: 'route', to: { name: 'Home' } } },
    },
  },
  AlignmentAdvice: {
    showNav: true,
    buttons: {
      back: { target: { type: 'history', delta: -1 } }, // 回到对齐训练（通常上一页）
      next: { target: { type: 'route', to: { name: 'Home' } } },
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
