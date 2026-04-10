import { defineStore } from 'pinia'

export interface AlignmentRecord {
  date: string
  x: number
  y: number
}

export interface VisionRecord {
  date: string
  left: number
  right: number
}

export interface RGBColor {
  r: number
  g: number
  b: number
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    lensConfig: 'red-cyan', // 'red-cyan' or 'cyan-red'
    leftLense: { r: 255, g: 0, b: 0 },
    rightLense: { r: 0, g: 255, b: 255 },
    alignmentOffset: { x: 0, y: 0 },
    alignmentHistory: [] as AlignmentRecord[],
    visionAcuity: { left: 1.0, right: 1.0 },
    visionHistory: [] as VisionRecord[],
    suppressionStatus: 'none' as 'none' | 'left' | 'right' | 'diplopia',
    penalizationFactor: 0.3, // default to 30%
    hasSeenIntro: false,
    astigmatismResult: null as 'normal' | 'astigmatism' | null,
    colorVisionResult: null as 'normal' | 'deficient' | null,
    macularResult: null as 'normal' | 'abnormal' | null,
    contrastSensitivityResult: null as 'normal' | 'low' | null,
    currentExamMode: null as 'exam' | 'amblyopia' | null,
    testFrequency: 1,
    lastTestTime: 0
  }),
  getters: {
    leftEyeColorStr(state) {
      // If left eye is dominant (right is suppressed), penalize left eye
      let factor = state.suppressionStatus === 'right' ? state.penalizationFactor : 1.0
      return `rgb(${Math.round(state.leftLense.r * factor)}, ${Math.round(state.leftLense.g * factor)}, ${Math.round(state.leftLense.b * factor)})`
    },
    rightEyeColorStr(state) {
      // If right eye is dominant (left is suppressed), penalize right eye
      let factor = state.suppressionStatus === 'left' ? state.penalizationFactor : 1.0
      return `rgb(${Math.round(state.rightLense.r * factor)}, ${Math.round(state.rightLense.g * factor)}, ${Math.round(state.rightLense.b * factor)})`
    },
    personalizedHUDText(state) {
      const parts = []
      parts.push(`眼镜: ${state.lensConfig === 'red-cyan' ? '红青' : '红蓝'}`)
      
      if (state.penalizationFactor < 1.0) {
        parts.push(`亮度: ${Math.round(state.penalizationFactor * 100)}%`)
      }
      
      if (state.alignmentOffset.x !== 0 || state.alignmentOffset.y !== 0) {
        parts.push(`偏移: X:${state.alignmentOffset.x} Y:${state.alignmentOffset.y}`)
      }

      if (state.visionAcuity && (state.visionAcuity.left !== 1.0 || state.visionAcuity.right !== 1.0)) {
        parts.push(`视力: L${state.visionAcuity.left}/R${state.visionAcuity.right}`)
      }

      if (parts.length === 0) {
        return '[个性化] 正常状态'
      }

      return `[个性化] ${parts.join(' | ')}`
    }
  },
  actions: {
    changeLensConfig(config: 'red-cyan' | 'cyan-red') {
      this.lensConfig = config
      if (config === 'red-cyan') {
        this.leftLense = { r: 255, g: 0, b: 0 }
        this.rightLense = { r: 0, g: 255, b: 255 }
      } else {
        this.leftLense = { r: 0, g: 255, b: 255 }
        this.rightLense = { r: 255, g: 0, b: 0 }
      }
    },
    changeLeftLense(color: RGBColor) {
      this.leftLense = color
    },
    changeRightLense(color: RGBColor) {
      this.rightLense = color
    },
    setAlignmentOffset(offset: { x: number; y: number }) {
      this.alignmentOffset = offset
      
      const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
      
      // Initialize if missing
      if (!this.alignmentHistory) {
        this.alignmentHistory = []
      }
      
      // Find if we already have a record for today
      const existingIndex = this.alignmentHistory.findIndex(r => r.date === today)
      
      if (existingIndex >= 0) {
        // Overwrite today's record
        this.alignmentHistory[existingIndex].x = offset.x
        this.alignmentHistory[existingIndex].y = offset.y
      } else {
        // Add new record
        this.alignmentHistory.push({ date: today, x: offset.x, y: offset.y })
      }
    },
    setVisionAcuity(acuity: { left: number; right: number }) {
      this.visionAcuity = acuity

      const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
      
      if (!this.visionHistory) {
        this.visionHistory = []
      }
      
      const existingIndex = this.visionHistory.findIndex(r => r.date === today)
      
      if (existingIndex >= 0) {
        this.visionHistory[existingIndex].left = acuity.left
        this.visionHistory[existingIndex].right = acuity.right
      } else {
        this.visionHistory.push({ date: today, left: acuity.left, right: acuity.right })
      }
    },
    setSuppressionStatus(status: 'none' | 'left' | 'right' | 'diplopia') {
      this.suppressionStatus = status
    },
    setPenalizationFactor(factor: number) {
      this.penalizationFactor = factor
    },
    setHasSeenIntro(value: boolean) {
      this.hasSeenIntro = value
    },
    setAstigmatismResult(result: 'normal' | 'astigmatism' | null) {
      this.astigmatismResult = result
    },
    setColorVisionResult(result: 'normal' | 'deficient' | null) {
      this.colorVisionResult = result
    },
    setMacularResult(result: 'normal' | 'abnormal' | null) {
      this.macularResult = result
    },
    setContrastSensitivityResult(result: 'normal' | 'low' | null) {
      this.contrastSensitivityResult = result
    },
    setExamMode(mode: 'exam' | 'amblyopia' | null) {
      this.currentExamMode = mode
    },
    setTestFrequency(days: number) {
      this.testFrequency = days
    },
    updateLastTestTime() {
      this.lastTestTime = Date.now()
    }
  },
  persist: true
})
