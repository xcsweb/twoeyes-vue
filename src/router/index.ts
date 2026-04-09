import { createRouter, createWebHashHistory } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import HomeMenuLevel from '../views/HomeMenuLevel.vue'
import TrainingMenuLevel from '../views/TrainingMenuLevel.vue'
import TheoryLevel from '../views/TheoryLevel.vue'
import PaperDetailLevel from '../views/PaperDetailLevel.vue'
import UserProfileLevel from '../views/UserProfileLevel.vue'

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
    beforeEnter: (_to: any, _from: any, next: any) => {
      const settingsStore = useSettingsStore()
      if (settingsStore.hasSeenIntro) {
        next({ name: 'Home' })
      } else {
        next()
      }
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeMenuLevel
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfileLevel
  },
  {
    path: '/theory',
    name: 'Theory',
    component: TheoryLevel
  },
  {
    path: '/theory/paper/:id',
    name: 'PaperDetail',
    component: PaperDetailLevel
  },
  {
    path: '/training/menu',
    name: 'TrainingMenu',
    component: TrainingMenuLevel
  },
  {
    path: '/exam/intro',
    name: 'SectionIntroExam',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '斜视与双眼视觉检查',
      subtitle: '请在佩戴红蓝眼镜后，尝试将十字准星与圆圈中心对齐',
      notes: [
        '请准备并佩戴好红蓝（或红青）3D眼镜',
        '在接下来的界面中选择您眼镜的对应颜色',
        '保持头部平正，调整眼睛与屏幕的距离',
        '尝试让左眼的红方块和右眼的蓝方块重合'
      ]
    }
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
    path: '/exam/suppression-test',
    name: 'SuppressionTest',
    component: () => import('../views/SuppressionTestLevel.vue')
  },
  {
    path: '/training/intro',
    name: 'SectionIntroTraining',
    component: () => import('../views/SectionIntroLevel.vue'),
    props: {
      title: '阶段 1：基础脱抑制',
      subtitle: '通过简单的颜色匹配和移动，唤醒被抑制的眼睛',
      notes: [
        '目标：在屏幕上同时看到红蓝两种颜色的方块',
        '时长要求：本阶段至少训练 60 秒'
      ],
      games: [
        {
          title: '洗牌训练 (Shuffle)',
          description: '追踪快速移动的红蓝方块，唤醒弱视眼。',
          routeName: 'ShuffleExercise',
          hueRotate: '0deg'
        },
        {
          title: '方块阵列 (Boxes)',
          description: '在密集的方块阵列中寻找红蓝闪烁的目标。',
          routeName: 'BoxesExercise',
          hueRotate: '30deg'
        }
      ],
      requiredStageToEnter: 1
    }
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
    props: {
      title: '阶段 2：动态融合与扫视',
      subtitle: '追踪动态粒子和螺旋，增强双眼在运动中的融合能力',
      notes: [
        '目标：在动态场景中保持双眼信号的持续输入，不出现某一眼视界消失的情况',
        '时长要求：本阶段至少训练 60 秒'
      ],
      games: [
        {
          title: '扫视追踪 (Saccadic)',
          description: '快速追踪红蓝交替闪烁的视标，提升扫视能力。',
          routeName: 'SaccadicTrackingExercise',
          hueRotate: '90deg'
        },
        {
          title: '旋转螺旋 (Spiral)',
          description: '注视旋转的螺旋线，增强中心凹与周边视野的融合。',
          routeName: 'SpiralExercise',
          hueRotate: '120deg'
        },
        {
          title: '星空粒子 (Particles)',
          description: '在漫天飞舞的粒子中保持双眼稳定注视。',
          routeName: 'ParticlesExercise',
          hueRotate: '150deg'
        }
      ],
      requiredStageToEnter: 2
    }
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
    props: {
      title: '阶段 3：集合与分开',
      subtitle: '裂隙尺聚散卡与聚散球视觉训练',
      notes: [
        '目标：随着目标物的靠近和远离，控制双眼肌肉进行斗鸡眼（集合）和放松（分开）',
        '系统将根据您的外斜/内斜检查结果自动生成对应的训练模式',
        '时长要求：本阶段至少训练 60 秒'
      ],
      games: [
        {
          title: '聚散卡 (Vergence Cards)',
          description: '基于裂隙尺原理，训练阶梯式的集合与分开。',
          routeName: 'VergenceCardsExercise',
          hueRotate: '180deg'
        },
        {
          title: '聚散球 (Brock String)',
          description: '经典的眼科训练，在3D空间中控制双眼肌肉捏合。',
          routeName: 'BrockStringExercise',
          hueRotate: '210deg'
        }
      ],
      requiredStageToEnter: 3
    }
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
          title: '俄罗斯方块 (Tetris)',
          description: '经典分视手眼协同训练，必须双眼配合才能拼合方块。',
          routeName: 'TetrisExercise',
          hueRotate: '270deg'
        }
      ],
      requiredStageToEnter: 4
    }
  },
  {
    path: '/training/tetris',
    name: 'TetrisExercise',
    component: () => import('../views/exercises/TetrisExercise.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
