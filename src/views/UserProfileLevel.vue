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

          <!-- 智能康复建议 -->
          <div class="info-section mb-6" v-if="hasExamData">
            <h3 class="section-title mb-4"><v-icon icon="mdi-lightbulb-on-outline" class="mr-2" color="warning"></v-icon>个性化康复建议</h3>
            <v-alert
              type="info"
              variant="tonal"
              class="text-left"
              border="start"
            >
              <div class="text-body-1" v-html="smartAdvice"></div>
            </v-alert>
          </div>

          <!-- 基础视力档案 -->
          <div class="info-section mb-6" v-if="hasVisionData">
            <h3 class="section-title">
              <v-icon icon="mdi-eye-outline" class="mr-2" color="primary"></v-icon>
              基础视力档案
            </h3>

            <div class="data-list mt-4">
              <div class="data-item">
                <div class="data-label">最新视力结果</div>
                <div class="data-value">
                  左眼: {{ settingsStore.visionAcuity.left.toFixed(2) }} | 
                  右眼: {{ settingsStore.visionAcuity.right.toFixed(2) }}
                </div>
              </div>
              <div class="data-item">
                <div class="data-label">近视度数估算</div>
                <div class="data-value text-warning">
                  左眼: {{ estimateDegrees(settingsStore.visionAcuity.left) }} | 
                  右眼: {{ estimateDegrees(settingsStore.visionAcuity.right) }}
                </div>
              </div>
              <div class="data-item">
                <div class="data-label">散光测试</div>
                <div class="data-value" :class="settingsStore.astigmatismResult === 'astigmatism' ? 'text-warning' : 'text-success'">
                  {{ settingsStore.astigmatismResult === 'astigmatism' ? '异常 (疑似散光)' : (settingsStore.astigmatismResult === 'normal' ? '正常' : '未测试') }}
                </div>
              </div>
              <div class="data-item">
                <div class="data-label">色觉测试</div>
                <div class="data-value" :class="settingsStore.colorVisionResult === 'deficient' ? 'text-warning' : 'text-success'">
                  {{ settingsStore.colorVisionResult === 'deficient' ? '异常 (色觉缺陷)' : (settingsStore.colorVisionResult === 'normal' ? '正常' : '未测试') }}
                </div>
              </div>
              <div class="data-item">
                <div class="data-label">黄斑测试</div>
                <div class="data-value" :class="settingsStore.macularResult === 'abnormal' ? 'text-warning' : 'text-success'">
                  {{ settingsStore.macularResult === 'abnormal' ? '异常' : (settingsStore.macularResult === 'normal' ? '正常' : '未测试') }}
                </div>
              </div>
              <div class="data-item">
                <div class="data-label">对比敏感度</div>
                <div class="data-value" :class="settingsStore.contrastSensitivityResult === 'low' ? 'text-warning' : 'text-success'">
                  {{ settingsStore.contrastSensitivityResult === 'low' ? '偏低' : (settingsStore.contrastSensitivityResult === 'normal' ? '正常' : '未测试') }}
                </div>
              </div>
            </div>

            <!-- 视力历史折线图 -->
            <div class="mt-6" v-if="visionChartData">
              <h4 class="text-body-2 text-grey mb-2"><v-icon icon="mdi-chart-line" class="mr-1" size="small"></v-icon>视力变化趋势</h4>
              <div class="chart-container">
                <Line :data="visionChartData" :options="visionChartOptions" />
              </div>
              <div class="text-caption text-grey mt-2 text-center">
                (注：绿线为正常视力标准 1.0)
              </div>
            </div>
          </div>

          <v-divider class="my-6 border-opacity-25" v-if="hasVisionData"></v-divider>

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

              <div class="data-item" v-if="settingsStore.suppressionStatus === 'left' || settingsStore.suppressionStatus === 'right'">
                <div class="data-label">惩罚阈值</div>
                <div class="data-value text-warning">
                  {{ Math.round(settingsStore.penalizationFactor * 100) }}% 亮度保留
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

              <div class="data-item">
                <div class="data-label">旋转偏斜量</div>
                <div class="data-value" v-if="(settingsStore.alignmentOffset.rLeft !== undefined && settingsStore.alignmentOffset.rLeft !== 0) || (settingsStore.alignmentOffset.rRight !== undefined && settingsStore.alignmentOffset.rRight !== 0)">
                  <span v-if="settingsStore.alignmentOffset.rLeft !== undefined && settingsStore.alignmentOffset.rLeft !== 0">左眼: {{ parseFloat(Number(settingsStore.alignmentOffset.rLeft).toFixed(1)) }}°</span>
                  <span v-if="(settingsStore.alignmentOffset.rLeft !== undefined && settingsStore.alignmentOffset.rLeft !== 0) && (settingsStore.alignmentOffset.rRight !== undefined && settingsStore.alignmentOffset.rRight !== 0)">, </span>
                  <span v-if="settingsStore.alignmentOffset.rRight !== undefined && settingsStore.alignmentOffset.rRight !== 0">右眼: {{ parseFloat(Number(settingsStore.alignmentOffset.rRight).toFixed(1)) }}°</span>
                </div>
                <div class="data-value text-success" v-else>无旋转偏斜</div>
              </div>

              <div class="data-item">
                <div class="data-label">立体视觉状态</div>
                <div class="data-value">
                  <v-chip :color="stereopsisColor" size="small" label>{{ stereopsisText }}</v-chip>
                </div>
              </div>
            </div>

            <div v-else class="empty-state mt-4">
              <v-icon icon="mdi-file-document-outline" size="48" color="grey-darken-1" class="mb-2"></v-icon>
              <p class="text-grey mb-0">尚未进行完整的斜视与视功能检查</p>
              <v-btn variant="outlined" color="primary" class="mt-3" size="small" @click="goToExam">前往检查</v-btn>
            </div>
          </div>

          <v-divider class="my-6 border-opacity-25"></v-divider>

          <!-- 斜视偏移量历史折线图 -->
          <div class="info-section mb-6" v-if="hasExamData && chartData">
            <h3 class="section-title mb-4"><v-icon icon="mdi-chart-line" class="mr-2" color="warning"></v-icon>隐斜视偏移量历史趋势</h3>
            <div class="chart-container">
              <Line :data="chartData" :options="chartOptions" />
            </div>
            <div class="text-caption text-grey mt-2 text-center">
              (注：Y轴为偏移量像素值。越接近 0 越接近正常正位视，绿线为正常标准 0)
            </div>
          </div>

          <v-divider class="my-6 border-opacity-25" v-if="hasExamData && torsionChartData"></v-divider>

          <!-- 旋转偏斜量历史折线图 -->
          <div class="info-section mb-6" v-if="hasExamData && torsionChartData">
            <h3 class="section-title mb-4"><v-icon icon="mdi-rotate-3d-variant" class="mr-2" color="purple-lighten-2"></v-icon>旋转偏斜量历史趋势</h3>
            <div class="chart-container">
              <Line :data="torsionChartData" :options="torsionChartOptions" />
            </div>
            <div class="text-caption text-grey mt-2 text-center">
              (注：Y轴为旋转角度。越接近 0 越正常，绿线为正常标准 0°)
            </div>
          </div>

          <v-divider class="my-6 border-opacity-25"></v-divider>

          <!-- 康复训练设置 -->
          <div class="info-section mb-6">
            <h3 class="section-title mb-4"><v-icon icon="mdi-cog-outline" class="mr-2" color="secondary"></v-icon>训练设置</h3>
            <v-select
              :model-value="settingsStore.testFrequency"
              @update:model-value="settingsStore.setTestFrequency"
              :items="[
                { title: '1天', value: 1 },
                { title: '3天', value: 3 },
                { title: '7天', value: 7 }
              ]"
              item-title="title"
              item-value="value"
              label="康复训练前置检测频率"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mt-2"
            ></v-select>
            <div class="text-caption text-grey mt-2">
              (设置检测数据过期时间，过期后需重新进行视力或斜弱视检查方可训练)
            </div>
          </div>

          <div class="d-flex justify-center mt-8 mb-4">
            <v-btn
              color="primary"
              size="x-large"
              prepend-icon="mdi-rocket-launch"
              @click="goToTraining"
              elevation="8"
              class="px-8 font-weight-bold"
              rounded="pill"
            >
              生成定制化康复训练计划
            </v-btn>
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const router = useRouter()
const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const goToExam = () => {
  router.push({ name: 'SectionIntroExam' })
}

