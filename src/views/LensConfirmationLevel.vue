<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="success-title mb-8">
        系统校准成功！
      </h1>

      <v-card class="confirmation-card mx-auto" variant="outlined">
        <v-card-text>
          <div class="text-h5 text-white mb-6">
            根据您的视觉反馈，系统已确认您的镜片佩戴方式：
          </div>

          <div class="d-flex justify-center align-center lenses-display my-8">
            <div class="eye-box text-center mx-4">
              <div class="text-grey mb-2">左眼 (Left)</div>
              <div
                class="lens-circle mx-auto"
                :style="{ backgroundColor: isLeftRed ? 'red' : 'cyan', boxShadow: `0 0 20px ${isLeftRed ? 'red' : 'cyan'}` }"
              ></div>
              <div class="text-white font-weight-bold mt-4">
                {{ isLeftRed ? "红色滤片" : "蓝色/青色滤片" }}
              </div>
            </div>

            <div class="eye-box text-center mx-4">
              <div class="text-grey mb-2">右眼 (Right)</div>
              <div
                class="lens-circle mx-auto"
                :style="{ backgroundColor: isLeftRed ? 'cyan' : 'red', boxShadow: `0 0 20px ${isLeftRed ? 'cyan' : 'red'}` }"
              ></div>
              <div class="text-white font-weight-bold mt-4">
                {{ isLeftRed ? "蓝色/青色滤片" : "红色滤片" }}
              </div>
            </div>
          </div>
          <div class="text-caption text-grey mt-6">
            * 该配置已保存。在接下来的训练中，系统将根据此配置为您精准推送防抑制视觉图像。
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '../store/settings'

const settingsStore = useSettingsStore()

const isLeftRed = computed(() => settingsStore.lensConfig === 'red-cyan')
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

.success-title {
  color: #4caf50;
  font-size: 2.5rem;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.confirmation-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.lens-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
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
