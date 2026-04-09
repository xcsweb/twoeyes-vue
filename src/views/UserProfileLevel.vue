<template>
  <v-container fluid class="profile-page">
    <div class="page-wrapper">
      <div class="page-header">
        <h1 class="page-title">
          <v-icon icon="mdi-account-circle" class="mr-3" size="40" color="primary"></v-icon>
          个人信息
        </h1>
        <div class="page-subtitle">视觉健康档案与训练进度概览</div>
      </div>

      <div class="profile-card">
        <div class="card-body">
          <div class="info-section">
            <h3 class="section-title">
              <v-icon icon="mdi-chart-timeline-variant" class="mr-2" color="success"></v-icon>
              训练统计
            </h3>
            <v-row class="mt-2">
              <v-col cols="6">
                <div class="stat-box">
                  <div class="stat-label">累计训练天数</div>
                  <div class="stat-value text-success">
                    {{ progressStore.trainingDaysCount }}
                    <span class="text-body-2">天</span>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="stat-box">
                  <div class="stat-label">当前康复阶段</div>
                  <div class="stat-value text-primary">阶段 {{ progressStore.unlockedStage }}</div>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-8 border-opacity-25"></v-divider>

          <div class="info-section">
            <h3 class="section-title">
              <v-icon icon="mdi-clipboard-pulse" class="mr-2" color="info"></v-icon>
              视觉健康档案
            </h3>

            <div v-if="hasExamData" class="data-list mt-4">
              <div class="data-item">
                <div class="data-label">滤片佩戴方式</div>
                <div class="data-value d-flex align-center">
                  左眼:
                  <span
                    class="color-dot ml-2 mr-4"
                    :style="{ backgroundColor: `rgb(${settingsStore.leftLense.r},${settingsStore.leftLense.g},${settingsStore.leftLense.b})` }"
                  ></span>
                  右眼:
                  <span
                    class="color-dot ml-2"
                    :style="{ backgroundColor: `rgb(${settingsStore.rightLense.r},${settingsStore.rightLense.g},${settingsStore.rightLense.b})` }"
                  ></span>
                </div>
              </div>

              <div class="data-item">
                <div class="data-label">双眼抑制状态</div>
                <div class="data-value">
                  <v-chip :color="suppressionColor" size="small" label>{{ suppressionText }}</v-chip>
                  <span
                    v-if="settingsStore.suppressionStatus === 'left' || settingsStore.suppressionStatus === 'right'"
                    class="text-caption ml-2 text-grey"
                  >
                    (已启用优势眼暗光惩罚)
                  </span>
                </div>
              </div>

              <div class="data-item">
                <div class="data-label">隐斜视偏移量</div>
                <div class="data-value" v-if="settingsStore.alignmentOffset.x !== 0 || settingsStore.alignmentOffset.y !== 0">
                  <span v-if="settingsStore.alignmentOffset.x !== 0">水平: {{ settingsStore.alignmentOffset.x }} px</span>
                  <span v-if="settingsStore.alignmentOffset.x !== 0 && settingsStore.alignmentOffset.y !== 0">, </span>
                  <span v-if="settingsStore.alignmentOffset.y !== 0">垂直: {{ settingsStore.alignmentOffset.y }} px</span>
                </div>
                <div class="data-value text-success" v-else>正位 (无偏移)</div>
              </div>
            </div>

            <div v-else class="empty-state mt-4">
              <v-icon icon="mdi-file-document-outline" size="48" color="grey-darken-1" class="mb-2"></v-icon>
              <p class="text-grey mb-0">尚未进行完整的斜视与视功能检查</p>
              <v-btn variant="outlined" color="primary" class="mt-3" size="small" @click="goToExam">前往检查</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useProgressStore } from '../store/progress'

const router = useRouter()
const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const goToExam = () => {
  router.push({ name: 'SectionIntroExam' })
}

const hasExamData = computed(() => {
  return settingsStore.lensConfig !== '' || settingsStore.hasSeenIntro
})

const suppressionText = computed(() => {
  switch (settingsStore.suppressionStatus) {
    case 'left':
      return '左眼抑制 (弱视/斜视眼)'
    case 'right':
      return '右眼抑制 (弱视/斜视眼)'
    case 'diplopia':
      return '复视 (无抑制)'
    case 'none':
      return '正常双眼单视'
    default:
      return '未知'
  }
})

const suppressionColor = computed(() => {
  switch (settingsStore.suppressionStatus) {
    case 'left':
    case 'right':
      return 'error'
    case 'diplopia':
      return 'warning'
    case 'none':
      return 'success'
    default:
      return 'grey'
  }
})
</script>

<style scoped>
.profile-page {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding: 32px 16px calc(env(safe-area-inset-bottom, 0px) + 120px);
}

.page-wrapper {
  max-width: 860px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  color: #fff;
}

.page-subtitle {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.6);
}

.profile-card {
  background: rgba(20, 20, 25, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-body {
  padding: 24px 28px 28px;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
}

.stat-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
}

.data-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.data-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-align: right;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.35);
}

.empty-state {
  text-align: center;
  padding: 28px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
}
</style>

