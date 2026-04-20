import { createRouter, createWebHashHistory } from 'vue-router'
import { useSettingsStore } from '../store/settings'


declare module 'vue-router' {
  interface RouteMeta {
    requiredStageToEnter?: number;
  }
}

const routes = [
  {
    path: '/',
    redirect: () => {
      // Cannot use useSettingsStore() directly at top level due to pinia initialization order
      return '/intro'
    }
  },
  {
    path: '/intro',
    name: 'Intro',
    component: () => import('../views/IntroLevel.vue'),
    beforeEnter: (to: any, _from: any, next: any) => {
      const settingsStore = useSettingsStore()
      if (settingsStore.hasSeenIntro && to.query?.force !== '1') {
        next({ name: 'Home' })
      } else {
        next()
      }
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeMenuLevel.vue')
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('../views/UserProfileLevel.vue')
  },
  {
    path: '/theory',
    name: 'Theory',
    component: () => import('../views/TheoryLevel.vue')
  },
  {
    path: '/theory/paper/:id',
    name: 'PaperDetail',
    component: () => import('../views/PaperDetailLevel.vue')
  },
  {
    path: '/training/menu',
    name: 'TrainingMenu',
    component: () => import('../views/TrainingMenuLevel.vue')
  },
  {
    path: '/exam/intro',
    name: 'SectionIntroExam',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '临床级视功能检查',
      subtitle: '本测试将客观测算您的主导眼、抑制程度及隐斜视偏离度',
      notes: [
        '请准备并佩戴好红蓝（或红青）3D眼镜',
        '系统将首先为您进行物理色彩通道的硬件校准',
        '接下来将通过客观双眼竞争游戏（找 E 字方向），精准判断您的强弱眼',
        '最后将通过十字准星为您测量双眼隐斜视像素偏离度',
        '所有测试数据将自动应用于后续的康复训练'
      ]
    }
  },
  {
    path: '/amblyopia/intro',
    name: 'SectionIntroAmblyopia',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '弱视 / 抑制检查',
      description: '请准备好您的红蓝 3D 眼镜。本流程将通过分视技术检测是否存在单眼抑制（弱视），并测定抑制眼的暗光惩罚阈值。',
      nextRoute: 'LensSelection'
    }
  },
  {
    path: '/diplopia/intro',
    name: 'SectionIntroDiplopia',
    component: () => import('../views/diplopia/SectionIntroDiplopia.vue')
  },
  {
    path: '/diplopia/monocular',
    name: 'MonocularDiplopiaTest',
    component: () => import('../views/diplopia/MonocularDiplopiaTest.vue')
  },
  {
    path: '/diplopia/binocular',
    name: 'BinocularDiplopiaTest',
    component: () => import('../views/diplopia/BinocularDiplopiaTest.vue')
  },
  {
    path: '/diplopia/advice',
    name: 'DiplopiaAdvice',
    component: () => import('../views/diplopia/DiplopiaAdvice.vue')
  },
  {
    path: '/exam/user-info',
    name: 'UserInfoForm',
    component: () => import('../views/UserInfoFormLevel.vue')
  },
  {
    path: '/exam/lens-selection',
    name: 'LensSelection',
    component: () => import('../views/LensSelectionLevel.vue')
  },
  {
    path: '/exam/lens-confirmation',
    name: 'LensConfirmation',
    component: () => import('../views/LensConfirmationLevel.vue')
  },
  {
    path: '/exam/color-calibration',
    name: 'ColorCalibration',
    component: () => import('../views/ColorCalibrationLevel.vue')
  },
  {
    path: '/exam/alignment-intro',
    name: 'SectionIntroAlignment',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '十字准星对齐测试',
      subtitle: '请通过移动其中一个准星，使它们重合',
      notes: [
        '此测试用于评估您的双眼视差',
        '您可以使用屏幕上的方向键或直接拖动圆圈',
        '重合时，红蓝颜色叠加会显示为白/黑色十字'
      ]
    }
  },
  {
    path: '/exam/distance-advice',
    name: 'DistanceAdvice',
    component: () => import('../views/DistanceAdviceLevel.vue')
  },
  {
    path: '/exam/alignment-exercise',
    name: 'AlignmentExercise',
    component: () => import('../views/exercises/AlignmentExercise.vue')
  },
  {
    path: '/exam/alignment-advice',
    name: 'AlignmentAdvice',
    component: () => import('../views/AlignmentAdviceLevel.vue')
  },
  {
    path: '/exam/stereopsis-test',
    name: 'StereopsisTest',
    component: () => import('../views/exam/StereopsisTestLevel.vue')
  },
  {
    path: '/exam/suppression-test',
    name: 'SuppressionTest',
    component: () => import('../views/ObjectiveTestLevel.vue')
  },
  {
    path: '/exam/contrast-test',
    name: 'ContrastTest',
    component: () => import('../views/ContrastTestLevel.vue')
  },
  {
    path: '/amblyopia/advice',
    name: 'AmblyopiaAdvice',
    component: () => import('../views/vision/AmblyopiaAdviceLevel.vue')
  },
  {
    path: '/vision/intro',
    name: 'SectionIntroVision',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '普通视力检查',
      subtitle: '本测试将评估您双眼在正常照明下的视力水平',
      notes: [
        '请在明亮的光线下进行测试，无需佩戴红蓝眼镜',
        '我们将为您提供视力测量（如 1.0, 4.8 等）',
        '请在接下来的测试中，根据屏幕上的提示进行操作',
        '根据国际标准，本次测试默认在40cm距离下进行'
      ]
    }
  },
  {
    path: '/vision/distance',
    name: 'VisionDistanceAdvice',
    component: () => import('../views/vision/VisionDistanceAdviceLevel.vue')
  },
  {
    path: '/vision/test',
    name: 'VisionTest',
    component: () => import('../views/vision/VisionTestLevel.vue')
  },
  {
    path: '/vision/astigmatism-test',
    name: 'AstigmatismTest',
    component: () => import('../views/AstigmatismTestLevel.vue')
  },
  {
    path: '/vision/color-vision-test',
    name: 'ColorVisionTest',
    component: () => import('../views/ColorVisionTestLevel.vue')
  },
  {
    path: '/vision/amsler-grid-test',
    name: 'AmslerGridTest',
    component: () => import('../views/AmslerGridTestLevel.vue')
  },
  {
    path: '/vision/contrast-sensitivity-test',
    name: 'ContrastSensitivityTest',
    component: () => import('../views/ContrastSensitivityTestLevel.vue')
  },
  {
    path: '/vision/advice',
    name: 'VisionAdvice',
    component: () => import('../views/vision/VisionAdviceLevel.vue')
  },
  {
    path: '/training/intro',
    name: 'SectionIntroTraining',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: () => {
      const settingsStore = useSettingsStore()
      const requiredMinutes = Math.floor(settingsStore.requiredTrainingTime / 60)
      return {
        title: '阶段 1：基础脱抑制',
        subtitle: '通过简单的颜色匹配和移动，唤醒被抑制的眼睛',
        notes: [
          '目标：在屏幕上同时看到红蓝两种颜色的方块',
          `时长要求：本阶段至少训练 ${requiredMinutes} 分钟`
        ],
        games: [
        {
          title: '洗牌训练 (Shuffle)',
          description: '追踪快速移动的红蓝方块，唤醒弱视眼。',
          routeName: 'ShuffleExercise',
          image: '../assets/images/games/shuffle.webp'
        },
        {
          title: '方块阵列 (Boxes)',
          description: '在密集的方块阵列中寻找红蓝闪烁的目标。',
          routeName: 'BoxesExercise',
          image: '../assets/images/games/boxes.webp'
        }
      ],
        requiredStageToEnter: 1
      }
    },
    meta: {
      requiredStageToEnter: 1}
  },
  {
    path: '/training/shuffle',
    name: 'ShuffleExercise',
    component: () => import('../views/exercises/ShuffleExercise.vue')
  },
  {
    path: '/training/boxes',
    name: 'BoxesExercise',
    component: () => import('../views/exercises/BoxesExercise.vue')
  },
  {
    path: '/training/intro-2',
    name: 'SectionIntroTraining2',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: () => {
      const settingsStore = useSettingsStore()
      const requiredMinutes = Math.floor(settingsStore.requiredTrainingTime / 60)
      return {
        title: '阶段 2：动态融合与扫视',
        subtitle: '追踪动态粒子和螺旋，增强双眼在运动中的融合能力',
        notes: [
          '目标：在动态场景中保持双眼信号的持续输入，不出现某一眼视界消失的情况',
          `时长要求：本阶段至少训练 ${requiredMinutes} 分钟`
        ],
        games: [
          {
            title: '扫视追踪 (Saccadic)',
            description: '快速追踪红蓝交替闪烁的视标，提升扫视能力。',
            routeName: 'SaccadicTrackingExercise',
            image: '../assets/images/games/saccadic.webp'
          },
          {
            title: '旋转螺旋 (Spiral)',
            description: '注视旋转的螺旋线，增强中心凹与周边视野的融合。',
            routeName: 'SpiralExercise',
            image: '../assets/images/games/spiral.webp'
          },
          {
            title: '星空粒子 (Particles)',
            description: '在漫天飞舞的粒子中保持双眼稳定注视。',
            routeName: 'ParticlesExercise',
            image: '../assets/images/games/particles.webp'
          }
        ],
        requiredStageToEnter: 2
      }
    },
    meta: {
      requiredStageToEnter: 2}
  },
  {
    path: '/training/saccadic',
    name: 'SaccadicTrackingExercise',
    component: () => import('../views/exercises/SaccadicTrackingExercise.vue')
  },
  {
    path: '/training/spiral',
    name: 'SpiralExercise',
    component: () => import('../views/exercises/SpiralExercise.vue')
  },
  {
    path: '/training/particles',
    name: 'ParticlesExercise',
    component: () => import('../views/exercises/ParticlesExercise.vue')
  },
  {
    path: '/training/intro-3',
    name: 'SectionIntroTraining3',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: () => {
      const settingsStore = useSettingsStore()
      const requiredMinutes = Math.floor(settingsStore.requiredTrainingTime / 60)
      return {
        title: '阶段 3：集合与分开',
        subtitle: '裂隙尺聚散卡与聚散球视觉训练',
        notes: [
          '目标：随着目标物的靠近和远离，控制双眼肌肉进行斗鸡眼（集合）和放松（分开）',
          '系统将根据您的外斜/内斜检查结果自动生成对应的训练模式',
          `时长要求：本阶段至少训练 ${requiredMinutes} 分钟`
        ],
        games: [
          {
            title: '聚散卡 (Vergence Cards)',
            description: '基于裂隙尺原理，训练阶梯式的集合与分开。',
            routeName: 'VergenceCardsExercise',
            image: '../assets/images/games/vergence-cards.webp'
          },
          {
            title: '聚散球 (Brock String)',
            description: '经典的眼科训练，在3D空间中控制双眼肌肉捏合。',
            routeName: 'BrockStringExercise',
            image: '../assets/images/games/brock-string.webp'
          }
        ],
        requiredStageToEnter: 3
      }
    },
    meta: {
      requiredStageToEnter: 3}
  },
  {
    path: '/training/vergence-cards',
    name: 'VergenceCardsExercise',
    component: () => import('../views/exercises/VergenceCardsExercise.vue')
  },
  {
    path: '/training/brock-string',
    name: 'BrockStringExercise',
    component: () => import('../views/exercises/BrockStringExercise.vue')
  },
  {
    path: '/training/intro-4',
    name: 'SectionIntroTraining4',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '阶段 4：立体视建立',
      subtitle: '在复杂背景下进行高级双眼协同',
      notes: [
        '目标：通过快速的认知和空间判断，重建高级的立体视和手眼协调',
        '注意：下落方块为您的一只眼可见，固定的方块为另一只眼可见'
      ],
      games: [
        {
          title: '进阶立体视 (Stereopsis)',
          description: '持续动态寻找浮起的图形，强化立体视深度感知。',
          routeName: 'StereopsisExercise',
          image: '../assets/images/games/stereopsis.webp'
        },
        {
          title: '俄罗斯方块 (Tetris)',
          description: '经典分视手眼协同训练，必须双眼配合才能拼合方块。',
          routeName: 'TetrisExercise',
          image: '../assets/images/games/tetris.webp'
        }
      ],
      requiredStageToEnter: 4
    },
    meta: {
      requiredStageToEnter: 4}
  },
  {
    path: '/training/tetris',
    name: 'TetrisExercise',
    component: () => import('../views/exercises/TetrisExercise.vue')
  },
  {
    path: '/exercises/stereopsis',
    name: 'StereopsisExercise',
    component: () => import('../views/exercises/StereopsisExercise.vue')
  }
]

export const scrollState: { savedPosition: any } = { savedPosition: null }

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    scrollState.savedPosition = savedPosition
    return false
  }
})

router.afterEach(async () => {
  if (import.meta.env.DEV) return // Skip version check in dev/test environment
  try {
    const res = await fetch(`/twoeyes-vue/version.json?t=${Date.now()}`)
    const data = await res.json()
    // @ts-ignore
    if (data.version && typeof __APP_VERSION__ !== 'undefined' && data.version !== __APP_VERSION__) {
      window.dispatchEvent(new Event('app-update-available'))
    }
  } catch (err) {
    console.error('Failed to check version:', err)
  }
})

// Navigation mode setup based on current route
router.beforeEach((to, _from, next) => {
  const settingsStore = useSettingsStore()
  if (to.name === 'SectionIntroAmblyopia') settingsStore.setExamMode('amblyopia')
  else if (to.name === 'SectionIntroExam') settingsStore.setExamMode('exam')
  else if (to.name === 'SectionIntroVision') settingsStore.setExamMode('vision')
  else if (to.name === 'SectionIntroDiplopia') settingsStore.setExamMode('diplopia')
  next()
})

export default router