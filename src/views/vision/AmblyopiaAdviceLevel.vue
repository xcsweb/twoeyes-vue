<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-8 text-white">弱视与抑制评估报告</h1>

      <v-card class="advice-card mx-auto text-left" variant="outlined">
        <v-card-text>
          <div class="text-h6 text-white mb-4">您的抑制测试结果：</div>
          
          <div class="advice-text text-grey mb-4">
            抑制状态: 
            <span class="text-white font-weight-bold ml-2">{{ suppressionText }}</span>
          </div>

          <div class="advice-text text-grey mb-4" v-if="suppressionStatus !== 'none' && suppressionStatus !== 'diplopia'">
            惩罚系数 (脱抑制训练强度): 
            <span class="text-white font-weight-bold ml-2">{{ (penalizationFactor * 100).toFixed(0) }}%</span>
          </div>

          <v-divider class="my-4" color="rgba(255,255,255,0.2)"></v-divider>

          <div class="text-h6 text-white mb-2">康复训练建议</div>
          
          <div class="advice-text text-grey mb-4">
            {{ adviceText }}
          </div>

          <div class="text-center mt-8">
            <v-btn
              color="primary"
              size="large"
              class="confirm-btn px-8"
              @click="goHome"
            >
              返回主页
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../../store/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

const suppressionStatus = computed(() => settingsStore.suppressionStatus)
const penalizationFactor = computed(() => settingsStore.penalizationFactor)

const suppressionText = computed(() => {
  switch (suppressionStatus.value) {
    case 'none': return '无抑制 (双眼视正常)'
    case 'left': return '左眼抑制'
    case 'right': return '右眼抑制'
    case 'diplopia': return '复视 (未融合)'
    default: return '未知'
  }
})

const adviceText = computed(() => {
  switch (suppressionStatus.value) {
    case 'none':
      return '您的双眼视觉功能正常，没有发现明显的单眼抑制现象。您可以继续保持良好的用眼习惯，或进行常规的视觉训练以巩固双眼视功能。'
    case 'left':
      return '检测到您的左眼存在抑制。系统已自动为您计算了惩罚系数。在接下来的训练中，我们将对优势眼（右眼）进行适当的视觉惩罚（降低对比度或亮度），以强迫大脑使用左眼，从而帮助打破抑制，建立双眼视觉。'
    case 'right':
      return '检测到您的右眼存在抑制。系统已自动为您计算了惩罚系数。在接下来的训练中，我们将对优势眼（左眼）进行适当的视觉惩罚（降低对比度或亮度），以强迫大脑使用右眼，从而帮助打破抑制，建立双眼视觉。'
    case 'diplopia':
      return '检测到您存在复视现象，这表明双眼图像尚未融合。建议您先进行基础的融合训练，逐步缩小双眼图像差异，直至能够将两个图像融合成一个单一、清晰的立体图像。'
    default:
      return '建议您咨询专业眼科医生获取进一步的诊断和治疗建议。'
  }
})

const goHome = () => {
  router.push('/')
}
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
.advice-card {
  background: rgba(20, 20, 25, 0.85);
  border-radius: 16px;
}
.confirm-btn {
  border-radius: 12px;
  font-weight: bold;
}
</style>