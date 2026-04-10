<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">
        客观暗光惩罚阈值测定
      </h1>
      
      <div v-if="!isFinished">
        <p v-if="route.query.step !== 'test'" class="text-grey mb-8 text-body-1">
          系统检测到您的 <strong class="text-warning">{{ weakEyeName }}</strong> 存在视觉抑制。<br/>
          接下来，系统将通过<strong>自适应噪声掩蔽阶梯算法</strong>，为您测算打破双眼抑制的最佳惩罚参数。<br/>
          请<strong>双眼同时睁开</strong>，在干扰块的掩蔽下，尽力找出屏幕中 E 字的开口方向。
        </p>

        <template v-else>
          <div class="text-h6 text-grey mb-4">测试进度: {{ trialCount + 1 }} / {{ maxTrials }} (难度自动调节中...)</div>

          <div class="canvas-wrapper mx-auto mb-8">
            <!-- The E symbol (Weak Eye, 100% opacity) -->
            <div 
              class="e-symbol"
              :class="[eColorClass, eDirectionClass]"
            >E</div>
            
            <!-- The noise mask (Strong Eye, dynamic opacity) -->
            <div 
              class="noise-mask"
              :class="noiseColorClass"
            >
              <!-- Generated random noise blocks -->
              <div v-for="n in 30" :key="n" class="noise-block" :style="getNoiseStyle()"></div>
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
          </div>
        </template>
      </div>

      <div v-else class="result-section mt-10">
        <v-alert
          type="success"
          variant="tonal"
          class="result-alert text-left mb-6"
          border="start"
        >
          <div class="text-h6 mb-2">临界阈值测定成功</div>
          <div class="text-body-1">
            系统已成功测算出您的双眼视觉平衡点。<br/>
            在后续的康复训练中，系统会自动将您强眼（{{ strongEyeName }}）的亮度参数强制降低为 <strong>{{ Math.round(testOpacity * 100) }}%</strong>。
          </div>
        </v-alert>
        
      </div>

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()

const isFinished = computed(() => route.query.step === 'result')

const isLeftWeak = computed(() => settingsStore.suppressionStatus === 'left')
const weakEyeName = computed(() => isLeftWeak.value ? '左眼' : '右眼')
const strongEyeName = computed(() => isLeftWeak.value ? '右眼' : '左眼')

// Staircase test states
const testOpacity = ref(0.85) // Start with strong eye at 85% opacity
const consecutiveCorrect = ref(0)
const trialCount = ref(0)
const maxTrials = 12

const directions = ['up', 'down', 'left', 'right']
const currentDirection = ref(directions[Math.floor(Math.random() * directions.length)])

// Visual mapping: The weak eye sees the E (drawn in opposite color of its lens so it turns black)
// But actually, for dichoptic presentation on black background:
// Left Red Lens sees Red. Right Cyan Lens sees Cyan.
// So if we want the weak eye to see the E, we draw the E in the WEAK eye's lens color.
const eColorClass = computed(() => {
  const isLeftRed = settingsStore.lensConfig === 'red-cyan'
  if (isLeftWeak.value) {
    return isLeftRed ? 'color-red' : 'color-cyan'
  } else {
    return isLeftRed ? 'color-cyan' : 'color-red'
  }
})

const noiseColorClass = computed(() => {
  const isLeftRed = settingsStore.lensConfig === 'red-cyan'
  if (!isLeftWeak.value) {
    return isLeftRed ? 'color-red' : 'color-cyan'
  } else {
    return isLeftRed ? 'color-cyan' : 'color-red'
  }
})

const eDirectionClass = computed(() => {
  return `dir-${currentDirection.value}`
})

const getNoiseStyle = () => {
  // Generate random positions and sizes for noise blocks
  const size = 20 + Math.random() * 50
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    opacity: testOpacity.value
  }
}

const finishTest = () => {
  // Threshold found or max trials reached
  router.replace({ query: { ...route.query, step: 'result' } })
}

const submitAnswer = (dir: string) => {
  if (isFinished.value) return
  
  trialCount.value++
  const isCorrect = dir === currentDirection.value

  if (isCorrect) {
    consecutiveCorrect.value++
    if (consecutiveCorrect.value >= 2) {
      finishTest()
      return
    }
  } else {
    // Incorrect: strong eye is still suppressing weak eye. Reduce strong eye opacity.
    consecutiveCorrect.value = 0
    testOpacity.value = Math.max(0.1, Number((testOpacity.value - 0.15).toFixed(2)))
  }

  if (trialCount.value >= maxTrials) {
    // Reached max trials, take the current opacity
    finishTest()
    return
  }

  // Next trial
  currentDirection.value = directions[Math.floor(Math.random() * directions.length)]
}

// Reset state when starting test
watch(() => route.query.step, (newStep, oldStep) => {
  if (newStep === 'test' && oldStep !== 'test') {
    testOpacity.value = 0.85
    consecutiveCorrect.value = 0
    trialCount.value = 0
    currentDirection.value = directions[Math.floor(Math.random() * directions.length)]
  }
}, { immediate: true })

// Ensure data is saved whenever user leaves the route
onBeforeRouteLeave((_to, _from, next) => {
  if (isFinished.value) {
    settingsStore.setPenalizationFactor(testOpacity.value)
  }
  next()
})

// Keyboard support
const handleKeydown = (e: KeyboardEvent) => {
  if (isFinished.value) return
  switch(e.key) {
    case 'ArrowUp': submitAnswer('up'); break;
    case 'ArrowDown': submitAnswer('down'); break;
    case 'ArrowLeft': submitAnswer('left'); break;
    case 'ArrowRight': submitAnswer('right'); break;
  }
}

onMounted(() => {
  // If user bypassed objective test or has no suppression, redirect out
  if (settingsStore.suppressionStatus === 'none' || settingsStore.suppressionStatus === 'diplopia') {
    settingsStore.setPenalizationFactor(1.0)
    router.replace({ name: 'SectionIntroAlignment' })
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
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
  background-color: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255,255,255,0.05);
}

.e-symbol {
  font-family: sans-serif;
  font-size: 180px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  line-height: 1;
  transform-origin: center center;
  user-select: none;
  /* Add glow so it's clearly visible against black */
  text-shadow: 0 0 10px currentColor;
}

.dir-up { transform: translate(-50%, -50%) rotate(-90deg); }
.dir-down { transform: translate(-50%, -50%) rotate(90deg); }
.dir-left { transform: translate(-50%, -50%) scaleX(-1); }
.dir-right { transform: translate(-50%, -50%); }

.color-red { color: #ff0000; }
.color-cyan { color: #00ffff; }

.noise-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.noise-block {
  position: absolute;
  background-color: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.home-btn {
  border-radius: 12px;
  font-weight: bold;
  color: black !important;
}
</style>
