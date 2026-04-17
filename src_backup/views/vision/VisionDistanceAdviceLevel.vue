<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">
        <v-icon icon="mdi-ruler" class="mr-2" color="primary" size="48"></v-icon>
        视力测试距离提示
      </h1>
      
      <v-card class="advice-card mx-auto mt-8 text-left" variant="outlined">
        <v-card-text>
          <div class="text-h6 text-white mb-6 d-flex align-center">
            <v-icon :icon="isMobile ? 'mdi-cellphone' : 'mdi-monitor'" color="info" class="mr-3" size="32"></v-icon>
            {{ isMobile ? '检测到您可能正在使用手机或小屏设备' : '检测到您可能正在使用电脑或大屏设备' }}
          </div>
          
          <div class="distance-highlight text-center my-8">
            <div class="text-body-1 text-grey mb-2">请保持屏幕与眼睛的距离严格为：</div>
            <div class="text-h2 font-weight-bold" style="color: #4fc3f7">
              40 cm
            </div>
            <div class="text-body-1 mt-2 text-white">
              (约等于您的一臂折半距离)
            </div>
          </div>
          
          <v-divider class="my-6 border-opacity-25"></v-divider>
          
          <div class="text-body-2 text-grey-lighten-1">
            <strong>为什么需要固定 40cm 距离？</strong><br/>
            接下来的视力检查基于标准的“E”字视力表原理，通过视标在视网膜上成像的视角（5分视角）来计算您的视力水平（如 1.0, 4.8 等）。只有在固定的 40cm 距离下，软件渲染的像素才能精确转换为对应的视角大小，保证测试结果的医学准确性。
          </div>
          
          <div class="btn-wrapper mt-8 text-center">
            <v-btn
              color="primary"
              size="x-large"
              class="confirm-btn px-12"
              height="56"
              @click="startTest"
            >
              我已了解，开始测试
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFlowManager } from '../../composables/useFlowManager'
import { useRoute } from 'vue-router'

const isMobile = ref(false)
const { goNext } = useFlowManager()
const route = useRoute()

const startTest = () => {
  goNext(route.name as string)
}

const checkDeviceType = () => {
  // Simple heuristic: width < 768px is considered mobile/small screen
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkDeviceType()
  window.addEventListener('resize', checkDeviceType)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDeviceType)
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
  font-size: 2.2rem;
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

.distance-highlight {
  background: rgba(0, 0, 0, 0.3);
  padding: 24px;
  border-radius: 12px;
  border: 1px dashed rgba(79, 195, 247, 0.3);
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