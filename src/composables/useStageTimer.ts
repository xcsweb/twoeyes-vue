import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore, TARGET_STAGE_TIME } from '../store/progress'

export function useStageTimer(stageNumber: number) {
  const progressStore = useProgressStore()
  const router = useRouter()
  
  const stageTime = computed(() => progressStore.stages[stageNumber]?.totalTime || 0)
  
  const remainingTime = computed(() => Math.max(0, TARGET_STAGE_TIME - stageTime.value))
  
  const formattedTime = computed(() => {
    const mins = Math.floor(remainingTime.value / 60)
    const secs = remainingTime.value % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  })

  const isTargetReached = computed(() => stageTime.value >= TARGET_STAGE_TIME)
  const showCompletionDialog = ref(false)

  // Show dialog only once when it transitions to reached during the session
  watch(isTargetReached, (newVal, oldVal) => {
    if (newVal && !oldVal) {
      showCompletionDialog.value = true
    }
  })

  const returnToMenu = () => {
    showCompletionDialog.value = false
    router.push({ name: 'TrainingMenu' })
  }

  return {
    formattedTime,
    isTargetReached,
    showCompletionDialog,
    returnToMenu
  }
}
