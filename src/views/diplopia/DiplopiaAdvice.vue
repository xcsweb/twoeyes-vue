<template>
  <v-container fluid class="fill-height bg-black pa-0">
    <div class="w-100 h-100 d-flex flex-column" style="overflow-y: auto;">
      <!-- Header -->
      <div class="pa-4 bg-grey-darken-4 d-flex align-center elevation-2">
        <v-btn icon="mdi-arrow-left" variant="text" color="white" @click="goBack()"></v-btn>
        <h2 class="text-h6 text-white ml-2 mb-0">复视诊断结果报告</h2>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-home" variant="text" color="white" @click="router.replace({ name: 'Home' })"></v-btn>
      </div>

      <v-container class="flex-grow-1 py-6" style="max-width: 800px;">
        <v-card class="bg-grey-darken-4 text-white rounded-xl mb-6 elevation-4">
          <v-card-title class="text-h5 pa-6 pb-2 d-flex align-center">
            <v-icon color="primary" class="mr-3" size="32">mdi-clipboard-text-search-outline</v-icon>
            测试数据分析
          </v-card-title>
          
          <v-card-text class="pa-6 pt-2">
            <v-row>
              <!-- Monocular Diplopia Data -->
              <v-col cols="12" md="6">
                <div class="text-h6 mb-3 text-primary">单眼复视 (遮盖另一眼时)</div>
                <div class="mb-2">
                  <span class="text-grey-lighten-1">右眼：</span>
                  <span v-if="monocularRight.hasGhost" class="text-error font-weight-bold">
                    存在重影 (偏移 X: {{ monocularRight.offsetX }}, Y: {{ monocularRight.offsetY }})
                  </span>
                  <span v-else class="text-success">无重影</span>
                </div>
                <div>
                  <span class="text-grey-lighten-1">左眼：</span>
                  <span v-if="monocularLeft.hasGhost" class="text-error font-weight-bold">
                    存在重影 (偏移 X: {{ monocularLeft.offsetX }}, Y: {{ monocularLeft.offsetY }})
                  </span>
                  <span v-else class="text-success">无重影</span>
                </div>
              </v-col>

              <!-- Binocular Diplopia Data -->
              <v-col cols="12" md="6">
                <div class="text-h6 mb-3 text-primary">双眼复视 (双眼同时看时)</div>
                <div>
                  <span class="text-grey-lighten-1">状态：</span>
                  <span v-if="binocular.hasSeparation" class="text-error font-weight-bold">
                    存在分离 (偏移 X: {{ binocular.offsetX }}, Y: {{ binocular.offsetY }})
                  </span>
                  <span v-else class="text-success">无分离/融合正常</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="bg-grey-darken-4 text-white rounded-xl mb-6 elevation-4 border-l-4" :style="{ borderLeftColor: reportSeverityColor }">
          <v-card-title class="text-h5 pa-6 pb-2 d-flex align-center">
            <v-icon :color="reportSeverityColor" class="mr-3" size="32">mdi-stethoscope</v-icon>
            初步诊断建议
          </v-card-title>
          
          <v-card-text class="pa-6 pt-2">
            <div class="text-body-1 mb-4 text-pre-wrap" style="line-height: 1.8; white-space: pre-wrap;">
              {{ diagnosticMessage }}
            </div>
            
            <v-alert v-if="hasAnyDiplopia" type="warning" variant="tonal" class="mt-4">
              注意：本应用提供的测试结果仅供参考，不能替代专业眼科医生的诊断。如果您的复视症状是近期突然出现的，请务必尽快就医排查神经系统或血管问题。
            </v-alert>
          </v-card-text>
        </v-card>

        <div class="d-flex justify-center mt-8">
          <v-btn color="primary" size="x-large" rounded="pill" elevation="4" class="px-8" @click="router.replace({ name: 'Home' })">
            返回首页
          </v-btn>
        </div>
      </v-container>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../../store/settings'
import { useFlowManager } from '../../composables/useFlowManager'

const router = useRouter()
const settingsStore = useSettingsStore()
const { goBack } = useFlowManager()

// Retrieve results safely
const diplopiaResult = settingsStore.diplopiaResult || {
  monocular: {
    right: { hasGhost: false, offsetX: 0, offsetY: 0 },
    left: { hasGhost: false, offsetX: 0, offsetY: 0 }
  },
  binocular: {
    hasSeparation: false,
    offsetX: 0,
    offsetY: 0
  }
}

const monocularRight = diplopiaResult.monocular.right
const monocularLeft = diplopiaResult.monocular.left
const binocular = diplopiaResult.binocular

const hasMonocularDiplopia = monocularRight.hasGhost || monocularLeft.hasGhost
const hasBinocularDiplopia = binocular.hasSeparation
const hasAnyDiplopia = hasMonocularDiplopia || hasBinocularDiplopia

// Compute diagnostic message based on rules:
// - Monocular mostly refractive/cataract
// - Binocular mostly strabismus/nerve palsy
const diagnosticMessage = computed(() => {
  if (!hasAnyDiplopia) {
    return '恭喜您，根据测试结果，您当前没有明显的单眼或双眼复视症状。您的眼球运动和屈光状态看起来处于健康范围内。建议您保持良好的用眼习惯，定期进行眼部检查。'
  }

  let msg = '根据您的测试数据，发现以下问题：\n\n'

  if (hasMonocularDiplopia) {
    msg += '【单眼复视】\n'
    msg += '在遮盖一只眼睛的情况下，另一只眼依然能看到重影。这种情况通常是由于眼球本身的光学问题引起的，而不是眼肌或神经问题。常见原因包括：未矫正的散光、白内障、角膜病变（如圆锥角膜）、晶状体脱位或干眼症。建议您前往眼科进行详细的屈光检查、裂隙灯检查和眼底检查。\n\n'
  }

  if (hasBinocularDiplopia) {
    msg += '【双眼复视】\n'
    msg += '在双眼同时看时出现分离或重影，但遮盖任意一只眼后重影消失。这表明您的两只眼睛分别看到了清晰的图像，但大脑无法将它们融合为一个单一的画面。这种情况通常与眼球运动障碍或双眼视觉对齐不良有关。常见原因包括：斜视（隐斜或显斜）、动眼神经麻痹、甲状腺相关眼病、重症肌无力或眼眶外伤。'
    if (binocular.offsetX !== 0 || binocular.offsetY !== 0) {
      msg += `（系统记录到了您的视差偏移量，水平偏移: ${binocular.offsetX}，垂直偏移: ${binocular.offsetY}，这可能反映了特定方向的斜视角）`
    }
    msg += '建议您寻求专业的眼科或神经眼科医生进行眼肌检查和神经系统排查。\n\n'
  }

  return msg
})

const reportSeverityColor = computed(() => {
  if (!hasAnyDiplopia) return 'success'
  if (hasBinocularDiplopia) return 'error'
  return 'warning'
})

</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px !important;
  border-left-style: solid !important;
}
</style>
