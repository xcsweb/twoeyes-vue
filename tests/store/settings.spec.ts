import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../../src/store/settings'

describe('Settings Store Color Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should calculate leftEyeFinalColorStr correctly for red-cyan lens with no suppression', () => {
    const store = useSettingsStore()
    store.changeLensConfig('red-cyan') // left: red, right: cyan
    store.setSuppressionStatus('none')
    store.setCalibratedColorIntensity({ red: 0.8, cyan: 0.9 })
    
    // left eye is red. red intensity is 0.8. no penalization.
    // left: { r: 255, g: 0, b: 0 } -> 255 * 0.8 = 204
    expect(store.leftEyeFinalColorStr).toBe('rgb(204, 0, 0)')
    
    // right eye is cyan. cyan intensity is 0.9. no penalization.
    // right: { r: 0, g: 255, b: 255 } -> 255 * 0.9 = 230
    expect(store.rightEyeFinalColorStr).toBe('rgb(0, 230, 230)')
  })

  it('should apply penalization factor correctly when left eye is suppressed', () => {
    const store = useSettingsStore()
    store.changeLensConfig('red-cyan')
    // suppressionStatus: 'left' means left eye is suppressed, so right eye (dominant) is penalized
    store.setSuppressionStatus('left')
    store.setPenalizationFactor(0.5)
    store.setCalibratedColorIntensity({ red: 1.0, cyan: 1.0 })

    // left eye (suppressed) -> factor = 1.0
    expect(store.leftEyeFinalColorStr).toBe('rgb(255, 0, 0)')
    
    // right eye (dominant) -> factor = 0.5
    // right: { r: 0, g: 255, b: 255 } -> 255 * 0.5 = 128 (Math.round(127.5) = 128)
    expect(store.rightEyeFinalColorStr).toBe('rgb(0, 128, 128)')
  })

  it('should apply penalization factor correctly when right eye is suppressed', () => {
    const store = useSettingsStore()
    store.changeLensConfig('cyan-red') // left: cyan, right: red
    // suppressionStatus: 'right' means right eye is suppressed, so left eye (dominant) is penalized
    store.setSuppressionStatus('right')
    store.setPenalizationFactor(0.3)
    store.setCalibratedColorIntensity({ red: 0.5, cyan: 0.8 })

    // left eye is cyan. intensity is 0.8. dominant (right suppressed) -> factor = 0.3
    // left: { r: 0, g: 255, b: 255 } -> 255 * 0.8 * 0.3 = 61.2 -> 61
    expect(store.leftEyeFinalColorStr).toBe('rgb(0, 61, 61)')
    
    // right eye is red. intensity is 0.5. suppressed -> factor = 1.0
    // right: { r: 255, g: 0, b: 0 } -> 255 * 0.5 * 1.0 = 127.5 -> 128
    expect(store.rightEyeFinalColorStr).toBe('rgb(128, 0, 0)')
  })
})