const goToTraining = () => {
  const limit = settingsStore.testFrequency * 24 * 3600 * 1000
  if (Date.now() - settingsStore.lastTestTime > limit) {
    alert('您的检测数据已过期，请先进行视力或斜弱视检查')
    return
  }
  router.push({ name: 'TrainingMenu' })
}

const hasExamData = computed(() => {
  return settingsStore.lensConfig !== '' || settingsStore.hasSeenIntro
})

const hasVisionData = computed(() => {
  return settingsStore.visionHistory && settingsStore.visionHistory.length > 0
})

const estimateDegrees = (acuity: number) => {
  if (acuity >= 1.0) return '0 度'
  if (acuity >= 0.8) return '约 50 度'
  if (acuity >= 0.6) return '约 100 度'
  if (acuity >= 0.5) return '约 150 度'
  if (acuity >= 0.4) return '约 200 度'
  if (acuity >= 0.3) return '约 250 度'
  if (acuity >= 0.2) return '约 300 度'
  if (acuity >= 0.15) return '约 400 度'
  if (acuity >= 0.1) return '约 500 度'
  return '> 600 度'
}

// 视力历史折线图数据配置
const visionChartData = computed(() => {
  const history = settingsStore.visionHistory || []
  if (history.length === 0) return null

  const labels = history.map(r => {
    const parts = r.date.split('-')
    return parts.length === 3 ? `${parts[1]}-${parts[2]}` : r.date
  })
  const dataLeft = history.map(r => r.left)
  const dataRight = history.map(r => r.right)

  return {
    labels,
    datasets: [
      {
        label: '左眼视力',
        borderColor: '#4fc3f7',
        backgroundColor: '#4fc3f7',
        data: dataLeft,
        tension: 0.3
      },
      {
        label: '右眼视力',
        borderColor: '#ff5252',
        backgroundColor: '#ff5252',
        data: dataRight,
        tension: 0.3
      }
    ]
  }
})

const visionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#fff'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#aaa' },
      grid: { color: 'rgba(255,255,255,0.1)' }
    },
    y: {
      ticks: { color: '#aaa' },
      grid: { 
        color: (ctx: any) => ctx.tick.value === 1.0 ? '#4ade80' : 'rgba(255,255,255,0.1)' 
      },
      min: 0,
      max: 1.5
    }
  }
}

// 折线图数据配置
const chartData = computed(() => {
  const history = settingsStore.alignmentHistory || []
  if (history.length === 0) return null

  const labels = history.map(r => {
    // extract MM-DD from YYYY-MM-DD
    const parts = r.date.split('-')
    return parts.length === 3 ? `${parts[1]}-${parts[2]}` : r.date
  })
  const dataX = history.map(r => r.x)
  const dataY = history.map(r => r.y)

  return {
    labels,
    datasets: [
      {
        label: '水平偏移 (X)',
        borderColor: '#4fc3f7',
        backgroundColor: '#4fc3f7',
        data: dataX,
        tension: 0.3
      },
      {
        label: '垂直偏移 (Y)',
        borderColor: '#ff5252',
        backgroundColor: '#ff5252',
        data: dataY,
        tension: 0.3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#fff'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#aaa' },
      grid: { color: 'rgba(255,255,255,0.1)' }
    },
    y: {
      ticks: { color: '#aaa' },
      grid: { 
        color: (ctx: any) => ctx.tick.value === 0 ? '#4ade80' : 'rgba(255,255,255,0.1)' 
      }
    }
  }
}

// 旋转偏斜量历史折线图数据配置
const torsionChartData = computed(() => {
  const history = settingsStore.alignmentHistory || []
  const hasTorsionData = history.some(r => r.rLeft !== undefined || r.rRight !== undefined)
  if (history.length === 0 || !hasTorsionData) return null

  const labels = history.map(r => {
    const parts = r.date.split('-')
    return parts.length === 3 ? `${parts[1]}-${parts[2]}` : r.date
  })
  
  // 保留一位小数的浮点数
  const dataLeft = history.map(r => parseFloat(Number(r.rLeft || 0).toFixed(1)))
  const dataRight = history.map(r => parseFloat(Number(r.rRight || 0).toFixed(1)))

  return {
    labels,
    datasets: [
      {
        label: '左眼旋转偏移 (°)',
        borderColor: '#ce93d8', // 紫色
        backgroundColor: '#ce93d8',
        data: dataLeft,
        tension: 0.3
      },
      {
        label: '右眼旋转偏移 (°)',
        borderColor: '#ffb74d', // 橙色
        backgroundColor: '#ffb74d',
        data: dataRight,
        tension: 0.3
      }
    ]
  }
})

const torsionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#fff'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#aaa' },
      grid: { color: 'rgba(255,255,255,0.1)' }
    },
    y: {
      ticks: { color: '#aaa' },
      grid: { 
        color: (ctx: any) => ctx.tick.value === 0 ? '#4ade80' : 'rgba(255,255,255,0.1)' 
      }
    }
  }
}

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
    case 'right': return 'error'
    case 'diplopia': return 'warning'
    case 'none': return 'success'
    default: return 'grey'
  }
})

