<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">客观散光筛查</h1>
      
      <div class="test-section">
        <p class="text-h6 text-white mb-6">
          请在明亮的光线下，保持 40cm 距离。<br>
          屏幕中将出现细小的条纹图案，请仔细辨认它们的**延伸方向**。<br>
          如果您平时佩戴眼镜，请戴上您的眼镜。
        </p>

        <div class="text-h6 text-grey mb-4">测试进度: {{ currentTrial + 1 }} / {{ totalTrials }}</div>
        
        <div class="canvas-wrapper mx-auto mb-8 bg-white d-flex align-center justify-center">
          <!-- Procedural grating (stripes) representing astigmatism target -->
          <div class="grating-container" :style="gratingStyle"></div>
        </div>

        <div class="controls mt-8">
          <div class="text-h6 text-white mb-4">请选择条纹的方向：</div>
          
          <!-- Cross directional buttons for orientation selection -->
          <v-row justify="center" class="mb-4">
            <v-btn size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer(135)">
              <div style="width: 28px; height: 3px; background-color: white; transform: rotate(135deg);"></div>
            </v-btn>
            <v-btn size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer(90)">
              <div style="width: 28px; height: 3px; background-color: white; transform: rotate(90deg);"></div>
            </v-btn>
            <v-btn size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer(45)">
              <div style="width: 28px; height: 3px; background-color: white; transform: rotate(45deg);"></div>
            </v-btn>
          </v-row>
          <v-row justify="center" class="mb-4">
            <v-btn size="x-large" color="white" variant="outlined" class="mx-2" @click="submitAnswer(0)">
              <div style="width: 28px; height: 3px; background-color: white; transform: rotate(0deg);"></div>
            </v-btn>
            <v-btn size="x-large" color="error" variant="outlined" class="mx-2" @click="submitAnswer(-1)">看不清</v-btn>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '../store/settings'
import { useFlowManager } from '../composables/useFlowManager'
import { useRoute } from 'vue-router'

const settingsStore = useSettingsStore()
const { goNext } = useFlowManager()
const route = useRoute()

// Four main axes for astigmatism
const angles = [0, 45, 90, 135]
const totalTrials = 8
const currentTrial = ref(0)
const results = ref<{ angle: number, correct: boolean }[]>([])

// Randomize trials (2 of each angle)
const trials = ref<number[]>([])

onMounted(() => {
  const t = []
  for (let i = 0; i < 2; i++) {
    t.push(...angles)
  }
  // Shuffle
  t.sort(() => Math.random() - 0.5)
  trials.value = t
})

const currentAngle = computed(() => trials.value[currentTrial.value] ?? 0)

// Create a high frequency, low contrast repeating linear gradient
const gratingStyle = computed(() => {
  const angle = currentAngle.value
  // Use a fine line pattern that tests astigmatism
  // Low contrast (e.g. gray on lighter gray) and fine pitch
  return {
    transform: `rotate(${angle}deg)`,
    background: `repeating-linear-gradient(
      0deg,
      #999 0px,
      #999 2px,
      #ccc 2px,
      #ccc 4px
    )`
  }
})

const submitAnswer = (selectedAngle: number) => {
  const isCorrect = selectedAngle === currentAngle.value
  results.value.push({ angle: currentAngle.value, correct: isCorrect })

  if (currentTrial.value < totalTrials - 1) {
    currentTrial.value++
  } else {
    finishTest()
  }
}

const finishTest = () => {
  // Analyze astigmatism.
  // If user fails consistently on one or two axes but gets others right, 
  // or generally has poor accuracy, flag as astigmatism.
  const correctCount = results.value.filter(r => r.correct).length
  
  if (correctCount >= totalTrials - 1) {
    settingsStore.setAstigmatismResult('normal')
  } else {
    settingsStore.setAstigmatismResult('astigmatism')
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
  width: 250px;
  height: 250px;
  border-radius: 50%; /* circular aperture */
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255,255,255,0.2);
  background-color: #ccc;
}

.grating-container {
  width: 200%;
  height: 200%;
  position: absolute;
  top: -50%;
  left: -50%;
  /* The rotation and gradient is applied via inline style */
}
</style>
