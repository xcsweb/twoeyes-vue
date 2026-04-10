import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

export function useExamFlow() {
  const router = useRouter()
  const settingsStore = useSettingsStore()

  // 统一的下一步跳转逻辑
  const goNext = (currentRouteName: string) => {
    switch (currentRouteName) {
      case 'SectionIntroExam':
      case 'SectionIntroAlignment':
      case 'SectionIntroAmblyopia':
        router.push({ name: 'LensSelection' })
        break
      case 'LensSelection':
        router.push({ name: 'LensConfirmation' })
        break
      case 'LensConfirmation':
        router.push({ name: 'DistanceAdvice' })
        break
      case 'DistanceAdvice':
        router.push({ name: 'SuppressionTest' })
        break
      case 'SuppressionTest':
        // 客观测试结果：如果没有强弱眼或复视，直接跳过对比度平衡测试
        if (settingsStore.suppressionStatus === 'none' || settingsStore.suppressionStatus === 'diplopia') {
          settingsStore.setPenalizationFactor(1.0)
          if (settingsStore.currentExamMode === 'amblyopia') {
            router.push({ name: 'AmblyopiaAdvice' })
          } else {
            router.push({ name: 'SectionIntroAlignment' })
          }
        } else {
          router.push({ name: 'ContrastTest' })
        }
        break
      case 'ContrastTest':
        if (settingsStore.currentExamMode === 'amblyopia') {
          router.push({ name: 'AmblyopiaAdvice' })
        } else {
          router.push({ name: 'SectionIntroAlignment' })
        }
        break
      case 'SectionIntroAlignment':
        router.push({ name: 'AlignmentExercise' })
        break
      case 'AlignmentExercise':
        router.push({ name: 'AlignmentAdvice' })
        break
      case 'AlignmentAdvice':
        router.push({ name: 'Home' })
        break
      default:
        console.warn('未知的 Exam 流程节点 (next):', currentRouteName)
        router.push({ name: 'Home' })
    }
  }

  // 统一的上一步跳转逻辑
  const goBack = (currentRouteName: string) => {
    switch (currentRouteName) {
      case 'LensSelection':
        if (settingsStore.currentExamMode === 'amblyopia') {
          router.push({ name: 'SectionIntroAmblyopia' })
        } else {
          router.push({ name: 'SectionIntroExam' })
        }
        break
      case 'LensConfirmation':
        router.push({ name: 'LensSelection' })
        break
      case 'DistanceAdvice':
        router.push({ name: 'LensConfirmation' })
        break
      case 'SuppressionTest':
        router.push({ name: 'DistanceAdvice' })
        break
      case 'ContrastTest':
        router.push({ name: 'SuppressionTest' })
        break
      case 'AmblyopiaAdvice':
        if (settingsStore.suppressionStatus === 'none' || settingsStore.suppressionStatus === 'diplopia') {
          router.push({ name: 'SuppressionTest' })
        } else {
          router.push({ name: 'ContrastTest' })
        }
        break
      case 'SectionIntroAlignment':
        // 如果没有强弱眼，说明上一步是直接从 SuppressionTest 跳过来的
        if (settingsStore.suppressionStatus === 'none' || settingsStore.suppressionStatus === 'diplopia') {
          router.push({ name: 'SuppressionTest' })
        } else {
          router.push({ name: 'ContrastTest' })
        }
        break
      case 'AlignmentExercise':
        router.push({ name: 'SectionIntroAlignment' })
        break
      case 'AlignmentAdvice':
        router.push({ name: 'AlignmentExercise' })
        break
      default:
        console.warn('未知的 Exam 流程节点 (back):', currentRouteName)
        router.push({ name: 'Home' })
    }
  }

  return { goNext, goBack }
}
