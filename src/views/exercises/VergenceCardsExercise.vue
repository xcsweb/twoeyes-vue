<template>
  <div class="exercise-container">
    <div class="progress-hud">
      <span :class="{ 'text-success': isTargetReached, 'text-white': !isTargetReached }">
        剩余训练时间: {{ formattedTime }}
        <span v-if="isTargetReached" class="ml-2">✓ 今日训练已达标</span>
      </span>
    </div>
    <PersonalizedHud :gameParams="[`当前难度等级: ${currentLevel}`, `当前水平分离度: ${separation}px`]" />
    
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

      <v-btn
        variant="text"
        color="grey"
        class="mt-4"
        @click="showInfoDialog = true"
      >
        <v-icon start>mdi-information</v-icon> 觉得困难？了解医学原理
      </v-btn>
    </div>

    <!-- Medical Info Dialog -->
    <v-dialog v-model="showInfoDialog" max-width="500">
      <v-card class="bg-grey-darken-4 text-white">
        <v-card-title class="text-h6 pt-4 px-4">
          关于聚散度与融合训练
        </v-card-title>
        <v-card-text class="text-body-2 pt-2 px-4 pb-4">
          <p class="mb-3">
            您在做的正是临床上经典的<strong>自由空间融合训练（Free-Space Fusion）</strong>。
          </p>
          <p class="mb-3">
            <strong>为什么觉得“斗鸡眼”很难？</strong><br/>
            很多人天生存在“集合不足（Convergence Insufficiency, CI）”，即两眼无法长时间向内聚焦。如果您是外斜视患者，做“斗鸡眼”动作会非常吃力，这正是您的双眼视功能薄弱环节。
          </p>
          <p class="mb-3">
            <strong>医学证明有效吗？</strong><br/>
            CITT（集合不足治疗试验）等多项国际多中心双盲研究已经证实，以 Base-Out（BO，集合训练）为核心的视觉康复训练，能有效缓解眼疲劳，改善隐斜视。
          </p>
          <p>
            <strong>建议：</strong>如果您无法融合两个圆环，说明当前的难度超出了您的融像范围。您可以尝试把手机拿远一点，或者盯着手指尖慢慢靠近鼻梁来辅助。如果实在无法完成，可以点击下方按钮暂时跳过。
          </p>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="skipStage">
            暂时跳过 (算作达标)
          </v-btn>
          <v-btn color="primary" variant="flat" @click="showInfoDialog = false">
            继续挑战
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'

const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const STAGE_NUMBER = 3
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)


const leftColorStr = computed(() => settingsStore.leftEyeColorStr)
const rightColorStr = computed(() => settingsStore.rightEyeColorStr)

// 根据用户的隐斜视 offset 决定是内斜还是外斜
// 负数 -> 外斜视 (Exophoria) -> 需要训练集合 (Convergence, BO)
// 正数 -> 内斜视 (Esophoria) -> 需要训练散开 (Divergence, BI)
const isExophoria = computed(() => settingsStore.alignmentOffset.x <= 0)

const showInfoDialog = ref(false)

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

const skipStage = () => {
  progressStore.addStageTime(STAGE_NUMBER, 60 - stageTime.value)
  showInfoDialog.value = false
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
  background: rgba(0, 0, 0, 0.85);
  padding: 8px 16px;
  font-size: 0.85rem;
  white-space: nowrap;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  z-index: 100;
  font-weight: bold;
}

.instruction-overlay {
  padding: 80px 20px 20px;
  text-align: center;
  z-index: 10;
  max-width: 600px;
  width: 100%;
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
