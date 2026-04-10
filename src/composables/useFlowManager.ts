import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { flows, type RouteResolver } from '../config/flowConfig'

export function useFlowManager() {
  const router = useRouter()
  const settingsStore = useSettingsStore()

  const getFlowName = (routeName: string): 'vision' | 'exam' | 'amblyopia' | null => {
    // If it's a vision flow route, return vision
    const isVision = flows.vision.some(n => n.name === routeName)
    if (isVision) return 'vision'
    
    // Otherwise it's exam or amblyopia flow
    // Differentiate using currentExamMode if available, fallback to exam
    if (settingsStore.currentExamMode === 'amblyopia') {
      return 'amblyopia'
    } else {
      return 'exam'
    }
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
