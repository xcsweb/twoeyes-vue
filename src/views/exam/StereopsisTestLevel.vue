<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">立体视筛查</h1>
      <p class="text-grey mb-8">
        请佩戴红蓝/红青眼镜。下面有四个圆圈，其中有一个看起来是<strong>浮起来</strong>的。<br>
        请点击那个浮起来（有立体感）的圆圈。
      </p>

      <div class="text-h6 text-grey mb-4">测试进度: {{ currentTrial + 1 }} / {{ disparities.length }}</div>

      <div class="circles-container mx-auto mb-12">
        <div class="circles-grid">
          <div
            v-for="(circle, index) in circles"
            :key="`circle-${index}`"
            class="circle-wrapper"
            @click="selectCircle(index)"
          >
            <!-- Left eye image -->
            <div
              class="circle-layer left-eye"
              :style="{
                backgroundColor: settingsStore.leftEyeFinalColorStr,
                transform: `translateX(${circle.leftOffset}px)`
              }"
            ></div>
            <!-- Right eye image -->
            <div
              class="circle-layer right-eye"
              :style="{
                backgroundColor: settingsStore.rightEyeFinalColorStr,
                transform: `translateX(${circle.rightOffset}px)`
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '../../store/settings'
import { useFlowManager } from '../../composables/useFlowManager'
import { useRoute } from 'vue-router'

const settingsStore = useSettingsStore()
const { goNext } = useFlowManager()
const route = useRoute()

// 12px, 6px, 3px, 1px disparity
const disparities = [12, 6, 3, 1]
const currentTrial = ref(0)
const results = ref<{ disparity: number, correct: boolean }[]>([])

// Randomly select one of the 4 circles to be the target
const targetIndex = ref(0)

const initTrial = () => {
  targetIndex.value = Math.floor(Math.random() * 4)
}

onMounted(() => {
  initTrial()
})

const currentDisparity = computed(() => disparities[currentTrial.value])

const circles = computed(() => {
  return [0, 1, 2, 3].map(index => {
    if (index === targetIndex.value) {
      // Apply disparity to the target circle
      // Left eye sees image shifted by half disparity
      // Right eye sees image shifted by -half disparity
      const half = currentDisparity.value / 2
      return {
        leftOffset: half,
        rightOffset: -half
      }
    } else {
      return {
        leftOffset: 0,
        rightOffset: 0
      }
    }
  })
})

const selectCircle = (index: number) => {
  const isCorrect = index === targetIndex.value
  results.value.push({ disparity: currentDisparity.value, correct: isCorrect })

  if (currentTrial.value < disparities.length - 1) {
    currentTrial.value++
    initTrial()
  } else {
    finishTest()
  }
}

const finishTest = () => {
  const correctCount = results.value.filter(r => r.correct).length
  
  let resultStatus: 'normal' | 'mild' | 'moderate' | 'severe' = 'severe'
  if (correctCount === 4) {
    resultStatus = 'normal'
  } else if (correctCount === 3) {
    resultStatus = 'mild'
  } else if (correctCount === 2) {
    resultStatus = 'moderate'
  } else {
    resultStatus = 'severe'
  }

  settingsStore.setStereopsisResult(resultStatus)
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

.circles-container {
  width: 320px;
  height: 320px;
}

.circles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 40px;
  width: 100%;
  height: 100%;
}

.circle-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.circle-wrapper:hover {
  transform: scale(1.05);
}

.circle-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 50%;
  mix-blend-mode: screen;
  pointer-events: none;
}
</style>