const stereopsisText = computed(() => {
  switch (settingsStore.stereopsisResult) {
    case 'normal': return '正常'
    case 'mild': return '轻度受损'
    case 'moderate': return '中度受损'
    case 'severe': return '重度受损'
    default: return '未测试'
  }
})

const stereopsisColor = computed(() => {
  switch (settingsStore.stereopsisResult) {
    case 'normal': return 'success'
    case 'mild': 
    case 'moderate': return 'warning'
    case 'severe': return 'error'
    default: return 'grey'
  }
})

const smartAdvice = computed(() => {
  if (!hasExamData.value) return '请先完成视功能检查。'
  
  let advice = ''
  const isSuppressed = settingsStore.suppressionStatus === 'left' || settingsStore.suppressionStatus === 'right'
  const offset = settingsStore.alignmentOffset
  const hasOffset = Math.abs(offset.x) > 5 || Math.abs(offset.y) > 5

  if (isSuppressed) {
    const weakEye = settingsStore.suppressionStatus === 'left' ? '左眼' : '右眼'
    const strongEye = settingsStore.suppressionStatus === 'left' ? '右眼' : '左眼'
    advice += `<strong>首要任务：打破单眼抑制</strong><br/>`
    advice += `您的${weakEye}目前处于抑制状态。建议每天重点进行<strong>阶段1（基础脱抑制）</strong>的洗牌与方块寻找训练。<br/>`
    advice += `系统已自动为您开启暗光压抑疗法，训练时会将${strongEye}的亮度强制降低至 <strong>${Math.round(settingsStore.penalizationFactor * 100)}%</strong>，请坚持每天打卡。`
  } else if (hasOffset) {
    advice += `<strong>首要任务：纠正隐斜视，提升融合范围</strong><br/>`
    advice += `您目前没有明显的单眼抑制，但存在一定程度的隐斜视偏离（X:${offset.x}px, Y:${offset.y}px）。<br/>`
    advice += `建议重点进行<strong>阶段2（动态融合与扫视）</strong>和<strong>阶段3（立体视恢复）</strong>的训练。请在追踪训练中努力保持两眼图像重合，缩小下方折线图中的偏移量距离。`
  } else if (settingsStore.suppressionStatus === 'none') {
    advice += `<strong>维持视觉健康</strong><br/>`
    advice += `太棒了！您目前拥有良好的双眼单视功能，隐斜视偏离也在正常范围内。<br/>`
    advice += `建议定期进行<strong>阶段3/4</strong>的立体视和复杂场景训练，以巩固您的双眼融像能力。`
  } else if (settingsStore.suppressionStatus === 'diplopia') {
    advice += `<strong>复视干预</strong><br/>`
    advice += `您可能存在复视现象。请尝试调大图案并慢慢进行阶段1/2的慢速追踪训练。如果重影严重，请及时咨询视光医师。`
  }

  return advice
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

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 28px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
}
</style>

