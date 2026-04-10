import { useRouter } from 'vue-router'

export function useVisionFlow() {
  const router = useRouter()

  const goNext = (currentRouteName: string) => {
    switch (currentRouteName) {
      case 'SectionIntroVision':
        router.push({ name: 'VisionDistanceAdvice' })
        break
      case 'VisionDistanceAdvice':
        router.push({ name: 'VisionTest' })
        break
      case 'VisionTest':
        router.push({ name: 'AstigmatismTest' })
        break
      case 'AstigmatismTest':
        router.push({ name: 'ColorVisionTest' })
        break
      case 'ColorVisionTest':
        router.push({ name: 'AmslerGridTest' })
        break
      case 'AmslerGridTest':
        router.push({ name: 'ContrastSensitivityTest' })
        break
      case 'ContrastSensitivityTest':
        router.push({ name: 'VisionAdvice' })
        break
      case 'VisionAdvice':
        router.push({ name: 'Home' })
        break
      default:
        console.warn('未知的 Vision 流程节点 (next):', currentRouteName)
        router.push({ name: 'Home' })
    }
  }

  const goBack = (currentRouteName: string) => {
    switch (currentRouteName) {
      case 'VisionDistanceAdvice':
        router.push({ name: 'SectionIntroVision' })
        break
      case 'VisionTest':
        router.push({ name: 'VisionDistanceAdvice' })
        break
      case 'AstigmatismTest':
        router.push({ name: 'VisionTest' })
        break
      case 'ColorVisionTest':
        router.push({ name: 'AstigmatismTest' })
        break
      case 'AmslerGridTest':
        router.push({ name: 'ColorVisionTest' })
        break
      case 'ContrastSensitivityTest':
        router.push({ name: 'AmslerGridTest' })
        break
      case 'VisionAdvice':
        router.push({ name: 'ContrastSensitivityTest' })
        break
      default:
        console.warn('未知的 Vision 流程节点 (back):', currentRouteName)
        router.push({ name: 'Home' })
    }
  }

  return { goNext, goBack }
}
