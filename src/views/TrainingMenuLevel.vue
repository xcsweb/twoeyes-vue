<template>
  <div class="training-menu-container">
    <div class="bg-overlay"></div>
    <img class="bg-image" src="../assets/images/bg.jpg" alt="background" />
    
    <div class="content-area">
      <div class="w-100 mb-8 text-center">
        <h1 class="title">选择训练阶段</h1>
        <p class="subtitle mb-0">根据您的解锁进度，选择对应的视功能康复阶段进行训练</p>
      </div>

      <!-- Recommendation Summary Panel -->
      <div class="recommendation-panel mb-8 w-100" style="animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0;">
        <v-card color="rgba(255, 255, 255, 0.1)" variant="outlined" class="pa-4 recommendation-card" style="border-radius: 16px;">
          <div class="d-flex align-start">
            <v-icon color="info" size="32" class="mr-3 mt-1">mdi-clipboard-text-search-outline</v-icon>
            <div>
              <h3 class="text-h6 font-weight-bold mb-1 text-white">综合训练建议</h3>
              <p class="text-body-1 mb-2 text-white" style="opacity: 0.9;">
                {{ recommendationSummary }}
              </p>
              <div v-if="isPenalizationActive" class="d-flex align-center mt-2 px-3 py-2 rounded" style="background: rgba(255, 152, 0, 0.2); border-left: 4px solid #ff9800;">
                <v-icon size="small" color="warning" class="mr-2">mdi-alert-circle</v-icon>
                <span class="text-body-2 text-white">
                  <strong>亮度惩罚机制已启用：</strong> 检测到您的{{ suppressedEyeName }}存在抑制，训练中优势眼的亮度已降至 {{ Math.round(settingsStore.penalizationFactor * 100) }}%，以强迫弱视眼/被抑制眼参与视觉处理。
                </span>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      
      <div class="cards-wrapper">
        <!-- Stage 1 -->
        <div 
          class="elegant-card" 
          :class="{ 'locked-card': unlockedStage < 1 }"
          @click="unlockedStage >= 1 ? goToStage(1) : null"
        >
          <div class="card-img-wrapper" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);">
            <img class="card-img" src="../assets/images/training.jpg" alt="stage1" style="opacity: 0.6; mix-blend-mode: overlay;" />
            <div class="card-gradient"></div>
            <div v-if="unlockedStage < 1" class="lock-overlay">
              <v-icon size="48" color="white">mdi-lock</v-icon>
            </div>
          </div>
          <div class="card-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <h2 class="card-title mb-0">阶段 1：基础脱抑制</h2>
              <v-chip v-if="unlockedStage >= 1" color="success" size="small" variant="tonal">已解锁</v-chip>
            </div>
            <!-- Stage 1 Badges -->
            <div class="badges-wrapper mb-3" v-if="hasAmblyopia || hasMyopiaOrFatigue">
              <v-chip v-if="hasAmblyopia" color="warning" size="small" variant="flat" class="mr-2 font-weight-bold">
                <v-icon start size="small">mdi-star</v-icon> 针对弱视
              </v-chip>
            </div>
            <p class="card-text">
              通过简单的颜色匹配和移动，唤醒被抑制的眼睛，建立基础的双眼同时视。
            </p>
            <div class="text-caption mt-auto pt-4 text-grey">包含：洗牌训练、方块阵列</div>
          </div>
        </div>

        <!-- Stage 2 -->
        <div 
          class="elegant-card" 
          :class="{ 'locked-card': unlockedStage < 2 }"
          @click="unlockedStage >= 2 ? goToStage(2) : null"
        >
          <div class="card-img-wrapper" style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);">
            <img class="card-img" src="../assets/images/training.jpg" alt="stage2" style="opacity: 0.6; mix-blend-mode: overlay;" />
            <div class="card-gradient"></div>
            <div v-if="unlockedStage < 2" class="lock-overlay">
              <v-icon size="48" color="white">mdi-lock</v-icon>
            </div>
          </div>
          <div class="card-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <h2 class="card-title mb-0">阶段 2：动态融合</h2>
              <v-chip v-if="unlockedStage >= 2" color="success" size="small" variant="tonal">已解锁</v-chip>
            </div>
            <!-- Stage 2 Badges -->
            <div class="badges-wrapper mb-3" v-if="hasAmblyopia || hasStrabismus">
              <v-chip v-if="hasAmblyopia" color="warning" size="small" variant="flat" class="mr-2 mb-1 font-weight-bold">
                <v-icon start size="small">mdi-star</v-icon> 针对弱视
              </v-chip>
              <v-chip v-if="hasStrabismus" color="info" size="small" variant="flat" class="mr-2 mb-1 font-weight-bold">
                <v-icon start size="small">mdi-star</v-icon> 针对斜视
              </v-chip>
            </div>
            <p class="card-text">
              追踪动态粒子和螺旋，增强双眼在运动中的持续融合能力，防止视界消失。
            </p>
            <div class="text-caption mt-auto pt-4 text-grey">包含：旋转螺旋、星空粒子</div>
            <div v-if="unlockedStage < 2" class="text-caption mt-2 text-error">需在阶段 1 训练满 {{ Math.floor(settingsStore.requiredTrainingTime / 60) }} 分钟</div>
          </div>
        </div>

        <!-- Stage 3 -->
        <div 
          class="elegant-card" 
          :class="{ 'locked-card': unlockedStage < 3 }"
          @click="unlockedStage >= 3 ? goToStage(3) : null"
        >
          <div class="card-img-wrapper" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
            <img class="card-img" src="../assets/images/training.jpg" alt="stage3" style="opacity: 0.6; mix-blend-mode: overlay;" />
            <div class="card-gradient"></div>
            <div v-if="unlockedStage < 3" class="lock-overlay">
              <v-icon size="48" color="white">mdi-lock</v-icon>
            </div>
          </div>
          <div class="card-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <h2 class="card-title mb-0">阶段 3：集合与分开</h2>
              <v-chip v-if="unlockedStage >= 3" color="success" size="small" variant="tonal">已解锁</v-chip>
            </div>
            <!-- Stage 3 Badges -->
            <div class="badges-wrapper mb-3" v-if="hasStrabismus || hasMyopiaOrFatigue">
              <v-chip v-if="hasStrabismus" color="info" size="small" variant="flat" class="mr-2 mb-1 font-weight-bold">
                <v-icon start size="small">mdi-star</v-icon> 针对斜视
              </v-chip>
              <v-chip v-if="hasMyopiaOrFatigue" color="success" size="small" variant="flat" class="mr-2 mb-1 font-weight-bold">
                <v-icon start size="small">mdi-star</v-icon> 缓解疲劳/近视
              </v-chip>
            </div>
            <p class="card-text">
              经典的聚散球 (Brock String) 训练，锻炼眼部肌肉控制斗鸡眼与放松的能力。
            </p>
            <div class="text-caption mt-auto pt-4 text-grey">包含：聚散卡、聚散球</div>
            <div v-if="unlockedStage < 3" class="text-caption mt-2 text-error">需在阶段 2 训练满 {{ Math.floor(settingsStore.requiredTrainingTime / 60) }} 分钟</div>
          </div>
        </div>

        <!-- Stage 4 -->
        <div 
          class="elegant-card" 
          :class="{ 'locked-card': unlockedStage < 4 }"
          @click="unlockedStage >= 4 ? goToStage(4) : null"
        >
          <div class="card-img-wrapper" style="background: linear-gradient(135deg, #f12711 0%, #f5af19 100%);">
            <img class="card-img" src="../assets/images/training.jpg" alt="stage4" style="opacity: 0.6; mix-blend-mode: overlay;" />
            <div class="card-gradient"></div>
            <div v-if="unlockedStage < 4" class="lock-overlay">
              <v-icon size="48" color="white">mdi-lock</v-icon>
            </div>
          </div>
          <div class="card-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <h2 class="card-title mb-0">阶段 4：立体视建立</h2>
              <v-chip v-if="unlockedStage >= 4" color="success" size="small" variant="tonal">已解锁</v-chip>
            </div>
            <!-- Stage 4 Badges -->
            <div class="badges-wrapper mb-3">
              <v-chip color="primary" size="small" variant="flat" class="mr-2 mb-1 font-weight-bold">
                <v-icon start size="small">mdi-star</v-icon> 综合提升
              </v-chip>
            </div>
            <p class="card-text">
              在复杂背景下进行高级双眼协同，通过认知和空间判断重建高级手眼协调。
            </p>
            <div class="text-caption mt-auto pt-4 text-grey">包含：进阶立体视、双眼俄罗斯方块</div>
            <div v-if="unlockedStage < 4" class="text-caption mt-2 text-error">需在阶段 3 训练满 {{ Math.floor(settingsStore.requiredTrainingTime / 60) }} 分钟</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../store/progress'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const progressStore = useProgressStore()
