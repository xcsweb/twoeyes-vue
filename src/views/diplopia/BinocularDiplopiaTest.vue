<template>
  <v-container fluid class="fill-height bg-black pa-0">
    <div class="test-container w-100 h-100 d-flex flex-column align-center justify-center position-relative">
      
      <!-- Top instructions -->
      <div class="instructions text-center mt-4 position-absolute" style="top: 5%; z-index: 10;">
        <h2 class="text-h4 text-white mb-2">双眼复视测试</h2>
        <p class="text-h6 text-grey-lighten-1 mb-4">
          请戴上您的红青（或红蓝）3D眼镜。<br>
          （左眼红片，右眼青/蓝片）
        </p>
        
        <div v-if="step === 'ask'" class="ask-section bg-grey-darken-4 pa-6 rounded-lg elevation-4">
          <p class="text-h5 text-white mb-6">您是否看到两个分离的圆点（一红一青）？</p>
          <div class="d-flex justify-center gap-4">
            <v-btn color="error" size="x-large" @click="handleHasSeparation(true)" class="mx-2">
              <v-icon start>mdi-circle-multiple-outline</v-icon>
              有分离
            </v-btn>
            <v-btn color="success" size="x-large" @click="handleHasSeparation(false)" class="mx-2">
              <v-icon start>mdi-circle-slice-8</v-icon>
              融为一体
            </v-btn>
          </div>
        </div>
        
        <div v-if="step === 'adjust'" class="adjust-section bg-grey-darken-4 pa-6 rounded-lg elevation-4">
          <p class="text-h6 text-white mb-2">
            双眼复视测量原理：利用滤光片进行分视。
          </p>
          <p class="text-body-1 text-grey-lighten-1 mb-4">
            现在屏幕上固定了一个青点（右眼可见），并且您可以移动一个红点（左眼可见）。<br>
            请使用方向键移动红点，直到它与青点<strong>主观上重合为一体（或呈白色）</strong>。<br>
            当您主观感觉两点重合时，它们在屏幕上的物理距离，就是您双眼隐斜视导致复视的偏差量！
          </p>

          <div class="text-center mb-2">
            <span class="text-h6 text-info">当前偏移: 水平 {{ offsetX }}px, 垂直 {{ offsetY }}px</span>
          </div>

          <div class="control-pad d-flex flex-column align-center my-4">
            <v-btn icon="mdi-arrow-up" size="large" color="primary" class="mb-2" @click="moveDot(0, -10)"></v-btn>
            <div class="d-flex">
              <v-btn icon="mdi-arrow-left" size="large" color="primary" class="mr-2" @click="moveDot(-10, 0)"></v-btn>
              <v-btn icon="mdi-circle-small" size="large" color="grey" @click="resetDot"></v-btn>
              <v-btn icon="mdi-arrow-right" size="large" color="primary" class="ml-2" @click="moveDot(10, 0)"></v-btn>
            </div>
            <v-btn icon="mdi-arrow-down" size="large" color="primary" class="mt-2" @click="moveDot(0, 10)"></v-btn>
          </div>

          <v-btn color="success" size="large" block @click="finishTest">
            完成调整
          </v-btn>
        </div>
      </div>

      <!-- Test Area -->
      <div class="test-area position-relative w-100 h-100" style="mix-blend-mode: screen;">
        <!-- Right eye target (Cyan) - Fixed -->
        <div class="target-dot right-eye-dot position-absolute rounded-circle" style="width: 30px; height: 30px; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #00FFFF; mix-blend-mode: screen;"></div>
        
        <!-- Left eye target (Red) - Movable -->
        <div 
          class="target-dot left-eye-dot position-absolute rounded-circle" 
          :style="{
            width: '30px', 
            height: '30px',
            top: '50%',
            left: '50%',
            backgroundColor: '#FF0000',
            mixBlendMode: 'screen',
            transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`
          }"
        ></div>
      </div>

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFlowManager } from '../../composables/useFlowManager'
import { useSettingsStore } from '../../store/settings'

const { goNext } = useFlowManager()
const settingsStore = useSettingsStore()

// State
const step = ref<'ask' | 'adjust'>('ask')
const offsetX = ref(0)
const offsetY = ref(0)
const hasSeparation = ref(false)

// Actions
const handleHasSeparation = (separated: boolean) => {
  hasSeparation.value = separated
  if (separated) {
    step.value = 'adjust'
    // Start with some initial separation if they see it separated but we don't know where
    // Wait, the task says "If there is binocular diplopia caused by strabismus, the user will see two dots separated. Provide a control pad to let the user move the red dot until the red and cyan dots subjectively merge into one white dot. Record the offset."
    // The initial dots are exactly at the same position. If they see them separated, it's due to their eyes.
    offsetX.value = 0
    offsetY.value = 0
  } else {
    finishTest()
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

const finishTest = () => {
  const result = {
    hasSeparation: hasSeparation.value,
    offsetX: offsetX.value,
    offsetY: offsetY.value
  }
  
  settingsStore.setBinocularDiplopiaResult(result)
  console.log('Binocular Diplopia Result:', result)
  
  // Navigate to the next view
  goNext()
}
</script>

<style scoped>
.test-container {
  overflow: hidden;
}
.test-area {
  background-color: black;
}
</style>
