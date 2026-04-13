import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useProgressStore } from '../store/progress'
import { flows, type RouteResolver } from '../config/flowConfig'

export function useFlowManager() {
  const router = useRouter()
  const settingsStore = useSettingsStore()
  const progressStore = useProgressStore()

  const getFlowName = (routeName: string): 'vision' | 'exam' | 'amblyopia' | null => {
    if (settingsStore.currentExamMode === 'vision') {
      if (flows.vision.some(n => n.name === routeName)) return 'vision'
    } else if (settingsStore.currentExamMode === 'amblyopia') {
      if (flows.amblyopia.some(n => n.name === routeName)) return 'amblyopia'
    } else if (settingsStore.currentExamMode === 'exam') {
      if (flows.exam.some(n => n.name === routeName)) return 'exam'
    }

    if (flows.vision.some(n => n.name === routeName)) return 'vision'
    if (flows.amblyopia.some(n => n.name === routeName)) return 'amblyopia'
    if (flows.exam.some(n => n.name === routeName)) return 'exam'
    
    return null
  }

  // Unified navigation function for both clinical flows and training stages
  const navigateForward = (currentRouteName: string, targetRouteName?: string, requiredStageToEnter?: number) => {
    // 1. Handle Clinical Exam Flows
    const flowName = getFlowName(currentRouteName)
    if (flowName) {
      if (currentRouteName === 'SectionIntroAmblyopia') settingsStore.setExamMode('amblyopia')
      else if (currentRouteName === 'SectionIntroExam') settingsStore.setExamMode('exam')
      else if (currentRouteName === 'SectionIntroVision') settingsStore.setExamMode('vision')

      const flow = flows[flowName]
      const node = flow.find(n => n.name === currentRouteName)
      if (node && node.next) {
        const nextRoute = typeof node.next === 'function' ? (node.next as RouteResolver)(settingsStore) : node.next
        router.push({ name: nextRoute })
        return { success: true }
      }
    }

    // 2. Handle Training Stages (Intelligent Unlock Check)
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

    console.warn(`节点 ${currentRouteName} 无法识别或没有配置 next 跳转`)
    router.push({ name: 'Home' })
    return { success: true }
  }

  const goBack = (currentRouteName: string) => {
    const flowName = getFlowName(currentRouteName)
    if (!flowName) {
      // Intelligent fallback for non-flow routes like Exercises
      if (currentRouteName.endsWith('Exercise')) {
        // Find which stage intro leads to this exercise, or default to TrainingMenu
        router.push({ name: 'TrainingMenu' })
      } else {
        router.push({ name: 'Home' })
      }
      return
    }

    const flow = flows[flowName]
    const node = flow.find(n => n.name === currentRouteName)

    if (node && node.prev) {
      const prevRoute = typeof node.prev === 'function' ? (node.prev as RouteResolver)(settingsStore) : node.prev
      router.push({ name: prevRoute })
    } else {
      router.push({ name: 'Home' })
    }
  }

  return { getFlowName, navigateForward, goBack, goNext: (route: string) => navigateForward(route) }
}