const settingsStore = useSettingsStore()

const unlockedStage = computed(() => progressStore.unlockedStage)

// Diagnostics Logic
const hasAmblyopia = computed(() => {
  return settingsStore.visionAcuity.left <= 0.8 || 
         settingsStore.visionAcuity.right <= 0.8 || 
         settingsStore.suppressionStatus === 'left' || 
         settingsStore.suppressionStatus === 'right'
})

const hasStrabismus = computed(() => {
  return Math.abs(settingsStore.alignmentOffset.x) > 0 || 
         Math.abs(settingsStore.alignmentOffset.y) > 0 || 
         settingsStore.suppressionStatus === 'diplopia'
})

const hasMyopiaOrFatigue = computed(() => {
  // If visual acuity is low but no suppression/strabismus, likely simple refractive error/fatigue.
  // Or just generally beneficial for anyone who took the test.
  return settingsStore.visionAcuity.left < 1.0 || settingsStore.visionAcuity.right < 1.0 || 
         (!hasAmblyopia.value && !hasStrabismus.value)
})

const isPenalizationActive = computed(() => {
  return settingsStore.suppressionStatus === 'left' || settingsStore.suppressionStatus === 'right'
})

const suppressedEyeName = computed(() => {
  if (settingsStore.suppressionStatus === 'left') return '左眼'
  if (settingsStore.suppressionStatus === 'right') return '右眼'
  return ''
})

