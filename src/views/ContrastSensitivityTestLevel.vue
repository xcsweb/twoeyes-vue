<template>
  <v-container fluid class="level-container fill-height bg-white">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-black">对比敏感度筛查</h1>
      
      <div class="test-section">
        <p class="text-h6 text-grey-darken-3 mb-6">
          请在明亮的光线下，距离屏幕约 1 米处。<br>
          您将看到一个方向随机的 "E" 字，其对比度会逐渐降低。<br>
          请选择 "E" 字开口的方向。如果看不清，请点击“看不清”。
        </p>

        <div class="text-h6 text-grey mb-4">测试进度: {{ currentLevel + 1 }} / {{ contrastLevels.length }}</div>
        
        <div class="canvas-wrapper mx-auto mb-8 d-flex align-center justify-center">
          <div 
            class="e-optotype" 
            :style="optotypeStyle"
          >
            E
          </div>
        </div>

        <div class="controls mt-8">
          <v-row justify="center" class="mb-4">
            <v-btn size="x-large" color="primary" variant="outlined" class="mx-2 direction-btn" @click="submitAnswer('up')">上</v-btn>
          </v-row>
          <v-row justify="center" class="mb-4">
            <v-btn size="x-large" color="primary" variant="outlined" class="mx-2 direction-btn" @click="submitAnswer('left')">左</v-btn>
            <v-btn size="x-large" color="error" variant="text" class="mx-2 direction-btn" @click="submitAnswer('unknown')">看不清</v-btn>
            <v-btn size="x-large" color="primary" variant="outlined" class="mx-2 direction-btn" @click="submitAnswer('right')">右</v-btn>
          </v-row>
          <v-row justify="center" class="mb-4">
            <v-btn size="x-large" color="primary" variant="outlined" class="mx-2 direction-btn" @click="submitAnswer('down')">下</v-btn>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '../store/settings'
import { useVisionFlow } from '../composables/useVisionFlow'
import { useRoute } from 'vue-router'

const settingsStore = useSettingsStore()
const { goNext } = useVisionFlow()
const route = useRoute()

// Contrasts to test (opacity)
const contrastLevels = [1.0, 0.5, 0.25, 0.1, 0.05, 0.02]
const currentLevel = ref(0)
const directions = ['up', 'down', 'left', 'right']
const currentDirection = ref('up')

const generateDirection = () => {
  const randomIndex = Math.floor(Math.random() * directions.length)
  currentDirection.value = directions[randomIndex]
}

onMounted(() => {
  generateDirection()
})

const rotationMap: Record<string, string> = {
  'up': 'rotate(-90deg)',
  'down': 'rotate(90deg)',
  'left': 'rotate(180deg)',
  'right': 'rotate(0deg)'
}

const optotypeStyle = computed(() => {
  return {
    transform: rotationMap[currentDirection.value],
    opacity: contrastLevels[currentLevel.value],
    color: 'black'
  }
})

const submitAnswer = (answer: string) => {
  if (answer === 'unknown' || answer !== currentDirection.value) {
    // Failed at current level
    finishTest(currentLevel.value)
    return
  }

  // Correct
  if (currentLevel.value < contrastLevels.length - 1) {
    currentLevel.value++
    generateDirection()
  } else {
    // Passed all
    finishTest(contrastLevels.length)
  }
}

const finishTest = (passedLevels: number) => {
  // If user passes up to 5% contrast (level index 4), it's normal
  // Let's say passing level 3 (10% contrast) or higher is considered normal.
  if (passedLevels >= 4) {
    settingsStore.setContrastSensitivityResult('normal')
  } else {
    settingsStore.setContrastSensitivityResult('low')
  }
  
  goNext(route.name as string)
}
</script>

<style scoped>
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.canvas-wrapper {
  width: 200px;
  height: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.e-optotype {
  font-size: 120px;
  font-family: sans-serif;
  font-weight: bold;
  line-height: 1;
  user-select: none;
  transition: opacity 0.3s ease;
}

.direction-btn {
  width: 80px;
  height: 80px !important;
  font-size: 20px;
}
</style>
