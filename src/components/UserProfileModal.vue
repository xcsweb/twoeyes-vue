<template>
  <v-dialog v-model="dialog" max-width="600" overlay-color="black" overlay-opacity="0.8">
    <div class="profile-card">
      <div class="card-header">
        <h2 class="d-flex align-center">
          <v-icon icon="mdi-account-circle" class="mr-2" size="36" color="primary"></v-icon>
          个人信息
        </h2>
        <v-btn icon="mdi-close" variant="text" color="white" @click="close"></v-btn>
      </div>

      <div class="card-body">
        <!-- 训练统计 -->
        <div class="info-section">
          <h3 class="section-title"><v-icon icon="mdi-chart-timeline-variant" class="mr-2" color="success"></v-icon>训练统计</h3>
          <v-row class="mt-2">
            <v-col cols="6">
              <div class="stat-box">
                <div class="stat-label">累计训练天数</div>
                <div class="stat-value text-success">{{ progressStore.trainingDaysCount }} <span class="text-body-2">天</span></div>
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

        <v-divider class="my-6 border-opacity-25"></v-divider>

        <!-- 视觉健康档案 -->
        <div class="info-section">
          <h3 class="section-title"><v-icon icon="mdi-clipboard-pulse" class="mr-2" color="info"></v-icon>视觉健康档案</h3>
          
          <div v-if="hasExamData" class="data-list mt-4">
            <div class="data-item">
              <div class="data-label">滤片佩戴方式</div>
              <div class="data-value d-flex align-center">
                左眼: 
                <span class="color-dot ml-1 mr-3" :style="{ backgroundColor: `rgb(${settingsStore.leftLense.r},${settingsStore.leftLense.g},${settingsStore.leftLense.b})` }"></span>
                右眼:
                <span class="color-dot ml-1" :style="{ backgroundColor: `rgb(${settingsStore.rightLense.r},${settingsStore.rightLense.g},${settingsStore.rightLense.b})` }"></span>
              </div>
            </div>
            
            <div class="data-item">
              <div class="data-label">双眼抑制状态</div>
              <div class="data-value">
                <v-chip :color="suppressionColor" size="small" label>{{ suppressionText }}</v-chip>
                <span v-if="settingsStore.suppressionStatus === 'left' || settingsStore.suppressionStatus === 'right'" class="text-caption ml-2 text-grey">
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
              <div class="data-value text-success" v-else>
                正位 (无偏移)
              </div>
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
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useProgressStore } from '../store/progress'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const close = () => {
  dialog.value = false
}

const goToExam = () => {
  close()
  router.push({ name: 'SectionIntroExam' })
}

// 如果滤片设置过，或者做过检查，我们认为有数据
const hasExamData = computed(() => {
  return settingsStore.lensConfig !== '' || settingsStore.hasSeenIntro
})

const suppressionText = computed(() => {
  switch (settingsStore.suppressionStatus) {
    case 'left': return '左眼抑制 (弱视/斜视眼)'
    case 'right': return '右眼抑制 (弱视/斜视眼)'
    case 'diplopia': return '复视 (无抑制)'
    case 'none': return '正常双眼单视'
    default: return '未知'
  }
})

const suppressionColor = computed(() => {
  switch (settingsStore.suppressionStatus) {
    case 'left': 
    case 'right': return 'error'
    case 'diplopia': return 'warning'
    case 'none': return 'success'
    default: return 'grey'
  }
})
</script>

<style scoped>
.profile-card {
  background: rgba(20, 20, 25, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  color: white;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 16px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 16px 32px 32px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
}

.stat-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
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
  font-weight: 700;
  line-height: 1;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.data-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.data-value {
  font-size: 0.95rem;
  font-weight: 500;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.empty-state {
  text-align: center;
  padding: 32px 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}
</style>