const recommendationSummary = computed(() => {
  let issues = []
  if (hasAmblyopia.value) issues.push('弱视/单眼抑制')
  if (hasStrabismus.value) issues.push('斜视/隐斜视')
  
  if (issues.length > 0) {
    let summary = `系统根据您的最新视功能检查数据，发现您可能存在：${issues.join('、')}。已为您推荐带有 ⭐ 标记的专属康复训练方案。`
    if (hasAmblyopia.value && hasStrabismus.value) {
      summary += ' 针对您的复合情况，建议先从“阶段1”的基础脱抑制做起，再逐步挑战“阶段3”的聚散融合训练。'
    }
    return summary
  } else if (hasMyopiaOrFatigue.value) {
    return '系统检测到您的双眼视功能稳定，但可能存在视力下降或视疲劳。建议您优先进行带有 ⭐ 标记的眼动与放松训练。'
  } else {
    return '您的双眼视功能非常健康！您可以自由探索各个阶段的视觉游戏，保持眼部活力。'
  }
})

const goToStage = (stage: number) => {
  if (stage === 1) router.push({ name: 'SectionIntroTraining' })
  if (stage === 2) router.push({ name: 'SectionIntroTraining2' })
  if (stage === 3) router.push({ name: 'SectionIntroTraining3' })
  if (stage === 4) router.push({ name: 'SectionIntroTraining4' })
}
</script>

<style scoped>
.training-menu-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: white;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding-bottom: 80px;
}

.bg-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -2;
}

.bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 100%);
  z-index: -1;
}

.content-area {
  padding: 60px 20px 20px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -1px;
  color: #ffffff;
  text-align: center;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 50px;
  text-align: center;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.elegant-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.elegant-card:not(.locked-card):hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.locked-card {
  cursor: not-allowed;
  opacity: 0.6;
  filter: grayscale(80%);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.elegant-card:not(.locked-card):hover .card-img {
  transform: scale(1.05);
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.card-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .title {
    font-size: 2.2rem;
  }
  .content-area {
    padding-top: 30px;
  }
  .cards-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
