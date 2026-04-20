<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="success-title mb-4">颜色域校准</h1>
      
      <p class="text-body-1 text-grey-lighten-1 mb-8">
        请戴上您的3D眼镜。观察下方四个色块，选择透过眼镜看时，<br/>
        <b>感觉最清晰且不刺眼</b>的一个色块。这将作为您后续训练的基础颜色强度。
      </p>

      <v-row class="mb-8" justify="center" align="center" style="max-width: 400px; margin: 0 auto;">
        <!-- 红色 100% -->
        <v-col cols="6">
          <v-card 
            class="d-flex flex-column align-center justify-center color-card"
            :class="{ 'selected-card': isSelected('red', 1.0) }"
            style="background-color: rgb(255, 0, 0); height: 150px; border-radius: 16px;"
            @click="selectCalibration('red', 1.0)"
          >
            <div class="text-h6 text-white font-weight-bold text-shadow">红色 (强)</div>
            <div class="text-caption text-white opacity-80 text-shadow">100% 强度</div>
          </v-card>
        </v-col>

        <!-- 红色 70% -->
        <v-col cols="6">
          <v-card 
            class="d-flex flex-column align-center justify-center color-card"
            :class="{ 'selected-card': isSelected('red', 0.7) }"
            style="background-color: rgb(178, 0, 0); height: 150px; border-radius: 16px;"
            @click="selectCalibration('red', 0.7)"
          >
            <div class="text-h6 text-white font-weight-bold text-shadow">红色 (弱)</div>
            <div class="text-caption text-white opacity-80 text-shadow">70% 强度</div>
          </v-card>
        </v-col>

        <!-- 青色 100% -->
        <v-col cols="6">
          <v-card 
            class="d-flex flex-column align-center justify-center color-card"
            :class="{ 'selected-card': isSelected('cyan', 1.0) }"
            style="background-color: rgb(0, 255, 255); height: 150px; border-radius: 16px;"
            @click="selectCalibration('cyan', 1.0)"
          >
            <div class="text-h6 text-black font-weight-bold text-shadow">青色 (强)</div>
            <div class="text-caption text-black opacity-80 text-shadow">100% 强度</div>
          </v-card>
        </v-col>

        <!-- 青色 70% -->
        <v-col cols="6">
          <v-card 
            class="d-flex flex-column align-center justify-center color-card"
            :class="{ 'selected-card': isSelected('cyan', 0.7) }"
            style="background-color: rgb(0, 178, 178); height: 150px; border-radius: 16px;"
            @click="selectCalibration('cyan', 0.7)"
          >
            <div class="text-h6 text-black font-weight-bold text-shadow">青色 (弱)</div>
            <div class="text-caption text-black opacity-80 text-shadow">70% 强度</div>
          </v-card>
        </v-col>
      </v-row>

      <div class="btn-wrapper mt-8 text-center">
        <v-btn 
          color="primary"
          size="x-large"
          class="confirm-btn px-12"
          height="56"
          :disabled="!hasSelected"
          @click="confirmAndNext"
        >
          确认并继续
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useFlowManager } from '../composables/useFlowManager'

const route = useRoute()
const settings = useSettingsStore()
const { goNext } = useFlowManager()

const selectedColor = ref<'red' | 'cyan' | null>(null)
const selectedIntensity = ref<number | null>(null)

const hasSelected = computed(() => selectedColor.value !== null && selectedIntensity.value !== null)

onMounted(() => {
  const lastConfig = localStorage.getItem('lastCalibratedLensConfig')
  if (lastConfig === settings.lensConfig) {
    // 镜片未变更，复用历史校准结果
    if (settings.calibratedColorIntensity.red < 1.0) {
      selectedColor.value = 'red'
      selectedIntensity.value = settings.calibratedColorIntensity.red
    } else if (settings.calibratedColorIntensity.cyan < 1.0) {
      selectedColor.value = 'cyan'
      selectedIntensity.value = settings.calibratedColorIntensity.cyan
    } else if (settings.calibratedColorIntensity.red === 1.0 && settings.calibratedColorIntensity.cyan === 1.0) {
      // 默认都是 1.0 的情况，默认选中红色 100%（或者由用户重选）
      selectedColor.value = 'red'
      selectedIntensity.value = 1.0
    }
  } else {
    // 镜片变更，重置并需重新校准
    settings.setCalibratedColorIntensity({ red: 1.0, cyan: 1.0 })
    selectedColor.value = null
    selectedIntensity.value = null
  }
})

function selectCalibration(color: 'red' | 'cyan', intensity: number) {
  selectedColor.value = color
  selectedIntensity.value = intensity
}

function isSelected(color: 'red' | 'cyan', intensity: number) {
  return selectedColor.value === color && selectedIntensity.value === intensity
}

function confirmAndNext() {
  if (!hasSelected.value) return

  const newIntensity = { red: 1.0, cyan: 1.0 }
  
  if (selectedColor.value === 'red') {
    newIntensity.red = selectedIntensity.value!
  } else {
    newIntensity.cyan = selectedIntensity.value!
  }

  if (selectedIntensity.value === 1.0) {
    newIntensity.red = 1.0
    newIntensity.cyan = 1.0
  }

  settings.setCalibratedColorIntensity(newIntensity)
  localStorage.setItem('lastCalibratedLensConfig', settings.lensConfig)

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
  max-width: 600px;
  width: 100%;
}

.success-title {
  color: #4caf50;
  font-size: 2.5rem;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.color-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 4px solid transparent !important;
  opacity: 0.9;
}

.color-card:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.selected-card {
  border-color: white !important;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5) !important;
  opacity: 1;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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
