<template>
  <v-container fluid class="exercise-container fill-height bg-black">
    <!-- Top-left corner timer -->
    <div class="progress-hud">
      <span :class="{ 'text-success': isTargetReached, 'text-white': !isTargetReached }">
        剩余训练时间: {{ formattedTime }}
        <span v-if="isTargetReached" class="ml-2">✓ 今日训练已达标</span>
      </span>
    </div>

    <!-- HUD -->
    <PersonalizedHud :game-params="hudParams" />

    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">进阶立体视训练</h1>
      <p class="text-grey mb-8">
        请佩戴红蓝/红青眼镜。下面有三个图形，其中有一个看起来是<strong>浮起来</strong>的。<br>
        请点击那个浮起来（有立体感）的图形。
      </p>

      <div class="shapes-container mx-auto mb-12">
        <div class="shapes-row">
          <div
            v-for="(shape, index) in shapes"
            :key="`shape-${index}`"
            class="shape-wrapper"
            @click="selectShape(index)"
          >
            <!-- Left eye image -->
            <div
              class="shape-layer left-eye"
              :style="{
                backgroundColor: settingsStore.leftEyeFinalColorStr,
                transform: `translateX(${shape.leftOffset}px)`
              }"
            ></div>
            <!-- Right eye image -->
            <div
              class="shape-layer right-eye"
              :style="{
                backgroundColor: settingsStore.rightEyeFinalColorStr,
                transform: `translateX(${shape.rightOffset}px)`
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="showCompletionDialog" max-width="400" persistent>
      <v-card color="grey-darken-4" class="text-center pa-4">
        <v-card-title class="text-h5 text-success mb-4">
          🎉 恭喜完成今日训练！
        </v-card-title>
        <v-card-text class="text-body-1 mb-4">
          您已达到本阶段每日建议的训练时长（15分钟）。
          继续训练可能导致眼睛疲劳，建议您现在休息。
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" variant="elevated" @click="returnToMenu">
            返回菜单
          </v-btn>
          <v-btn color="grey" variant="text" @click="showCompletionDialog = false">
            继续训练
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'
import { useStageTimer } from '../../composables/useStageTimer'
import PersonalizedHud from '../../components/PersonalizedHud.vue'

const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const STAGE_NUMBER = 4
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)

const score = ref(0)
const currentDisparity = ref(12) // start with a larger disparity
const minDisparity = 1
const maxDisparity = 20

let timerId: number

// Randomly select one of the 3 shapes to be the target
const targetIndex = ref(0)

const initTrial = () => {
  targetIndex.value = Math.floor(Math.random() * 3)
}

onMounted(() => {
  initTrial()
  
  // Start progress timer
  timerId = window.setInterval(() => {
    progressStore.addStageTime(STAGE_NUMBER, 1) // Add 1 second
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

const hudParams = computed(() => [
  `当前得分: ${score.value}`,
  `当前视差: ${currentDisparity.value}px`
])

const shapes = computed(() => {
  return [0, 1, 2].map(index => {
    if (index === targetIndex.value) {
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

const selectShape = (index: number) => {
  const isCorrect = index === targetIndex.value
  
  if (isCorrect) {
    score.value++
    // Decrease disparity (make it harder), but don't go below minDisparity
    if (currentDisparity.value > minDisparity) {
      currentDisparity.value--
    }
  } else {
    // Increase disparity (make it easier)
    if (currentDisparity.value < maxDisparity) {
      currentDisparity.value += 2
    }
  }

  initTrial()
}
</script>

<style scoped>
.exercise-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
}

.progress-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.85);
  padding: 8px 16px;
  font-size: 0.85rem;
  white-space: nowrap;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  z-index: 100;
  font-weight: bold;
  pointer-events: none;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.shapes-container {
  width: 100%;
  max-width: 480px;
  height: 160px;
}

.shapes-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.shape-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.shape-wrapper:hover {
  transform: scale(1.05);
}

.shape-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 50%; /* Let's use circles to match test */
  mix-blend-mode: screen;
  pointer-events: none;
}
</style>
