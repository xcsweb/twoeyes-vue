<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">双眼抑制客观测试</h1>
      <p class="text-grey mb-8">基于 Worth-4-Dot 原理，请保持双眼睁开，透过 3D 眼镜观察下方图案。</p>

      <div class="dots-container mx-auto mb-12">
        <div class="dot red-dot top-dot"></div>
        <div class="d-flex justify-space-between middle-dots">
          <div class="dot green-dot"></div>
          <div class="dot green-dot"></div>
        </div>
        <div class="dot white-dot bottom-dot"></div>
      </div>

      <v-card class="question-card mx-auto text-left mb-10" variant="outlined">
        <v-card-text>
          <div class="text-h6 text-white mb-6 text-center">您一共看到了几个圆点？</div>
          
          <v-btn
            v-for="(option, index) in options"
            :key="index"
            block
            :variant="selectedOption === option.value ? 'elevated' : 'outlined'"
            :color="selectedOption === option.value ? 'primary' : 'white'"
            class="option-btn mb-4"
            height="auto"
            @click="handleAnswer(option.value)"
          >
            <div class="d-flex flex-column align-start py-3 w-100">
              <span class="text-h6">{{ option.label }}</span>
            </div>
          </v-btn>
        </v-card-text>
      </v-card>
      
      <!-- Result Analysis Section -->
      <transition name="fade-up">
        <div v-if="resultMessage" class="result-analysis-section">
          <v-alert
            :type="resultType"
            variant="tonal"
            class="result-alert text-left mb-6"
            border="start"
          >
            <div class="text-h6 mb-2">测试结果分析</div>
            <div class="text-body-1">{{ resultMessage }}</div>
          </v-alert>
          
          <v-btn
            color="white"
            variant="elevated"
            size="x-large"
            block
            class="home-btn"
            @click="goNext"
          >
            继续进行十字准星对齐测试
          </v-btn>
        </div>
      </transition>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const settingsStore = useSettingsStore()
const resultMessage = ref<string | null>(null)
const resultType = ref<'success' | 'warning' | 'error'>('success')
const selectedOption = ref<number | null>(null)

const options = [
  { label: '4个圆点 (1红 2绿 1混合色)', value: 4 },
  { label: '2个圆点 (都是红色)', value: 2 },
  { label: '3个圆点 (都是绿色/青色)', value: 3 },
  { label: '5个圆点 (2红 3绿)', value: 5 }
]

const handleAnswer = (val: number) => {
  selectedOption.value = val
  const isRedCyan = settingsStore.lensConfig === 'red-cyan'
  
  if (val === 4) {
    resultType.value = 'success'
    resultMessage.value = '您的双眼视觉正常，没有明显的单眼抑制现象。这说明您的双眼在同时工作，能够将左右眼的图像融合。'
    settingsStore.setSuppressionStatus('none')
  } else if (val === 2) {
    resultType.value = 'warning'
    const suppressedEye = isRedCyan ? '右眼' : '左眼'
    resultMessage.value = `您的${suppressedEye}存在抑制现象。大脑在下意识地忽略该眼接收到的视觉信息。接下来的康复训练中，系统将对您的另一只优势眼进行“暗光惩罚（Penalization）”，强迫大脑使用被抑制的眼睛。`
    settingsStore.setSuppressionStatus(isRedCyan ? 'right' : 'left')
  } else if (val === 3) {
    resultType.value = 'warning'
    const suppressedEye = isRedCyan ? '左眼' : '右眼'
    resultMessage.value = `您的${suppressedEye}存在抑制现象。大脑在下意识地忽略该眼接收到的视觉信息。接下来的康复训练中，系统将对您的另一只优势眼进行“暗光惩罚（Penalization）”，强迫大脑使用被抑制的眼睛。`
    settingsStore.setSuppressionStatus(isRedCyan ? 'left' : 'right')
  } else if (val === 5) {
    resultType.value = 'error'
    resultMessage.value = '您存在复视现象，双眼无法将图像融合为一个整体。这通常与显性斜视或融合功能严重不足有关，建议结合临床指导进行针对性训练。'
    settingsStore.setSuppressionStatus('diplopia')
  }
}

const goNext = () => {
  router.push({ name: 'SectionIntroAlignment' })
}
</script>

<style scoped>
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding-top: 5vh;
  padding-bottom: 100px;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dots-container {
  position: relative;
  width: 120px;
  height: 180px;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.top-dot {
  top: 0;
}

.bottom-dot {
  bottom: 0;
}

.middle-dots {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
}

.middle-dots .dot {
  position: static;
  transform: none;
}

.red-dot { background-color: red; box-shadow: 0 0 20px red; }
.green-dot { background-color: #00ff00; box-shadow: 0 0 20px #00ff00; }
.white-dot { background-color: white; }

.question-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
}

.option-btn {
  border-radius: 12px;
  text-transform: none;
  white-space: normal;
  transition: all 0.3s ease;
}

.result-analysis-section {
  width: 100%;
}

.home-btn {
  border-radius: 12px;
  font-weight: bold;
  color: black !important;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
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
