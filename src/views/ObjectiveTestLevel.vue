<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">客观双眼抑制测试</h1>
      
      <div v-if="!isTesting" class="intro-section">
        <p class="text-grey mb-8 text-body-1">
          根据学术研究 (Hess et al., 2010)，主观问答（如看到几个点）容易受心理暗示影响。本测试采用<strong>双眼分视强制选择 (Dichoptic Forced-Choice)</strong> 方法客观量化您的双眼抑制程度。
        </p>
        <v-alert type="info" variant="tonal" class="text-left mb-8">
          <strong>测试方法：</strong><br/>
          请戴好3D眼镜，<strong>双眼同时睁开</strong>注视屏幕中心。<br/>
          屏幕会出现一个视力表上的 <strong>'E'</strong> 字，它会被另一只眼睛看到的干扰图案遮挡。<br/>
          请在下方按钮（或键盘方向键）中选择 'E' 字的开口方向。如果您看不清，请尽量猜测。
        </v-alert>
        <div class="mt-8">
          <v-btn
            color="primary"
            size="x-large"
            class="px-12"
            height="56"
            @click="router.replace({ query: { ...route.query, step: 'test' } })"
          >
            开始测试
          </v-btn>
        </div>
      </div>

      <div v-else-if="!isFinished" class="test-section">
        <div class="text-h6 text-grey mb-4">测试进度: {{ currentTrial + 1 }} / {{ totalTrials }}</div>
        
        <div class="canvas-wrapper mx-auto mb-8">
          <!-- The E symbol -->
          <div 
            class="e-symbol"
            :class="[currentEColorClass, eDirectionClass]"
          >E</div>
          
          <!-- The noise mask -->
          <div 
            class="noise-mask"
            :class="currentNoiseColorClass"
          >
            <!-- Generated random noise blocks -->
            <div v-for="n in 20" :key="n" class="noise-block" :style="getNoiseStyle()"></div>
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
      </div>

      <div v-else class="result-section">
        <v-alert
          :type="resultType"
          variant="tonal"
          class="result-alert text-left mb-6"
          border="start"
        >
          <div class="text-h6 mb-2">客观测试结果分析</div>
          <div class="text-body-1">{{ resultMessage }}</div>
          <div class="text-body-2 mt-4 text-grey">
            左眼准确率: {{ Math.round(leftAccuracy * 100) }}% | 右眼准确率: {{ Math.round(rightAccuracy * 100) }}%
          </div>
        </v-alert>
        
        <div class="mt-8">
          <v-btn
            color="primary"
            size="x-large"
            class="px-12"
            height="56"
            @click="goNext(route.name as string)"
          >
            继续下一步
          </v-btn>
        </div>
      </div>

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useSettingsStore } from '../store/settings'

const settingsStore = useSettingsStore()

// If the global state wants to trigger test start, we can listen for it
// but to keep it clean with bottom nav, we export a method or listen to a custom event
// Actually, since BottomNav triggers routing, the easiest way is to use a route query param
// e.g. /exam/suppression?step=test
import { useRoute, useRouter } from 'vue-router'
import { useFlowManager } from '../composables/useFlowManager'

const route = useRoute()
const router = useRouter()
const { goNext } = useFlowManager()

const isTesting = computed(() => route.query.step === 'test' || route.query.step === 'result')
const isFinished = computed(() => route.query.step === 'result')

const totalTrials = 10 // 5 for left, 5 for right
const currentTrial = ref(0)

// Trials array: { targetEye: 'left' | 'right', direction: string }
const trials = ref<{ targetEye: 'left' | 'right', direction: string }[]>([])
const directions = ['up', 'down', 'left', 'right']

const results = ref<{ targetEye: 'left' | 'right', correct: boolean }[]>([])

const leftAccuracy = ref(0)
const rightAccuracy = ref(0)
const resultMessage = ref('')
const resultType = ref<'success' | 'warning' | 'error'>('success')

const startTest = () => {
  currentTrial.value = 0
  results.value = []
  
  // Generate random trials
  const t = []
  for (let i = 0; i < totalTrials / 2; i++) {
    t.push({ targetEye: 'left' as const, direction: directions[Math.floor(Math.random() * directions.length)] })
    t.push({ targetEye: 'right' as const, direction: directions[Math.floor(Math.random() * directions.length)] })
  }
  // Shuffle
  t.sort(() => Math.random() - 0.5)
  trials.value = t
}

watch(() => route.query.step, (newStep, oldStep) => {
  if (newStep === 'test' && oldStep !== 'test') {
    startTest()
  }
}, { immediate: true })

// Current trial state
const currentTargetEye = computed(() => trials.value[currentTrial.value]?.targetEye || 'left')
const currentDirection = computed(() => trials.value[currentTrial.value]?.direction || 'up')

