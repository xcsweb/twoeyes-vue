<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-8 text-white">斜视评估建议</h1>

      <v-card class="advice-card mx-auto text-left" variant="outlined">
        <v-card-text>
          <div class="text-h6 text-white mb-4">根据您的视标测试结果：</div>
          
          <div class="advice-text text-grey mb-4">
            水平偏移量 (X Offset): 
            <span class="text-white font-weight-bold ml-2">{{ offset.x }} px</span>
            <span class="ml-2 text-info" v-if="offset.x > 0">(向右偏移)</span>
            <span class="ml-2 text-info" v-else-if="offset.x < 0">(向左偏移)</span>
          </div>

          <div class="advice-text text-grey mb-4">
            垂直偏移量 (Y Offset): 
            <span class="text-white font-weight-bold ml-2">{{ offset.y }} px</span>
            <span class="ml-2 text-info" v-if="offset.y > 0">(向下偏移)</span>
            <span class="ml-2 text-info" v-else-if="offset.y < 0">(向上偏移)</span>
          </div>

          <div class="advice-text text-grey mb-4" v-if="offset.rLeft !== undefined && offset.rLeft !== 0">
            左眼旋转偏移量 (L Torsional Offset): 
            <span class="text-white font-weight-bold ml-2">{{ offset.rLeft }} °</span>
            <span class="ml-2 text-info" v-if="offset.rLeft > 0">(顺时针/外旋)</span>
            <span class="ml-2 text-info" v-else-if="offset.rLeft < 0">(逆时针/内旋)</span>
          </div>

          <div class="advice-text text-grey mb-4" v-if="offset.rRight !== undefined && offset.rRight !== 0">
            右眼旋转偏移量 (R Torsional Offset): 
            <span class="text-white font-weight-bold ml-2">{{ offset.rRight }} °</span>
            <span class="ml-2 text-info" v-if="offset.rRight > 0">(顺时针/外旋)</span>
            <span class="ml-2 text-info" v-else-if="offset.rRight < 0">(逆时针/内旋)</span>
          </div>

          <v-alert
            v-if="isDiagonalAlignmentError"
            type="warning"
            variant="tonal"
            class="mb-6"
            title="⚠️ 警告：可能存在设备倾斜"
          >
            系统检测到您的双眼均存在相似的旋转偏移，这很可能是由于您佩戴设备的倾斜（未保持水平）所致，即存在对角线对齐错误。建议您调整设备水平后重新进行测试。
            <div class="mt-4">
              <v-btn
                color="warning"
                variant="elevated"
                @click="router.push({ name: 'AlignmentExercise' })"
              >
                重新测试
              </v-btn>
            </div>
          </v-alert>

          <v-alert
            v-else-if="hasSevereCyclotropia"
            type="error"
            variant="tonal"
            class="mb-6"
            title="⚠️ 警告：检测到明显的旋转斜视 (Cyclotropia)"
          >
            系统检测到您的眼球存在明显的旋转偏斜（&gt; 5度）。视觉康复训练（Vision Therapy）对旋转斜视的改善效果极为有限，强烈建议您尽快前往正规医院斜视与小儿眼科就诊，寻求斜视手术或特殊棱镜的临床评估。
          </v-alert>

          <template v-else>
            <v-divider class="my-4" color="rgba(255,255,255,0.2)"></v-divider>

            <div class="text-h6 text-white mb-4">根据您的立体视筛查结果：</div>

            <div class="advice-text text-grey mb-4">
              立体视觉敏锐度: 
              <span class="font-weight-bold ml-2" :class="stereopsisColorClass">{{ stereopsisText }}</span>
            </div>

            <v-divider class="my-4" color="rgba(255,255,255,0.2)"></v-divider>

            <div class="text-h5 text-white mb-2">{{ adviceTitle }}</div>
            <div class="advice-text text-grey mb-4">
              {{ adviceDesc }}
            </div>

            <div class="text-body-1 text-success mt-4 pa-4 target-action-box">
              {{ targetAction }}
            </div>

            <div class="text-body-1 text-success mt-4 pa-4 target-action-box" v-if="stereopsisAdvice">
              {{ stereopsisAdvice }}
            </div>
          </template>

          <div class="text-body-2 text-warning mt-6">
            免责声明：本系统的测试结果仅供康复训练参考，不作为临床医疗诊断依据。如有不适请及时就医。
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

const adviceTitle = computed(() => {
  if (offset.value.x > 5) return '矫正方向：强化分开 (Divergence)'
  if (offset.value.x < -5) return '矫正方向：强化集合 (Convergence)'
  return '基础视觉训练'
})

const adviceDesc = computed(() => {
  if (offset.value.x > 5) return '检测到您的双眼在静息状态下有向内偏斜的趋势（内隐斜）。根据临床视光学指南，为了维持清晰的双眼单视，您目前在过度动用“负融像性集合（NFV）”来对抗内斜。'
  if (offset.value.x < -5) return '检测到您的双眼在静息状态下有向外偏斜的趋势（外隐斜/集合不足）。根据临床视光学指南，为了维持清晰的双眼单视，您目前在过度动用“正融像性集合（PFV）”来对抗外斜。'
  return '您的眼位基本正常，接下来的康复训练将帮助您进一步巩固双眼视觉融合能力，预防视疲劳。'
})

const targetAction = computed(() => {
  if (offset.value.x > 5) return '【眼位训练重点】：您需要着重练习双眼的“分开（Divergence）”能力。在接下来的「聚散球」等康复游戏中，请多加练习将视线【由近处的球，跳跃注视到远处的球】，强迫眼部肌肉向外放松发散。'
  if (offset.value.x < -5) return '【眼位训练重点】：您需要着重练习双眼的“集合（Convergence）”能力。在接下来的「聚散球」等康复游戏中，请多加练习将视线【由远处的球，跳跃注视到近处的球】，强迫眼部肌肉向鼻梁内侧汇聚（俗称“斗鸡眼”）。'
  return '【眼位训练重点】：全面提升双眼聚散能力。'
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

const stereopsisColorClass = computed(() => {
  switch (stereopsisResult.value) {
    case 'normal': return 'text-success'
    case 'mild':
    case 'moderate': return 'text-warning'
    case 'severe': return 'text-error'
    default: return 'text-grey'
  }
})

const stereopsisAdvice = computed(() => {
  switch (stereopsisResult.value) {
    case 'normal': return '【立体视训练重点】：功能完好。继续保持，可以通过“进阶立体视”游戏进一步巩固高级双眼协同与手眼配合。'
    case 'mild': return '【立体视训练重点】：存在轻度受损。建议通过“聚散球”和“进阶立体视”训练，提升对双眼微小视差的融合敏锐度。'
    case 'moderate': return '【立体视训练重点】：存在中度受损。建议重点进行“聚散卡片”和“进阶立体视”训练，逐步重建双眼深度知觉。'
    case 'severe': return '【立体视训练重点】：严重受损或缺失。建议先从基础的“消除单眼抑制”开始（如洗牌、螺旋训练），待双眼能同时稳定感知画面后，再逐步进行大视差的立体视融合训练。'
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
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.advice-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.advice-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.target-action-box {
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
}

.btn-wrapper {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
}

.confirm-btn {
  border-radius: 12px;
  text-transform: none;
  font-size: 1.2rem;
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
