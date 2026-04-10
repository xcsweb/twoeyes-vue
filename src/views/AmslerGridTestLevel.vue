<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">黄斑功能筛查</h1>
      
      <div class="test-section">
        <p class="text-h6 text-white mb-6">
          请在明亮的光线下，戴上老花镜或近视眼镜（如有）。<br>
          遮住一只眼，用另一只眼注视下方表格<strong>正中心的白点</strong>。<br>
          保持注视中心点，观察周围的方格线条。
        </p>
        
        <div class="canvas-wrapper mx-auto mb-8 d-flex align-center justify-center">
          <div class="amsler-grid">
            <div class="center-dot"></div>
          </div>
        </div>

        <div class="controls mt-8">
          <div class="text-h6 text-white mb-4">您看到的方格线条是否出现以下情况？</div>
          <p class="text-body-1 text-grey mb-6">线条扭曲、模糊、缺失，或者有黑影/暗点遮挡</p>
          
          <v-row justify="center" class="mb-4">
            <v-btn size="x-large" color="error" variant="outlined" class="mx-4 action-btn" @click="submitResult('abnormal')">
              有扭曲/暗点/缺失
            </v-btn>
            <v-btn size="x-large" color="success" variant="outlined" class="mx-4 action-btn" @click="submitResult('normal')">
              完全正常（平直清晰）
            </v-btn>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../store/settings'
import { useVisionFlow } from '../composables/useVisionFlow'
import { useRoute } from 'vue-router'

const settingsStore = useSettingsStore()
const { goNext } = useVisionFlow()
const route = useRoute()

const submitResult = (result: 'normal' | 'abnormal') => {
  settingsStore.setMacularResult(result)
  goNext(route.name as string)
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
  max-width: 800px;
  width: 100%;
}

.canvas-wrapper {
  /* 10x10cm approximately 378px */
  width: 378px;
  height: 378px;
  max-width: 90vw;
  max-height: 90vw;
  position: relative;
  background-color: black;
  border: 2px solid white;
}

.amsler-grid {
  width: 100%;
  height: 100%;
  position: relative;
  /* Create a grid pattern with white lines on black background */
  background-image: 
    linear-gradient(white 1px, transparent 1px),
    linear-gradient(90deg, white 1px, transparent 1px);
  /* 20x20 grid, so each square is 5% of the width/height */
  background-size: 5% 5%;
  background-position: center center;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

.action-btn {
  min-width: 200px;
}
</style>
