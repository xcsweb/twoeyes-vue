<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper">
      <h1 class="hint-top text-white text-center mb-10">
        系统需要确认您的镜片方向
      </h1>

      <div v-if="useObjectiveTest" class="objective-test-wrapper">
        <h2 class="text-white text-center mb-6">
          请戴上3D眼镜，<strong style="color: #ffeb3b">闭上右眼</strong>（只用左眼看）
        </h2>
        
        <div class="shapes-box">
          <div class="shape cyan-circle"></div>
          <div class="shape red-square"></div>
        </div>
        
        <p class="text-white text-center mb-6">
          请问您清晰地看到了什么形状（变成黑色/深色）？
        </p>
        
        <div class="btn-group">
          <v-btn
            color="#333"
            class="test-btn"
            height="100"
            @click="handleObjectiveComplete(true)"
          >
            <div class="d-flex flex-column align-center">
              <span class="text-h6 font-weight-bold text-white">青色圆形</span>
              <span class="text-caption text-grey mt-1">(红色正方形消失了)</span>
            </div>
          </v-btn>
          <v-btn
            color="#333"
            class="test-btn"
            height="100"
            @click="handleObjectiveComplete(false)"
          >
            <div class="d-flex flex-column align-center">
              <span class="text-h6 font-weight-bold text-white">红色正方形</span>
              <span class="text-caption text-grey mt-1">(青色圆形消失了)</span>
            </div>
          </v-btn>
        </div>
      </div>

      <div v-else class="manual-selection-wrapper">
        <v-btn
          :variant="lensConfig === 'red-cyan' ? 'elevated' : 'outlined'"
          :color="lensConfig === 'red-cyan' ? 'rgba(255,0,0,0.2)' : 'white'"
          class="lens-btn mb-6"
          height="100"
          block
          @click="handleSelectRedCyan"
        >
          <div class="d-flex align-center w-100 px-4">
            <div class="lens-indicator red-lens"></div>
            <div class="text-left ml-6">
              <div class="text-h6 text-white font-weight-bold text-none">左眼是红色</div>
              <div class="text-body-2 text-grey">右眼是蓝/青色 (常见)</div>
            </div>
          </div>
        </v-btn>

        <v-btn
          :variant="lensConfig === 'cyan-red' ? 'elevated' : 'outlined'"
          :color="lensConfig === 'cyan-red' ? 'rgba(0,255,255,0.2)' : 'white'"
          class="lens-btn"
          height="100"
          block
          @click="handleSelectCyanRed"
        >
          <div class="d-flex align-center w-100 px-4">
            <div class="lens-indicator cyan-lens"></div>
            <div class="text-left ml-6">
              <div class="text-h6 text-white font-weight-bold text-none">左眼是蓝/青色</div>
              <div class="text-body-2 text-grey">右眼是红色</div>
            </div>
          </div>
        </v-btn>

        <div class="text-center mt-10">
          <v-btn
            variant="text"
            color="#4fc3f7"
            class="text-decoration-underline text-none"
            @click="useObjectiveTest = true"
          >
            我不确定颜色？使用客观视标测试
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

const useObjectiveTest = ref(false)
const lensConfig = computed(() => settingsStore.lensConfig)

const nextLevel = () => {
  setTimeout(() => {
    router.push({ name: 'LensConfirmation' })
  }, 300)
}

const handleObjectiveComplete = (isLeftRed: boolean) => {
  if (isLeftRed) {
    settingsStore.changeLensConfig('red-cyan')
    settingsStore.changeLeftLense({ r: 255, g: 0, b: 0 })
    settingsStore.changeRightLense({ r: 0, g: 255, b: 255 })
  } else {
    settingsStore.changeLensConfig('cyan-red')
    settingsStore.changeLeftLense({ r: 0, g: 255, b: 255 })
    settingsStore.changeRightLense({ r: 255, g: 0, b: 0 })
  }
  nextLevel()
}

const handleSelectRedCyan = () => {
  settingsStore.changeLensConfig('red-cyan')
  settingsStore.changeLeftLense({ r: 255, g: 0, b: 0 })
  settingsStore.changeRightLense({ r: 0, g: 255, b: 255 })
  nextLevel()
}

const handleSelectCyanRed = () => {
  settingsStore.changeLensConfig('cyan-red')
  settingsStore.changeLeftLense({ r: 0, g: 255, b: 255 })
  settingsStore.changeRightLense({ r: 255, g: 0, b: 0 })
  nextLevel()
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
  max-width: 500px;
  width: 100%;
}

.hint-top {
  font-size: 2rem;
}

.shapes-box {
  width: 100%;
  height: 200px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 30px;
}

.shape {
  width: 80px;
  height: 80px;
}

.cyan-circle {
  background-color: cyan;
  border-radius: 50%;
}

.red-square {
  background-color: red;
}

.btn-group {
  display: flex;
  gap: 20px;
  width: 100%;
}

.test-btn {
  flex: 1;
  border-radius: 12px;
  text-transform: none;
}

.manual-selection-wrapper {
  margin-top: 2rem;
}

.lens-btn {
  border-radius: 12px;
  border: 1px solid white;
}

.lens-indicator {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid white;
}

.red-lens {
  background-color: red;
  box-shadow: 0 0 15px red;
}

.cyan-lens {
  background-color: cyan;
  box-shadow: 0 0 15px cyan;
}
</style>
