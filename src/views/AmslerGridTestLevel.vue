<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper text-center">
      <h1 class="title mb-4 text-white">客观黄斑功能筛查</h1>
      
      <div class="test-section">
        <p class="text-h6 text-white mb-6">
          请在明亮的光线下，戴上老花镜或近视眼镜（如有）。<br>
          遮住一只眼，用另一只眼注视下方表格<strong>正中心的红点</strong>。<br>
          在这个方格网中，有**一个区域**的线条被人工扭曲了。<br>
          请点击您认为线条扭曲的那个区域。
        </p>

        <div class="text-h6 text-grey mb-4">测试进度: {{ currentTrial + 1 }} / {{ totalTrials }}</div>
        
        <div class="canvas-wrapper mx-auto mb-8 d-flex align-center justify-center">
          <div class="amsler-grid">
            <div class="center-dot"></div>
            <!-- Quadrant Overlays for clicking -->
            <div class="quadrant q-tl" @click="submitAnswer('tl')">
              <div v-if="distortedQuadrant === 'tl'" class="distortion-overlay"></div>
            </div>
            <div class="quadrant q-tr" @click="submitAnswer('tr')">
              <div v-if="distortedQuadrant === 'tr'" class="distortion-overlay"></div>
            </div>
            <div class="quadrant q-bl" @click="submitAnswer('bl')">
              <div v-if="distortedQuadrant === 'bl'" class="distortion-overlay"></div>
            </div>
            <div class="quadrant q-br" @click="submitAnswer('br')">
              <div v-if="distortedQuadrant === 'br'" class="distortion-overlay"></div>
            </div>
          </div>
        </div>

        <div class="controls mt-4">
          <v-btn size="x-large" color="error" variant="outlined" @click="submitAnswer('none')">
            我看不出哪里扭曲（或到处都扭曲）
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../store/settings'
import { useVisionFlow } from '../composables/useVisionFlow'
import { useRoute } from 'vue-router'

const settingsStore = useSettingsStore()
const { goNext } = useVisionFlow()
const route = useRoute()

const quadrants = ['tl', 'tr', 'bl', 'br']
const totalTrials = 4
const currentTrial = ref(0)
const distortedQuadrant = ref('')
const correctAnswers = ref(0)

const generateTrial = () => {
  const randomIndex = Math.floor(Math.random() * quadrants.length)
  distortedQuadrant.value = quadrants[randomIndex]
}

onMounted(() => {
  generateTrial()
})

const submitAnswer = (answer: string) => {
  if (answer === distortedQuadrant.value) {
    correctAnswers.value++
  }

  if (currentTrial.value < totalTrials - 1) {
    currentTrial.value++
    generateTrial()
  } else {
    finishTest()
  }
}

const finishTest = () => {
  // If user gets at least 3 out of 4 correct, they can clearly see the artificial distortion.
  // If they have macular degeneration, their own distortion masks the artificial one, causing errors.
  if (correctAnswers.value >= 3) {
    settingsStore.setMacularResult('normal')
  } else {
    settingsStore.setMacularResult('abnormal')
  }
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
  cursor: crosshair;
}

.amsler-grid {
  width: 100%;
  height: 100%;
  position: relative;
  /* Create a grid pattern with white lines on black background */
  background-image: 
    linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px);
  /* 20x20 grid, so each square is 5% of the width/height */
  background-size: 5% 5%;
  background-position: center center;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background-color: red;
  border-radius: 50%;
  z-index: 10;
}

/* 4 Quadrants for click detection */
.quadrant {
  position: absolute;
  width: 50%;
  height: 50%;
  z-index: 5;
  overflow: hidden; /* Contains the distortion effect within the quadrant */
}
.q-tl { top: 0; left: 0; }
.q-tr { top: 0; left: 50%; }
.q-bl { top: 50%; left: 0; }
.q-br { top: 50%; left: 50%; }

/* The artificial distortion */
.distortion-overlay {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  /* Use a strong glass/water ripple effect to visibly distort the grid beneath it */
  backdrop-filter: blur(4px) contrast(120%) saturate(200%);
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
  transform: scale(0.6);
  pointer-events: none; /* Let clicks pass through to the quadrant */
}
</style>
