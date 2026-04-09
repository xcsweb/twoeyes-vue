import { defineStore } from 'pinia'

export const TARGET_STAGE_TIME = 60

export interface StageData {
  stage: number
  totalTime: number
}

export interface ProgressData {
  unlockedStage: number
  stages: Record<number, StageData>
  firstTrainingDate: string | null
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
    firstTrainingDate: null
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
    }
  },
  actions: {
    addStageTime(stage: number, timePassed: number) {
      if (!this.firstTrainingDate) {
        this.firstTrainingDate = new Date().toISOString()
      }
      
      if (this.stages[stage]) {
        this.stages[stage].totalTime += timePassed
        
        // If they reached the target time, unlock the next stage
        if (
          this.stages[stage].totalTime >= TARGET_STAGE_TIME &&
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
