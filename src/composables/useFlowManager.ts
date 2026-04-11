import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { flows, type RouteResolver } from '../config/flowConfig'

export function useFlowManager() {
  const router = useRouter()
  const settingsStore = useSettingsStore()

  const getFlowName = (routeName: string): 'vision' | 'exam' | 'amblyopia' | null => {
    if (settingsStore.currentExamMode === 'vision') {
      // Still verify it's part of vision flow just in case
      if (flows.vision.some(n => n.name === routeName)) return 'vision'
    } else if (settingsStore.currentExamMode === 'amblyopia') {
      if (flows.amblyopia.some(n => n.name === routeName)) return 'amblyopia'
    } else if (settingsStore.currentExamMode === 'exam') {
      if (flows.exam.some(n => n.name === routeName)) return 'exam'
    }

    // Fallback: search across all flows if currentExamMode is out of sync
    if (flows.vision.some(n => n.name === routeName)) return 'vision'
    if (flows.amblyopia.some(n => n.name === routeName)) return 'amblyopia'
    if (flows.exam.some(n => n.name === routeName)) return 'exam'
    
    return null
  }

  const goNext = (currentRouteName: string) => {
    const flowName = getFlowName(currentRouteName)
    if (!flowName) {
      console.warn('未知的流程节点 (next):', currentRouteName)
      router.push({ name: 'Home' })
      return
    }

    const flow = flows[flowName]
    const node = flow.find(n => n.name === currentRouteName)

    if (node && node.next) {
      const nextRoute = typeof node.next === 'function' ? (node.next as RouteResolver)(settingsStore) : node.next
      router.push({ name: nextRoute })
    } else {
      console.warn(`节点 ${currentRouteName} 没有配置 next 跳转，或者找不到该节点`)
      router.push({ name: 'Home' })
    }
  }

  const goBack = (currentRouteName: string) => {
    const flowName = getFlowName(currentRouteName)
    if (!flowName) {
      console.warn('未知的流程节点 (back):', currentRouteName)
      router.push({ name: 'Home' })
      return
    }

    const flow = flows[flowName]
    const node = flow.find(n => n.name === currentRouteName)

    if (node && node.prev) {
      const prevRoute = typeof node.prev === 'function' ? (node.prev as RouteResolver)(settingsStore) : node.prev
      router.push({ name: prevRoute })
    } else {
      console.warn(`节点 ${currentRouteName} 没有配置 prev 跳转，或者找不到该节点`)
      router.push({ name: 'Home' })
    }
  }

  return { goNext, goBack }
}
