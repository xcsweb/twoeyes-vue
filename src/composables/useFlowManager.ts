import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useProgressStore } from '../store/progress'

export function useFlowManager() {
  const router = useRouter()
  const route = useRoute()
  const settingsStore = useSettingsStore()
  const progressStore = useProgressStore()

  const navigateForward = (currentRouteName?: string, targetRouteName?: string, requiredStageToEnter?: number) => {
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

    // Otherwise, just use route.meta.nav.next
    const navMeta = route.meta.nav
    if (navMeta && navMeta.next) {
      let finalTarget: any
      if (typeof navMeta.next === 'function') {
        finalTarget = navMeta.next(settingsStore)
      } else {
        finalTarget = navMeta.next
      }

      if (typeof finalTarget === 'string') {
        router.push({ name: finalTarget })
      } else if (finalTarget && typeof finalTarget === 'object') {
        router.push(finalTarget)
      } else {
        router.push({ name: 'Home' })
      }
      return { success: true }
    }

    console.warn(`节点 ${String(currentRouteName || route.name)} 无法识别或没有配置 next 跳转`)
    router.push({ name: 'Home' })
    return { success: true }
  }

  const goBack = (_currentRouteName?: string) => {
    const navMeta = route.meta.nav
    if (navMeta && navMeta.back) {
      if (navMeta.back === true) {
        router.go(-1)
        return
      }

      let finalTarget: any
      if (typeof navMeta.back === 'function') {
        finalTarget = navMeta.back(settingsStore)
      } else {
        finalTarget = navMeta.back
      }

      if (typeof finalTarget === 'string') {
        router.push({ name: finalTarget })
      } else if (finalTarget && typeof finalTarget === 'object') {
        router.push(finalTarget)
      } else {
        router.go(-1)
      }
      return
    }

    router.go(-1)
  }

  return { 
    navigateForward, 
    goBack, 
    goNext: (routeName?: string) => navigateForward(routeName) 
  }
}
