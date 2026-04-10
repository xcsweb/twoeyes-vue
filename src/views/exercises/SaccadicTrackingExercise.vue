<template>
  <div class="exercise-container" @click="handleMiss">
    <div class="progress-hud">
      <span :class="{ 'text-success': stageTime >= 60, 'text-white': stageTime < 60 }">
        本阶段累计训练: {{ stageTime }} / 60 秒
        <span v-if="stageTime >= 60" class="ml-2">✓ 已达标</span>
      </span>
      <div class="score-hud mt-2">
        <span>追踪得分: {{ score }}</span>
      </div>
    </div>

        <div class="instruction-overlay" v-if="showInstruction">
      <h2 class="mb-4">扫视追踪训练 (Saccadic Tracking)</h2>
      <p class="text-body-1">
        请戴好红蓝眼镜。屏幕上会随机出现带有数字的红蓝交替光球。<br/>
        请用眼睛快速追踪光球，并尽快点击它。<br/>
        这能训练您在快速眼动中的双眼交替与同时视能力。
      </p>
      <v-btn color="primary" size="large" class="mt-6" @click="startGame">开始训练</v-btn>
    </div>

    <!-- The Target Ball -->
    <div
      v-if="isPlaying"
      class="target-ball"
      :style="{
        backgroundColor: currentEye === 'left' ? leftColorStr : rightColorStr,
        left: `${targetPos.x}%`,
        top: `${targetPos.y}%`,
        transform: `scale(${targetScale})`
      }"
      @click.stop="handleHit"
    >
      {{ targetNumber }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'

const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const STAGE_NUMBER = 2
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)

const leftColorStr = computed(() => settingsStore.leftEyeColorStr)
const rightColorStr = computed(() => settingsStore.rightEyeColorStr)

const showInstruction = ref(true)
const isPlaying = ref(false)
const score = ref(0)

const currentEye = ref<'left' | 'right'>('left')
const targetPos = ref({ x: 50, y: 50 })
const targetNumber = ref(1)
const targetScale = ref(1.0)

let gameTimerId: number
let stageTimerId: number

const spawnTarget = () => {
  // 随机位置 (边缘留出空间)
  targetPos.value = {
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 70
  }
  
  // 交替眼睛，防止单眼抑制
  currentEye.value = currentEye.value === 'left' ? 'right' : 'left'
  
  // 随机数字吸引黄斑中心凹注意力
  targetNumber.value = Math.floor(Math.random() * 9) + 1

  // 根据分数动态缩小，增加难度
  targetScale.value = Math.max(0.5, 1.0 - score.value * 0.02)
  
  // 如果长时间没点到，强制刷新位置 (模拟眼球扫视)
  if (gameTimerId) clearTimeout(gameTimerId)
  gameTimerId = window.setTimeout(() => {
    if (isPlaying.value) spawnTarget()
  }, Math.max(1000, 3000 - score.value * 100))
}

const handleHit = () => {
  if (!isPlaying.value) return
  score.value += 1
  spawnTarget()
}

const handleMiss = () => {
  // 点击空白处扣分
  if (isPlaying.value && score.value > 0) {
    score.value -= 1
  }
}

const startGame = () => {
  showInstruction.value = false
  isPlaying.value = true
  score.value = 0
  spawnTarget()
  
  stageTimerId = window.setInterval(() => {
    progressStore.addStageTime(STAGE_NUMBER, 1)
  }, 1000)
}

onBeforeUnmount(() => {
  if (gameTimerId) clearTimeout(gameTimerId)
  if (stageTimerId) clearInterval(stageTimerId)
})
</script>

<style scoped>
.exercise-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: crosshair;
}

.progress-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  z-index: 100;
  font-weight: bold;
}

.score-hud {
  font-size: 1.2rem;
  color: #FFD700;
}



.instruction-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
  text-align: center;
  padding: 20px;
}

.target-ball {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
  box-shadow: 0 0 20px currentColor;
  transform-origin: center center;
  transition: all 0.2s ease-out;
  user-select: none;
  /* 确保颜色能够穿透/发光 */
  mix-blend-mode: screen;
}
</style>
