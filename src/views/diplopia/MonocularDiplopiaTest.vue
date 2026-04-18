<template>
  <v-container fluid class="fill-height bg-black pa-0">
    <div class="test-container w-100 h-100 d-flex flex-column align-center justify-center position-relative">
      
      <!-- Top instructions -->
      <div class="instructions text-center mt-4 position-absolute" style="top: 5%; z-index: 10;">
        <h2 class="text-h4 text-white mb-2">单眼复视测试 - {{ currentEyeLabel }}</h2>
        <p class="text-h6 text-grey-lighten-1 mb-4">
          请遮盖您的{{ otherEyeLabel }}。<br>
          注视屏幕中央的白点。
        </p>
        
        <div v-if="step === 'ask'" class="ask-section bg-grey-darken-4 pa-6 rounded-lg elevation-4">
          <p class="text-h5 text-white mb-6">您是否看到这个白点有重影（鬼影）？</p>
          <div class="d-flex justify-center gap-4">
            <v-btn color="error" size="x-large" @click="handleHasGhost(true)" class="mx-2">
              <v-icon start>mdi-eye-plus</v-icon>
              有重影
            </v-btn>
            <v-btn color="success" size="x-large" @click="handleHasGhost(false)" class="mx-2">
              <v-icon start>mdi-eye-check</v-icon>
              无重影
            </v-btn>
          </div>
        </div>
        
        <div v-if="step === 'adjust'" class="adjust-section bg-grey-darken-4 pa-6 rounded-lg elevation-4">
          <p class="text-h6 text-white mb-4">
            请使用方向键，将暗白色的参考点移动到您看到的重影位置。
          </p>
          
          <div class="control-pad d-flex flex-column align-center my-4">
            <v-btn icon="mdi-arrow-up" size="large" color="primary" class="mb-2" @click="moveDot(0, -10)"></v-btn>
            <div class="d-flex">
              <v-btn icon="mdi-arrow-left" size="large" color="primary" class="mr-2" @click="moveDot(-10, 0)"></v-btn>
              <v-btn icon="mdi-circle-small" size="large" color="grey" @click="resetDot"></v-btn>
              <v-btn icon="mdi-arrow-right" size="large" color="primary" class="ml-2" @click="moveDot(10, 0)"></v-btn>
            </div>
            <v-btn icon="mdi-arrow-down" size="large" color="primary" class="mt-2" @click="moveDot(0, 10)"></v-btn>
          </div>
          
          <v-btn color="success" size="large" block @click="finishEye">
            完成调整
          </v-btn>
        </div>
      </div>

      <!-- Test Area -->
      <div class="test-area position-relative w-100 h-100">
        <!-- Main target dot -->
        <div class="target-dot position-absolute bg-white rounded-circle" style="width: 20px; height: 20px; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
        
        <!-- Reference dot for ghosting -->
        <div 
          v-if="step === 'adjust'"
          class="reference-dot position-absolute bg-white rounded-circle opacity-40" 
          :style="{
            width: '20px', 
            height: '20px',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`
          }"
        ></div>
      </div>

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFlowManager } from '../../composables/useFlowManager'
import { useSettingsStore } from '../../store/settings'

const { goNext } = useFlowManager()
const settingsStore = useSettingsStore()

// State
const currentEye = ref<'right' | 'left'>('right') // Start with right eye
const step = ref<'ask' | 'adjust'>('ask')
const offsetX = ref(0)
const offsetY = ref(0)

// Store results
const results = ref({
  right: { hasGhost: false, offsetX: 0, offsetY: 0 },
  left: { hasGhost: false, offsetX: 0, offsetY: 0 }
})

// Computed
const currentEyeLabel = computed(() => currentEye.value === 'right' ? '右眼' : '左眼')
const otherEyeLabel = computed(() => currentEye.value === 'right' ? '左眼' : '右眼')

// Actions
const handleHasGhost = (hasGhost: boolean) => {
  if (hasGhost) {
    step.value = 'adjust'
    offsetX.value = 0
    offsetY.value = 0
  } else {
    results.value[currentEye.value].hasGhost = false
    finishEye()
  }
}

const moveDot = (dx: number, dy: number) => {
  offsetX.value += dx
  offsetY.value += dy
}

const resetDot = () => {
  offsetX.value = 0
  offsetY.value = 0
}

const finishEye = () => {
  if (step.value === 'adjust') {
    results.value[currentEye.value] = {
      hasGhost: true,
      offsetX: offsetX.value,
      offsetY: offsetY.value
    }
  }

  if (currentEye.value === 'right') {
    // Switch to left eye
    currentEye.value = 'left'
    step.value = 'ask'
    offsetX.value = 0
    offsetY.value = 0
  } else {
    // Finished both eyes, proceed
    settingsStore.setMonocularDiplopiaResult(results.value)
    console.log('Monocular Diplopia Results:', results.value)
    goNext()
  }
}
</script>

<style scoped>
.test-container {
  overflow: hidden;
}
.opacity-40 {
  opacity: 0.4;
}
</style>
