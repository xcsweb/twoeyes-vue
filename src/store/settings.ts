import { defineStore } from 'pinia'

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
    suppressionStatus: 'none' as 'none' | 'left' | 'right' | 'diplopia',
    hasSeenIntro: false
  }),
  getters: {
    leftEyeColorStr(state) {
      // If left eye is dominant (right is suppressed), penalize left eye
      let factor = state.suppressionStatus === 'right' ? 0.3 : 1.0
      return `rgb(${Math.round(state.leftLense.r * factor)}, ${Math.round(state.leftLense.g * factor)}, ${Math.round(state.leftLense.b * factor)})`
    },
    rightEyeColorStr(state) {
      // If right eye is dominant (left is suppressed), penalize right eye
      let factor = state.suppressionStatus === 'left' ? 0.3 : 1.0
      return `rgb(${Math.round(state.rightLense.r * factor)}, ${Math.round(state.rightLense.g * factor)}, ${Math.round(state.rightLense.b * factor)})`
    }
  },
  actions: {
    changeLensConfig(config: string) {
      this.lensConfig = config
    },
    changeLeftLense(color: RGBColor) {
      this.leftLense = color
    },
    changeRightLense(color: RGBColor) {
      this.rightLense = color
    },
    setAlignmentOffset(offset: { x: number; y: number }) {
      this.alignmentOffset = offset
    },
    setSuppressionStatus(status: 'none' | 'left' | 'right' | 'diplopia') {
      this.suppressionStatus = status
    },
    setHasSeenIntro(value: boolean) {
      this.hasSeenIntro = value
    }
  },
  persist: true
})
