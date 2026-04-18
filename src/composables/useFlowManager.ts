import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useProgressStore } from '../store/progress'
import { useHistoryStore } from '../store/history'

export function useFlowManager() {
  const router = useRouter()
  const route = useRoute()
  const settingsStore = useSettingsStore()
  const progressStore = useProgressStore()
  const historyStore = useHistoryStore()

  const navigateForward = (currentRouteName?: string, targetRouteName?: string, requiredStageToEnter?: number) => {
    // 记录当前路由到历史栈 (如果存在)
    const nameToPush = currentRouteName || (route.name as string)
    if (nameToPush && nameToPush !== 'Home') {
      historyStore.pushRoute(nameToPush)
    }

    // If targetRouteName is provided (used for navigating to specific games/stages)
    if (targetRouteName) {
      if (requiredStageToEnter && progressStore.effectiveUnlockedStage < requiredStageToEnter) {
        const requiredMinutes = Math.floor(settingsStore.requiredTrainingTime / 60)
        return { 
          success: false, 
          error: `此阶段尚未解锁！(需要完成阶段 ${requiredStageToEnter - 1} 并在其游戏内累计满 ${requiredMinutes} 分钟)` 
        }
      }
      router.push({ name: targetRouteName })
      return { success: true }
    }

    // Otherwise, without navMeta, we just fallback to Home
    console.warn(`节点 ${String(currentRouteName || route.name)} 无法识别或没有配置 next 跳转，由于移除了 bottom nav，请确保传入 targetRouteName`)
    router.push({ name: 'Home' })
    return { success: true }
  }

  const goBack = (currentRouteName?: string) => {
    const name = currentRouteName || (route.name as string)

    // Hardcoded specific fallbacks for deep links
    if (name === 'PaperDetail') return router.replace({ name: 'Theory' })
    if (name === 'ShuffleExercise' || name === 'BoxesExercise') return router.replace({ name: 'SectionIntroTraining' })
    if (name === 'SaccadicTrackingExercise' || name === 'SpiralExercise' || name === 'ParticlesExercise') return router.replace({ name: 'SectionIntroTraining2' })
    if (name === 'VergenceCardsExercise' || name === 'BrockStringExercise') return router.replace({ name: 'SectionIntroTraining3' })
    if (name === 'StereopsisExercise' || name === 'TetrisExercise') return router.replace({ name: 'SectionIntroTraining4' })

    // Pop the last route from the intelligent history stack
    const prev = historyStore.popRoute()

    if (prev && prev !== 'Home') {
      router.replace({ name: prev })
      return { success: true }
    }

    // Ultimate fallback
    if (window.history.state && window.history.state.back) {
      router.back()
    } else {
      router.replace({ name: 'Home' })
    }
    return { success: true }
  }

  const goNext = (currentRouteName?: string) => {
    const name = currentRouteName || route.name as string
    const mode = settingsStore.currentExamMode

    if (mode === 'vision') {
      const flow = [
        'SectionIntroVision',
        'UserInfoForm',
        'VisionDistanceAdvice',
        'VisionTest',
        'AstigmatismTest',
        'ColorVisionTest',
        'AmslerGridTest',
        'ContrastSensitivityTest',
        'VisionAdvice'
      ]
      const idx = flow.indexOf(name)
      if (idx !== -1 && idx < flow.length - 1) {
        return navigateForward(name, flow[idx + 1])
      }
    } else if (mode === 'amblyopia') {
      const flow = [
        'SectionIntroAmblyopia',
        'UserInfoForm',
        'LensSelection',
        'LensConfirmation',
        'DistanceAdvice',
        'SuppressionTest',
        'ContrastTest',
        'AmblyopiaAdvice'
      ]
      const idx = flow.indexOf(name)
      if (idx !== -1 && idx < flow.length - 1) {
        return navigateForward(name, flow[idx + 1])
      }
    } else if (mode === 'exam') {
      const flow = [
        'SectionIntroExam',
        'UserInfoForm',
        'LensSelection',
        'LensConfirmation',
        'SectionIntroAlignment',
        'DistanceAdvice',
        'AlignmentExercise',
        'AlignmentAdvice',
        'StereopsisTest'
      ]
      const idx = flow.indexOf(name)
      if (idx !== -1 && idx < flow.length - 1) {
        return navigateForward(name, flow[idx + 1])
      }
    }

    return navigateForward(name, 'Home')
  }

  return { 
    navigateForward, 
    goBack, 
    goNext
  }
}
