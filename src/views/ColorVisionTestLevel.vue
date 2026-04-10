<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">客观色觉筛查</h1>
      
      <div class="test-section">
        <p class="text-h6 text-white mb-6">
          请在明亮的光线下，注视下方由彩色圆点组成的图案。<br>
          图案中隐藏了一个由红橙色点组成的<strong>数字 (0-9)</strong>，请在下方键盘中选出您看到的数字。
        </p>

        <div class="text-h6 text-grey mb-4">测试进度: {{ currentTrial + 1 }} / {{ totalTrials }}</div>
        
        <div class="canvas-wrapper mx-auto mb-8 bg-white d-flex align-center justify-center">
          <div class="dot-matrix" :key="currentTrial">
            <div 
              v-for="i in 144" 
              :key="i"
              class="dot"
              :style="getDotStyle(i - 1)"
            ></div>
          </div>
        </div>

        <div class="controls mt-8">
          <div class="text-h6 text-white mb-4">请选择您看到的数字：</div>
          <v-row justify="center" class="mb-2">
            <v-btn v-for="n in [1, 2, 3]" :key="n" size="x-large" color="white" variant="outlined" class="mx-2 number-btn" @click="submitAnswer(n)">{{n}}</v-btn>
          </v-row>
          <v-row justify="center" class="mb-2">
            <v-btn v-for="n in [4, 5, 6]" :key="n" size="x-large" color="white" variant="outlined" class="mx-2 number-btn" @click="submitAnswer(n)">{{n}}</v-btn>
          </v-row>
          <v-row justify="center" class="mb-2">
            <v-btn v-for="n in [7, 8, 9]" :key="n" size="x-large" color="white" variant="outlined" class="mx-2 number-btn" @click="submitAnswer(n)">{{n}}</v-btn>
          </v-row>
          <v-row justify="center" class="mb-4 align-center">
            <v-btn size="large" color="error" variant="text" class="mx-2" @click="submitAnswer(-1)">看不清</v-btn>
            <v-btn size="x-large" color="white" variant="outlined" class="mx-2 number-btn" @click="submitAnswer(0)">0</v-btn>
            <v-btn size="large" color="transparent" variant="text" class="mx-2" disabled></v-btn>
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

const totalTrials = 6
const currentTrial = ref(0)
const results = ref<{ digit: number, correct: boolean }[]>([])
const trials = ref<number[]>([])

// 5x7 pixel art for digits 0-9
const digitMaps: Record<number, string[]> = {
  0: [" 111 ", "1   1", "1   1", "1   1", "1   1", "1   1", " 111 "],
  1: ["  1  ", " 11  ", "  1  ", "  1  ", "  1  ", "  1  ", " 111 "],
  2: [" 111 ", "1   1", "    1", "  11 ", " 1   ", "1    ", "11111"],
  3: [" 111 ", "1   1", "    1", "  11 ", "    1", "1   1", " 111 "],
  4: ["   1 ", "  11 ", " 1 1 ", "1  1 ", "11111", "   1 ", "   1 "],
  5: ["11111", "1    ", "1111 ", "    1", "    1", "1   1", " 111 "],
  6: ["  11 ", " 1   ", "1    ", "1111 ", "1   1", "1   1", " 111 "],
  7: ["11111", "    1", "   1 ", "  1  ", " 1   ", " 1   ", " 1   "],
  8: [" 111 ", "1   1", "1   1", " 111 ", "1   1", "1   1", " 111 "],
  9: [" 111 ", "1   1", "1   1", " 1111", "    1", "   1 ", " 11  "]
}

// Map 5x7 digit to 12x12 matrix (center it: offset X=3, Y=2)
const getDigitIndices = (digit: number) => {
  const indices: number[] = []
  const map = digitMaps[digit]
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '1') {
        const matrixX = x + 3
        const matrixY = y + 2
        indices.push(matrixY * 12 + matrixX)
      }
    }
  }
  return indices
}

onMounted(() => {
  const t: number[] = []
  for (let i = 0; i < totalTrials; i++) {
    t.push(Math.floor(Math.random() * 10))
  }
  trials.value = t
})

const currentDigit = computed(() => trials.value[currentTrial.value] ?? 0)
const targetIndices = computed(() => getDigitIndices(currentDigit.value))

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
  const isTarget = targetIndices.value.includes(index)
  // High spatial noise: dot sizes vary randomly from 12px to 24px
  const size = Math.floor(Math.random() * 12) + 12 
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: getRandomColor(isTarget)
  }
}

const submitAnswer = (answerDigit: number) => {
  const isCorrect = answerDigit === currentDigit.value
  results.value.push({ digit: currentDigit.value, correct: isCorrect })

  if (currentTrial.value < totalTrials - 1) {
    currentTrial.value++
  } else {
    finishTest()
  }
}

const finishTest = () => {
  const correctCount = results.value.filter(r => r.correct).length
  
  // Objective criteria: With 10 options, guessing is 10%.
  // Getting >= 4 out of 6 correct indicates normal color vision clearly.
  if (correctCount >= Math.floor(totalTrials * 0.6)) {
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
  width: 320px;
  height: 320px;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 30px rgba(255,255,255,0.2);
}

.dot-matrix {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  width: 100%;
  height: 100%;
  padding: 15px;
  gap: 2px;
  place-items: center;
}

.dot {
  border-radius: 50%;
}

.number-btn {
  width: 64px;
  height: 64px !important;
  font-size: 24px;
}
</style>
