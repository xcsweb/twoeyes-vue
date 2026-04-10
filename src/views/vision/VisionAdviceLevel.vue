<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-8 text-white">视力评估报告</h1>

      <v-card class="advice-card mx-auto text-left" variant="outlined">
        <v-card-text>
          <div class="text-h6 text-white mb-4">您的基础视力测试结果：</div>
          
          <div class="advice-text text-grey mb-4">
            左眼视力: 
            <span class="text-white font-weight-bold ml-2">{{ visionAcuity.left.toFixed(2) }}</span>
          </div>

          <div class="advice-text text-grey mb-4">
            右眼视力: 
            <span class="text-white font-weight-bold ml-2">{{ visionAcuity.right.toFixed(2) }}</span>
          </div>

          <v-divider class="my-4" color="rgba(255,255,255,0.2)"></v-divider>

          <div class="text-h6 text-white mb-2">近视度数估算 (参考)</div>
          
          <div class="advice-text text-grey mb-2">
            左眼预估: <span class="text-warning font-weight-bold ml-2">{{ estimateDegrees(visionAcuity.left) }}</span>
          </div>
          <div class="advice-text text-grey mb-4">
            右眼预估: <span class="text-warning font-weight-bold ml-2">{{ estimateDegrees(visionAcuity.right) }}</span>
          </div>

          <div class="text-body-2 text-warning mt-6 bg-grey-darken-4 pa-3 rounded">
            <v-icon icon="mdi-alert-circle" size="small" class="mr-1"></v-icon>
            注意：近视度数估算仅供参考，不代表实际的医学屈光度数。精确度数请前往专业眼科或视光机构进行散瞳验光获取。
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '../../store/settings'

const settingsStore = useSettingsStore()

const visionAcuity = computed(() => settingsStore.visionAcuity)

const estimateDegrees = (acuity: number) => {
  if (acuity >= 1.0) return '0 度 (正常)'
  if (acuity >= 0.8) return '约 50 度'
  if (acuity >= 0.6) return '约 100 度'
  if (acuity >= 0.5) return '约 150 度'
  if (acuity >= 0.4) return '约 200 度'
  if (acuity >= 0.3) return '约 250 度'
  if (acuity >= 0.2) return '约 300 度'
  if (acuity >= 0.15) return '约 400 度'
  if (acuity >= 0.1) return '约 500 度'
  return '大于 600 度'
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
