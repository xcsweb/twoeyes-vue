<template>
  <div class="exercise-container">
    <div class="progress-hud">
      <span :class="{ 'text-success': stageTime >= 60, 'text-white': stageTime < 60 }">
        本阶段今日训练: {{ stageTime }} / 60 秒
        <span v-if="stageTime >= 60" class="ml-2">✓ 今日训练已达标</span>
      </span>
    </div>
    
        <div class="instruction-overlay">
      <p class="text-body-1">
        <strong class="text-h6">{{ isExophoria ? '外斜视集合训练 (BO)' : '内斜视散开训练 (BI)' }}</strong><br/><br/>
        请看着下方的两个圆环，{{ instructionText }}。<br/>
        当两个圆环融合成<strong>一个带有十字准星的完整圆环</strong>时，点击“已融合”进入下一级难度。
      </p>
    </div>

    <div class="canvas-area">
      <!-- 模拟实体卡片/裂隙尺 -->
      <div 
        class="vergence-card left-card"
        :style="{ 
          borderColor: leftColorStr,
          transform: `translateX(-${separation / 2}px)`
        }"
      >
        <div class="inner-cross horizontal" :style="{ backgroundColor: leftColorStr }"></div>
        <div class="inner-cross vertical" :style="{ backgroundColor: leftColorStr }"></div>
      </div>

      <div 
        class="vergence-card right-card"
        :style="{ 
          borderColor: rightColorStr,
          transform: `translateX(${separation / 2}px)`
        }"
      >
        <div class="inner-cross horizontal" :style="{ backgroundColor: rightColorStr }"></div>
        <div class="inner-cross vertical" :style="{ backgroundColor: rightColorStr }"></div>
      </div>
    </div>

    <div class="controls-overlay">
      <div class="level-indicator mb-4">当前难度等级：{{ currentLevel }}</div>
      <v-btn
        color="primary"
        size="x-large"
        class="action-btn"
        @click="increaseDifficulty"
      >
        已成功融合 (增加难度)
      </v-btn>
      <v-btn
        color="error"
        variant="outlined"
        class="action-btn mt-4"
        @click="decreaseDifficulty"
        v-if="currentLevel > 1"
      >
        无法融合 (降低难度)
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'

const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const STAGE_NUMBER = 3
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)

const leftColorStr = computed(() => settingsStore.leftEyeColorStr)
const rightColorStr = computed(() => settingsStore.rightEyeColorStr)

// 根据用户的隐斜视 offset 决定是内斜还是外斜
// 负数 -> 外斜视 (Exophoria) -> 需要训练集合 (Convergence, BO)
// 正数 -> 内斜视 (Esophoria) -> 需要训练散开 (Divergence, BI)
const isExophoria = computed(() => settingsStore.alignmentOffset.x <= 0)

const instructionText = computed(() => {
  if (isExophoria.value) {
    return "尝试做『斗鸡眼』的动作，让视线在屏幕前方交叉，把两个圆环拉到一起"
  } else {
    return "尝试『看穿屏幕』，假装在看屏幕后方的远景，让视线散开把两个圆环拉到一起"
  }
})

const currentLevel = ref(1)
const baseSeparation = 40 // 初始分离度 40px

// 分离度计算
// 如果是外斜（练集合），我们应该拉开红蓝图的距离，迫使眼睛向内对齐
// 如果是内斜（练散开），我们需要产生非交叉视差，迫使眼睛向外发散
const separation = computed(() => {
  const distance = baseSeparation + (currentLevel.value - 1) * 15
  // 外斜视(练集合)：左眼看右图，右眼看左图 -> 交叉视差 (Crossed disparity)
  // 内斜视(练散开)：左眼看左图，右眼看右图 -> 非交叉视差 (Uncrossed disparity)
  // 因为我们在 DOM 中默认 left-card 渲染在左，right-card 渲染在右
  // 对于外斜视（需要交叉），我们需要交换红蓝的位置（通过把距离设为负数或者反向位移）
  return isExophoria.value ? distance : -distance
})

const increaseDifficulty = () => {
  if (currentLevel.value < 10) {
    currentLevel.value += 1
  }
}

const decreaseDifficulty = () => {
  if (currentLevel.value > 1) {
    currentLevel.value -= 1
  }
}

let timerId: number
onMounted(() => {
  timerId = window.setInterval(() => {
    progressStore.addStageTime(STAGE_NUMBER, 1)
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 1;
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

.canvas-area {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vergence-card {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border-width: 8px;
  border-style: solid;
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: screen;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.inner-cross {
  position: absolute;
}

.inner-cross.horizontal {
  width: 40px;
  height: 4px;
}

.inner-cross.vertical {
  width: 4px;
  height: 40px;
}

.controls-overlay {
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.level-indicator {
  font-size: 1.2rem;
  color: #ccc;
}

.action-btn {
  width: 250px;
  font-weight: bold;
}
</style>
