<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">客观色觉筛查</h1>
      
      <div class="test-section">
        <p class="text-h6 text-white mb-6">
          请在明亮的光线下，注视下方由彩色圆点组成的图案。<br>
          图案中隐藏了一个由红橙色点组成的 <strong>'E'</strong> 字，请指出它的<strong>开口方向</strong>。
        </p>

        <div class="text-h6 text-grey mb-4">测试进度: {{ currentTrial + 1 }} / {{ totalTrials }}</div>
        
        <div class="canvas-wrapper mx-auto mb-8 bg-white d-flex align-center justify-center">
          <div class="dot-matrix" :class="`dir-${currentDirection}`" :key="currentTrial">
            <div 
              v-for="i in 100" 
              :key="i"
              class="dot"
              :style="getDotStyle(i - 1)"
            ></div>
          </div>
        </div>

        <div class="controls mt-8">
          <div class="text-h6 text-white mb-4">请选择 'E' 的开口方向：</div>
          <v-row justify="center" class="mb-4">
            <v-btn icon="mdi-arrow-up-bold" size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer('up')"></v-btn>
          </v-row>
          <v-row justify="center" class="mb-4">
            <v-btn icon="mdi-arrow-left-bold" size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer('left')"></v-btn>
            <v-btn icon="mdi-arrow-down-bold" size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer('down')"></v-btn>
            <v-btn icon="mdi-arrow-right-bold" size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer('right')"></v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn color="error" variant="text" @click="submitAnswer('none')">看不清</v-btn>
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

const directions = ['up', 'down', 'left', 'right']
const totalTrials = 12
const currentTrial = ref(0)
const results = ref<{ dir: string, correct: boolean }[]>([])
const trials = ref<string[]>([])

// A simple matrix representation of a standard 'E' facing RIGHT
// We will use CSS transform to rotate it for other directions
const eShapeIndices = [
  22, 23, 24, 25, 26, 27,
  32,
  42, 43, 44, 45, 46,
  52,
  62,
  72, 73, 74, 75, 76, 77
]

onMounted(() => {
  const t: string[] = []
  for (let i = 0; i < 3; i++) {
    t.push(...directions)
  }
  // Shuffle
  t.sort(() => Math.random() - 0.5)
  trials.value = t
})

const currentDirection = computed(() => trials.value[currentTrial.value] ?? 'right')

// Random colors (red-green confusion colors with strict luminance noise)
const getRandomColor = (isTarget: boolean) => {
  // Cambridge Colour Test principle: random luminance to destroy edge cues
  // Lightness varies strictly between 30% and 70% for BOTH target and background
  const l = Math.floor(Math.random() * 40) + 30
  
  if (isTarget) {
    // Red-Orange hue (0-25), high saturation
    const h = Math.floor(Math.random() * 25)
    const s = Math.floor(Math.random() * 30) + 70 // 70-100%
    return `hsl(${h}, ${s}%, ${l}%)`
  } else {
    // Green-Yellow hue (80-140), medium-high saturation
    const h = Math.floor(Math.random() * 60) + 80
    const s = Math.floor(Math.random() * 40) + 50 // 50-90%
    return `hsl(${h}, ${s}%, ${l}%)`
  }
}

const getDotStyle = (index: number) => {
  const isTarget = eShapeIndices.includes(index)
  // High spatial noise: dot sizes vary randomly from 12px to 24px
  const size = Math.floor(Math.random() * 12) + 12 
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: getRandomColor(isTarget)
  }
}

const submitAnswer = (answerDir: string) => {
  const isCorrect = answerDir === currentDirection.value
  results.value.push({ dir: currentDirection.value, correct: isCorrect })

  if (currentTrial.value < totalTrials - 1) {
    currentTrial.value++
  } else {
    finishTest()
  }
}

const finishTest = () => {
  const correctCount = results.value.filter(r => r.correct).length
  
  // Objective criteria: if they fail to see the colored E, they have color vision deficiency
  if (correctCount >= Math.ceil(totalTrials * 0.85)) {
    settingsStore.setColorVisionResult('normal')
  } else {
    settingsStore.setColorVisionResult('deficient')
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
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 30px rgba(255,255,255,0.2);
}

.dot-matrix {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  width: 100%;
  height: 100%;
  padding: 10px;
  gap: 2px;
  place-items: center;
}

/* Rotate the entire grid to point the 'E' in different directions */
.dir-right { transform: rotate(0deg); }
.dir-down { transform: rotate(90deg); }
.dir-left { transform: rotate(180deg); }
.dir-up { transform: rotate(-90deg); }

.dot {
  border-radius: 50%;
}
</style>
