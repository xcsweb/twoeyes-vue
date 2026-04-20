<template>
  <div class="exercise-container" @click="handleMiss">
    <!-- Binocular Fusion Lock: White grid background to prevent eyes from drifting -->
    <div class="fusion-lock-grid"></div>

    <div class="progress-hud">
      <span :class="{ 'text-success': isTargetReached, 'text-white': !isTargetReached }">
        剩余训练时间: {{ formattedTime }}
        <span v-if="isTargetReached" class="ml-2">✓ 今日训练已达标</span>
      </span>
      <div class="score-hud mt-2">
        <span>追踪得分: {{ score }}</span>
      </div>
    <PersonalizedHud />

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

</template>

<script setup lang="ts">
import { useStageTimer } from '../../composables/useStageTimer'

import PersonalizedHud from '../../components/PersonalizedHud.vue'
import { ref, computed, onBeforeUnmount } from 'vue'

import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'

const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const STAGE_NUMBER = 2
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)


const leftColorStr = computed(() => settingsStore.leftEyeFinalColorStr)
const rightColorStr = computed(() => settingsStore.rightEyeFinalColorStr)

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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: crosshair;
  z-index: 1;
}

.fusion-lock-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Very faint white grid visible to both eyes to maintain binocular fusion */
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
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
