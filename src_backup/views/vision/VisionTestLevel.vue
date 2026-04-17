<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">普通视力测试</h1>
      
      <!-- Mid-test Prompt (Switching Eyes) -->
      <div v-if="isMidPrompt" class="intro-section">
        <p class="text-h5 text-white mb-8">
          左眼测试已完成。
        </p>
        <v-alert type="info" variant="tonal" class="text-left mb-8">
          <strong>接下来测试右眼：</strong><br/>
          请用手或遮挡板遮住<strong>左眼</strong>，保持 40cm 距离，准备测试右眼。
        </v-alert>
        <v-btn color="primary" size="x-large" @click="startRightEyeTest">开始右眼测试</v-btn>
      </div>

      <!-- Test Area -->
      <div v-else-if="!isFinished" class="test-section">
        <div class="text-h6 text-grey mb-4">
          正在测试: {{ currentEye === 'left' ? '左眼' : '右眼' }}
        </div>
        
        <div class="canvas-wrapper mx-auto mb-8 bg-white">
          <!-- The E symbol scaled by acuity -->
          <div 
            class="e-symbol text-black"
            :class="eDirectionClass"
            :style="eSymbolStyle"
          >E</div>
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
      </div>

      <!-- Result Section (before routing next) -->
      <div v-else class="result-section mt-8">
        <v-alert
          type="success"
          variant="tonal"
          class="result-alert text-left mb-6"
          border="start"
        >
          <div class="text-h6 mb-2">测试完成</div>
          <div class="text-body-1">
            您的初步视力测试已结束。<br/>
            左眼视力: {{ leftAcuity }}<br/>
            右眼视力: {{ rightAcuity }}
          </div>
        </v-alert>
        
        <v-btn
          color="white"
          variant="elevated"
          size="x-large"
          block
          class="home-btn mt-6"
          @click="finishAndGoNext"
        >
          查看详细报告
        </v-btn>
      </div>

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useSettingsStore } from '../../store/settings'
import { useFlowManager } from '../../composables/useFlowManager'

const route = useRoute()
const settingsStore = useSettingsStore()
const { goNext } = useFlowManager()

const acuityLevels = [0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0]
const directions = ['up', 'down', 'left', 'right']

const currentEye = ref<'left' | 'right'>('left')
const currentLevelIndex = ref(0)
const mistakes = ref(0)
const currentDirection = ref('up')

const leftAcuity = ref(0.1)
const rightAcuity = ref(0.1)

const isMidPrompt = ref(false)
const isFinished = ref(false)

const randomizeDirection = () => {
  currentDirection.value = directions[Math.floor(Math.random() * directions.length)]
}

const eDirectionClass = computed(() => {
  return `dir-${currentDirection.value}`
})

const currentAcuityValue = computed(() => {
  return acuityLevels[currentLevelIndex.value]
})

// Font size scales inversely with acuity.
// Base size for 1.0 acuity: 20px (example at 40cm, might need to be adjusted)
// To make 0.1 visible, we multiply by (1.0 / acuity).
// Actually, standard E for 1.0 at 40cm is quite small (about 1.75mm, roughly 6-7px on standard screen).
// Let's use 20px for 1.0 to make it reasonable on mobile screens, or maybe a bit larger since it's an app.
// We'll use 20px as base for 1.0. So 0.1 is 200px.
const eSymbolStyle = computed(() => {
  const baseSize = 20
  const size = baseSize / currentAcuityValue.value
  return {
    fontSize: `${size}px`,
    lineHeight: 1
  }
})

const startRightEyeTest = () => {
  isMidPrompt.value = false
  currentEye.value = 'right'
  currentLevelIndex.value = 0
  mistakes.value = 0
  randomizeDirection()
}

const submitAnswer = (dir: string) => {
  if (isMidPrompt.value || isFinished.value) return

  const isCorrect = dir === currentDirection.value

  if (isCorrect) {
    // Correct answer
    // If not at max level, proceed to next level
    if (currentLevelIndex.value < acuityLevels.length - 1) {
      currentLevelIndex.value++
      mistakes.value = 0 // reset mistakes for the new level
      randomizeDirection()
    } else {
      // Reached max level
      recordEyeResult(acuityLevels[acuityLevels.length - 1])
    }
  } else {
    // Wrong answer
    mistakes.value++
    if (mistakes.value >= 2) {
      // Failed twice at current level. The passed acuity is the previous level.
      // Store the numeric value or 0.1 if failed at 0.1
      const passedNumeric = currentLevelIndex.value > 0 ? acuityLevels[currentLevelIndex.value - 1] : 0.1
      recordEyeResult(passedNumeric)
    } else {
      // Try again at current level
      randomizeDirection()
    }
  }
}

const recordEyeResult = (acuity: number) => {
  if (currentEye.value === 'left') {
    leftAcuity.value = acuity
    isMidPrompt.value = true
  } else {
    rightAcuity.value = acuity
    isFinished.value = true
  }
}

const finishAndGoNext = () => {
  settingsStore.setVisionAcuity({
    left: leftAcuity.value,
    right: rightAcuity.value
  })
  goNext(route.name as string)
}

onBeforeRouteLeave((_to, _from, next) => {
  if (isFinished.value) {
    settingsStore.setVisionAcuity({
      left: leftAcuity.value,
      right: rightAcuity.value
    })
  }
  next()
})

const handleKeydown = (e: KeyboardEvent) => {
  if (isMidPrompt.value || isFinished.value) return
  switch(e.key) {
    case 'ArrowUp': submitAnswer('up'); break;
    case 'ArrowDown': submitAnswer('down'); break;
    case 'ArrowLeft': submitAnswer('left'); break;
    case 'ArrowRight': submitAnswer('right'); break;
  }
}

onMounted(() => {
  randomizeDirection()
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
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255,255,255,0.2);
}

.e-symbol {
  font-family: sans-serif;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  /* Transform for rotation and centering */
  transform-origin: center center;
  user-select: none;
}

.dir-up { transform: translate(-50%, -50%) rotate(-90deg); }
.dir-down { transform: translate(-50%, -50%) rotate(90deg); }
.dir-left { transform: translate(-50%, -50%) scaleX(-1); }
.dir-right { transform: translate(-50%, -50%); }

.home-btn {
  border-radius: 12px;
  font-weight: bold;
  color: black !important;
}
</style>
