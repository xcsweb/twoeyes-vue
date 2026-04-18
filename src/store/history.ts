import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const routeStack = ref<string[]>([])

  const pushRoute = (name: string) => {
    // Avoid pushing the same route consecutively
    if (routeStack.value.length === 0 || routeStack.value[routeStack.value.length - 1] !== name) {
      routeStack.value.push(name)
    }
  }

  const popRoute = (): string | undefined => {
    return routeStack.value.pop()
  }

  const clearHistory = () => {
    routeStack.value = []
  }

  return {
    routeStack,
    pushRoute,
    popRoute,
    clearHistory
  }
}, {
  persist: true
})
