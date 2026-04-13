<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-8 text-white">临床评估与康复建议</h1>

      <v-card class="advice-card mx-auto text-left" variant="outlined">
        <v-card-text>
          <div class="text-h6 text-white mb-4 d-flex align-center">
            <v-icon start color="primary">mdi-clipboard-text-search-outline</v-icon>
            视标测量数据
          </div>
          
          <v-row dense class="mb-6">
            <v-col cols="12" sm="6">
              <div class="advice-text text-grey">
                水平偏移 (X): 
                <span class="text-white font-weight-bold mx-1">{{ formatFloat(offset.x) }} px</span>
                <v-chip size="small" :color="Math.abs(offset.x) <= 5 ? 'success' : 'warning'" variant="flat">
                  {{ getXStatus(offset.x) }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="advice-text text-grey">
                垂直偏移 (Y): 
                <span class="text-white font-weight-bold mx-1">{{ formatFloat(offset.y) }} px</span>
                <v-chip size="small" :color="Math.abs(offset.y) <= 3 ? 'success' : 'warning'" variant="flat">
                  {{ getYStatus(offset.y) }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="6" v-if="offset.rLeft !== undefined && offset.rLeft !== 0">
              <div class="advice-text text-grey">
                左眼旋转 (L): 
                <span class="text-white font-weight-bold mx-1">{{ formatFloat(offset.rLeft) }}°</span>
                <v-chip size="small" :color="Math.abs(offset.rLeft) <= 2 ? 'success' : 'warning'" variant="flat">
                  {{ getRStatus(offset.rLeft) }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="6" v-if="offset.rRight !== undefined && offset.rRight !== 0">
              <div class="advice-text text-grey">
                右眼旋转 (R): 
                <span class="text-white font-weight-bold mx-1">{{ formatFloat(offset.rRight) }}°</span>
                <v-chip size="small" :color="Math.abs(offset.rRight) <= 2 ? 'success' : 'warning'" variant="flat">
                  {{ getRStatus(offset.rRight) }}
                </v-chip>
              </div>
            </v-col>
          </v-row>

          <v-alert
            v-if="isDiagonalAlignmentError"
            type="warning"
            variant="tonal"
            class="mb-6"
            title="⚠️ 设备倾斜提示"
          >
            系统检测到双眼均存在相似的旋转偏移，这通常是由于测试时设备未保持水平所致。建议您放平手机后重新测试。
            <div class="mt-4">
              <v-btn color="warning" variant="elevated" @click="router.push({ name: 'AlignmentExercise' })">重新测试</v-btn>
            </div>
          </v-alert>

          <v-alert
            v-else-if="hasSevereCyclotropia"
            type="error"
            variant="tonal"
            class="mb-6"
            title="⚠️ 旋转斜视警告"
          >
            检测到明显的旋转偏斜（> 5度）。视觉康复训练对旋转斜视改善有限，建议您前往正规医院寻求临床评估。
          </v-alert>

          <template v-else>
            <v-divider class="my-4" color="rgba(255,255,255,0.1)"></v-divider>

            <div class="text-h6 text-white mb-4 d-flex align-center">
              <v-icon start color="info">mdi-stethoscope</v-icon>
              综合诊断总结
            </div>
            <div class="advice-text text-grey mb-6">
              {{ comprehensiveSummary }}
            </div>

            <v-divider class="my-4" color="rgba(255,255,255,0.1)"></v-divider>

            <div class="text-h6 text-white mb-4 d-flex align-center">
              <v-icon start color="success">mdi-bullseye-arrow</v-icon>
              针对性康复方案
            </div>

            <div class="text-body-1 text-success mt-4 pa-4 target-action-box">
              <div class="font-weight-bold mb-2">👁️ 眼位训练重点：</div>
              {{ targetAction }}
            </div>

            <div class="text-body-1 text-success mt-4 pa-4 target-action-box" v-if="stereopsisAdvice">
              <div class="font-weight-bold mb-2">🧊 立体视训练重点 <span class="text-white opacity-80 text-body-2 ml-2">(当前敏锐度: {{ stereopsisText }})</span></div>
              {{ stereopsisAdvice }}
            </div>
          </template>

          <div class="text-body-2 text-warning mt-8 text-center opacity-70">
            免责声明：本系统测试结果及建议仅供视觉知觉学习参考，不作为临床医疗诊断依据。
          </div>

          <div class="mt-8 text-center">
            <v-btn
              color="primary"
              size="x-large"
              class="px-12"
              height="56"
              @click="router.push({ name: 'Home' })"
            >
              完成并回到主页
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.updateLastTestTime()
})

const offset = computed(() => settingsStore.alignmentOffset)

const formatFloat = (val: number | undefined) => {
  if (val === undefined) return '0.0'
  return Number(val).toFixed(1)
}

const getXStatus = (x: number) => {
  if (Math.abs(x) <= 5) return '正常范围'
  return x > 5 ? '外隐斜倾向' : '内隐斜倾向'
}

const getYStatus = (y: number) => {
  if (Math.abs(y) <= 3) return '正常范围'
  return y > 3 ? '下斜倾向' : '上斜倾向'
}

const getRStatus = (r: number) => {
  if (Math.abs(r) <= 2) return '正常范围'
  return r > 0 ? '外旋倾向' : '内旋倾向'
}

const isDiagonalAlignmentError = computed(() => {
  const rL = Math.abs(offset.value.rLeft ?? 0)
  const rR = Math.abs(offset.value.rRight ?? 0)
  return rL > 5 && rR > 5 && Math.abs(rL - rR) <= 2
})

const hasSevereCyclotropia = computed(() => {
  if (isDiagonalAlignmentError.value) return false
  return (offset.value.rLeft !== undefined && Math.abs(offset.value.rLeft) > 5) ||
         (offset.value.rRight !== undefined && Math.abs(offset.value.rRight) > 5)
})

const stereopsisResult = computed(() => settingsStore.stereopsisResult)

const stereopsisText = computed(() => {
  switch (stereopsisResult.value) {
    case 'normal': return '正常'
    case 'mild': return '轻度受损'
    case 'moderate': return '中度受损'
    case 'severe': return '重度受损/缺失'
    default: return '未测试'
  }
})

const comprehensiveSummary = computed(() => {
  const x = offset.value.x
  const y = offset.value.y
  const rL = offset.value.rLeft ?? 0
  const rR = offset.value.rRight ?? 0

  const isXNormal = Math.abs(x) <= 5
  const isYNormal = Math.abs(y) <= 3
  const isRNormal = Math.abs(rL) <= 2 && Math.abs(rR) <= 2

  let summary = ''

  if (isXNormal && isYNormal && isRNormal) {
    summary += '根据临床视光学标准，您的各项眼位偏移量均处于微小的生理性隐斜范围（正常容差内），这表明您的双眼眼外肌平衡状态良好，没有明显的斜视倾向。'
  } else {
    summary += '根据测试，您的双眼在静息状态下存在部分偏斜。'
    if (!isXNormal) {
      summary += x > 5
        ? '在水平方向上存在向外偏斜的趋势（外隐斜/集合不足），说明您可能在过度动用“正融像性集合（PFV）”来对抗外斜。'
        : '在水平方向上存在向内偏斜的趋势（内隐斜），说明您可能在过度动用“负融像性集合（NFV）”来对抗内斜。'
    }
    if (!isYNormal) {
      summary += '在垂直方向上存在轻度偏斜，这容易加剧长期的视觉疲劳。'
    }
    if (!isRNormal) {
      summary += '在旋转方向上存在一定的旋转隐斜倾向。'
    }
  }

  if (stereopsisResult.value === 'normal') {
    summary += '同时，您的立体视觉敏锐度正常，双眼深度知觉完好。'
  } else {
    summary += `此外，您的立体视觉敏锐度呈现“${stereopsisText.value}”，高级融合功能需要进一步通过康复训练来重建。`
  }

  return summary
})

const targetAction = computed(() => {
  const x = offset.value.x
  if (x > 5) return '您需要着重练习双眼的“集合（Convergence）”能力。在接下来的「聚散球」等康复游戏中，请多加练习将视线【由远处跳跃注视到近处】，强迫眼部肌肉向鼻梁内侧汇聚（俗称“斗鸡眼”）。'
  if (x < -5) return '您需要着重练习双眼的“分开（Divergence）”能力。在接下来的「聚散球」等康复游戏中，请多加练习将视线【由近处跳跃注视到远处】，强迫眼部肌肉向外放松发散。'
  return '您的水平眼位正常。训练重点将放在全面提升双眼聚散的灵活性上，以进一步巩固双眼视觉融合能力，预防日常视疲劳。'
})

const stereopsisAdvice = computed(() => {
  switch (stereopsisResult.value) {
    case 'normal': return '功能完好。继续保持，可以通过“进阶立体视”游戏进一步巩固高级双眼协同与手眼配合。'
    case 'mild': return '存在轻度受损。建议通过“聚散球”和“进阶立体视”训练，提升对双眼微小视差的融合敏锐度。'
    case 'moderate': return '存在中度受损。建议重点进行“聚散卡片”和“进阶立体视”训练，逐步重建双眼深度知觉。'
    case 'severe': return '严重受损或缺失。建议先从基础的“消除单眼抑制”开始（如洗牌、螺旋训练），待双眼能同时稳定感知画面后，再逐步进行大视差的立体视融合训练。'
    default: return ''
  }
})
</script>

<style scoped>
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.advice-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.advice-text {
  font-size: 1.05rem;
  line-height: 1.6;
}

.target-action-box {
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
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
</style>
