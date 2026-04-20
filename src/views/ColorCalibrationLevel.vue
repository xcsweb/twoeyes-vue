<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="success-title mb-4">颜色域校准</h1>
      
      <p class="text-body-1 text-grey-lighten-1 mb-8">
        请戴上您的 3D 眼镜。
      </p>

      <div class="phase-card mx-auto mb-6">
        <div class="text-h6 text-white mb-2">{{ phaseTitle }}</div>
        <div class="text-body-2 text-grey-lighten-1">
          {{ phaseInstruction }}
        </div>
      </div>

      <div class="calibration-grid-wrapper mb-8">
        <div class="calibration-grid">
          <button
            v-for="cell in cells"
            :key="cell.key"
            type="button"
            class="calibration-cell"
            :class="{ selected: cell.isSelected }"
            :style="{ backgroundColor: cell.bg }"
            @click="selectCell(cell.intensity)"
          ></button>
        </div>
      </div>

      <div class="btn-wrapper mt-8 text-center">
        <v-btn 
          color="primary"
          size="x-large"
          class="confirm-btn px-12"
          height="56"
          :disabled="!canConfirm"
          @click="handleConfirm"
        >
          {{ confirmText }}
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

const phase = ref<'red' | 'cyan'>('red')
const selectedRed = ref<number | null>(null)
const selectedCyan = ref<number | null>(null)

const redEyeName = computed(() => settings.lensConfig === 'red-cyan' ? '左眼' : '右眼')
const cyanEyeName = computed(() => settings.lensConfig === 'red-cyan' ? '右眼' : '左眼')

const phaseTitle = computed(() => phase.value === 'red' ? '第 1 步：红色域校准' : '第 2 步：青(蓝)色域校准')
const phaseInstruction = computed(() => {
  if (phase.value === 'red') {
    return `请闭上${cyanEyeName.value}（青/蓝片），只用${redEyeName.value}（红片）观察：选择一个“最清晰且不刺眼”的红色块。`
  }
  return `请闭上${redEyeName.value}（红片），只用${cyanEyeName.value}（青/蓝片）观察：选择一个“最清晰且不刺眼”的青(蓝)色块。`
})

const minIntensity = 0.35
const maxIntensity = 1.0
const levels = computed(() => {
  return Array.from({ length: 64 }, (_, idx) => {
    const t = idx / 63
    return Number((minIntensity + (maxIntensity - minIntensity) * t).toFixed(2))
  })
})

const selectedIntensity = computed(() => phase.value === 'red' ? selectedRed.value : selectedCyan.value)
const canConfirm = computed(() => selectedIntensity.value !== null)
const confirmText = computed(() => phase.value === 'red' ? '确认红色并继续' : '保存并继续')

const cells = computed(() => {
  const selected = selectedIntensity.value
  return levels.value.map((intensity, idx) => {
    const channel = Math.round(255 * intensity)
    const bg = phase.value === 'red'
      ? `rgb(${channel}, 0, 0)`
      : `rgb(0, ${channel}, ${channel})`
    return {
      key: `${phase.value}-${idx}`,
      intensity,
      bg,
      isSelected: selected !== null && Math.abs(selected - intensity) < 0.001
    }
  })
})

onMounted(() => {
  const lastConfig = localStorage.getItem('lastCalibratedLensConfig')
  if (lastConfig === settings.lensConfig) {
    selectedRed.value = settings.calibratedColorIntensity.red
    selectedCyan.value = settings.calibratedColorIntensity.cyan
  } else {
    settings.setCalibratedColorIntensity({ red: 1.0, cyan: 1.0 })
    selectedRed.value = null
    selectedCyan.value = null
  }
})

function selectCell(intensity: number) {
  if (phase.value === 'red') {
    selectedRed.value = intensity
  } else {
    selectedCyan.value = intensity
  }
}

function handleConfirm() {
  if (phase.value === 'red') {
    if (selectedRed.value === null) return
    phase.value = 'cyan'
    return
  }

  if (selectedCyan.value === null) return

  settings.setCalibratedColorIntensity({
    red: selectedRed.value ?? 1.0,
    cyan: selectedCyan.value ?? 1.0
  })
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

.phase-card {
  max-width: 720px;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px 18px;
}

.calibration-grid-wrapper {
  max-width: 520px;
  margin: 0 auto;
}

.calibration-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.calibration-cell {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  border: 3px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
  opacity: 0.92;
}

.calibration-cell:hover {
  transform: translateY(-1px);
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.18);
}

.calibration-cell.selected {
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.35);
  opacity: 1;
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