// Physics: To test Left Eye, we draw the E in the color that ONLY the Left Eye can see.
// Example: If Left Lens is Red, it blocks Cyan light. So a Cyan 'E' on a White background looks Black to the Left Eye.
// The Right Lens is Cyan, which lets Cyan light pass. So a Cyan 'E' on a White background looks White (invisible) to the Right Eye.
// So, to test an eye, we draw the shape in the OPPOSITE color of its lens.
const currentEColorClass = computed(() => {
  const isLeftRed = settingsStore.lensConfig === 'red-cyan'
  if (currentTargetEye.value === 'left') {
    return isLeftRed ? 'color-cyan' : 'color-red'
  } else {
    return isLeftRed ? 'color-red' : 'color-cyan'
  }
})

// The noise mask is drawn in the color of the target eye's lens (so only the OTHER eye sees it as black).
const currentNoiseColorClass = computed(() => {
  const isLeftRed = settingsStore.lensConfig === 'red-cyan'
  if (currentTargetEye.value === 'left') {
    return isLeftRed ? 'color-red' : 'color-cyan'
  } else {
    return isLeftRed ? 'color-cyan' : 'color-red'
  }
})

const eDirectionClass = computed(() => {
  return `dir-${currentDirection.value}`
})

const getNoiseStyle = () => {
  // Generate random positions for noise blocks
  const size = 30 + Math.random() * 40
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 80}%`,
    opacity: 0.8
  }
}

const submitAnswer = (dir: string) => {
  const isCorrect = dir === currentDirection.value
  results.value.push({
    targetEye: currentTargetEye.value as 'left'|'right',
    correct: isCorrect
  })
  
  if (currentTrial.value < totalTrials - 1) {
    currentTrial.value++
  } else {
    finishTest()
  }
}

const finishTest = () => {
  const leftTrials = results.value.filter(r => r.targetEye === 'left')
  const rightTrials = results.value.filter(r => r.targetEye === 'right')
  
  const leftCorrect = leftTrials.filter(r => r.correct).length
  const rightCorrect = rightTrials.filter(r => r.correct).length
  
  leftAccuracy.value = leftCorrect / leftTrials.length
  rightAccuracy.value = rightCorrect / rightTrials.length
  
  // Logic to determine suppression
  const threshold = 0.6 // Minimum acceptable accuracy
  const diff = leftAccuracy.value - rightAccuracy.value
  
  if (leftAccuracy.value >= threshold && rightAccuracy.value >= threshold && Math.abs(diff) <= 0.2) {
    resultType.value = 'success'
    resultMessage.value = '您的双眼识别准确率均良好且相近。客观数据表明，您目前没有明显的单眼抑制现象。'
    settingsStore.setSuppressionStatus('none')
  } else if (leftAccuracy.value < rightAccuracy.value && diff <= -0.3) {
    resultType.value = 'warning'
    resultMessage.value = '在客观强制选择中，您的左眼准确率明显低于右眼。这表明您的左眼存在视觉抑制，大脑更依赖右眼。接下来，系统将为您客观测算最佳惩罚亮度。'
    settingsStore.setSuppressionStatus('left')
  } else if (rightAccuracy.value < leftAccuracy.value && diff >= 0.3) {
    resultType.value = 'warning'
    resultMessage.value = '在客观强制选择中，您的右眼准确率明显低于左眼。这表明您的右眼存在视觉抑制，大脑更依赖左眼。接下来，系统将为您客观测算最佳惩罚亮度。'
    settingsStore.setSuppressionStatus('right')
  } else if (leftAccuracy.value < threshold && rightAccuracy.value < threshold) {
    resultType.value = 'error'
    resultMessage.value = '您的双眼准确率都偏低。这可能是由于严重的复视、交替性抑制或测试时的操作误差。建议您寻求专业的临床视光评估。'
    settingsStore.setSuppressionStatus('diplopia')
  } else {
    // Borderline cases
    resultType.value = 'success'
    resultMessage.value = '您的双眼表现存在轻微差异，但仍在正常融合范围内。系统将按正常双眼单视模式为您配置训练。'
    settingsStore.setSuppressionStatus('none')
  }

  // Navigate to result step
  router.replace({ query: { ...route.query, step: 'result' } })
}

// Keyboard support
const handleKeydown = (e: KeyboardEvent) => {
  if (!isTesting.value || isFinished.value) return
  switch(e.key) {
    case 'ArrowUp': submitAnswer('up'); break;
    case 'ArrowDown': submitAnswer('down'); break;
    case 'ArrowLeft': submitAnswer('left'); break;
    case 'ArrowRight': submitAnswer('right'); break;
  }
}

onMounted(() => {
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
  background-color: white;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255,255,255,0.2);
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
  /* Disable text selection */
  user-select: none;
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
}

.home-btn {
  border-radius: 12px;
  font-weight: bold;
  color: black !important;
}
</style>
