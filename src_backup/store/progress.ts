import { defineStore } from 'pinia'

import { useSettingsStore } from './settings'

export interface StageData {
  stage: number
  totalTime: number
}

export interface ProgressData {
  unlockedStage: number
  stages: Record<number, StageData>
  firstTrainingDate: string | null
  lastTrainingDate: string | null
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressData => ({
    unlockedStage: 1,
    stages: {
      1: { stage: 1, totalTime: 0 },
      2: { stage: 2, totalTime: 0 },
      3: { stage: 3, totalTime: 0 },
      4: { stage: 4, totalTime: 0 }
    },
    firstTrainingDate: null,
    lastTrainingDate: null
  }),
  getters: {
    trainingDaysCount: (state) => {
      if (!state.firstTrainingDate) return 0
      const firstDate = new Date(state.firstTrainingDate)
      const today = new Date()
      // Calculate difference in days, ignoring hours
      const diffTime = Math.abs(today.getTime() - firstDate.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays + 1 // Include the first day as day 1
    },
    effectiveUnlockedStage: (state) => {
      const settingsStore = useSettingsStore()
      
      const hasAmblyopia = settingsStore.suppressionStatus === 'left' || settingsStore.suppressionStatus === 'right'
      const hasStrabismus = Math.abs(settingsStore.alignmentOffset.x) > 0 || 
                            Math.abs(settingsStore.alignmentOffset.y) > 0 || 
                            settingsStore.suppressionStatus === 'diplopia'
                            
      let stage = state.unlockedStage
      if (hasAmblyopia) {
        stage = Math.max(stage, 1)
      } else if (!hasAmblyopia && hasStrabismus) {
        stage = Math.max(stage, 3)
      } else {
        stage = Math.max(stage, 4)
      }
      return stage
    }
  },
  actions: {
    checkDailyReset() {
      // Get today's date string in YYYY-MM-DD format (local timezone)
      const now = new Date()
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      
      if (this.lastTrainingDate !== todayStr) {
        // If not today, reset all stages' today-time to 0
        Object.keys(this.stages).forEach((key) => {
          this.stages[Number(key)].totalTime = 0
        })
        this.lastTrainingDate = todayStr
      }
    },
    addStageTime(stage: number, timePassed: number) {
      if (!this.firstTrainingDate) {
        this.firstTrainingDate = new Date().toISOString()
      }
      
      this.checkDailyReset()
      
      if (this.stages[stage]) {
        this.stages[stage].totalTime += timePassed
        
        // If they reached the target time today, unlock the next stage
        const settingsStore = useSettingsStore()
        if (
          this.stages[stage].totalTime >= settingsStore.requiredTrainingTime &&
          this.unlockedStage === stage
        ) {
          this.unlockedStage = Math.min(stage + 1, 4) // Assuming 4 is the max stage
        }
      }
    },
    unlockStage(stage: number) {
      this.unlockedStage = Math.max(this.unlockedStage, stage)
    },
    resetProgress() {
      this.unlockedStage = 1
      this.firstTrainingDate = null
      this.lastTrainingDate = null
      this.stages = {
        1: { stage: 1, totalTime: 0 },
        2: { stage: 2, totalTime: 0 },
        3: { stage: 3, totalTime: 0 },
        4: { stage: 4, totalTime: 0 }
      }
    }
  },
  persist: true
})
