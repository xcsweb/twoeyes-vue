<template>
  <div class="home-menu-container">
    <CosmicBackground />
    
    <div class="content-area">
      <h1 class="title" @click="handleSecretClick">双眼视觉康复系统</h1>
      <p class="subtitle">“黑夜给了我黑色的眼睛，我却用它寻找光明” —— 顾城</p>
      
      <div class="cards-wrapper">
        <!-- Intro Card -->
        <div class="elegant-card" @click="goToIntro">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/intro.webp" alt="intro" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">应用介绍</h2>
            <p class="card-text">
              了解双眼视觉康复的基本原理和系统使用指南。
            </p>
          </div>
        </div>

        <!-- Vision Test Card -->
        <div class="elegant-card" @click="goToVision">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/vision.webp" alt="vision" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">普通视力检查</h2>
            <p class="card-text">
              5 项基础视功能综合筛查，评估单双眼健康水平。
            </p>
          </div>
        </div>

        <!-- Exam Card -->
        <div class="elegant-card" @click="goToExam">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/exam.webp" alt="exam" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">斜视检查</h2>
            <p class="card-text">
              通过红蓝分视技术，客观测量隐斜视并测算视觉偏移量。
            </p>
          </div>
        </div>

        <!-- Amblyopia Exam Card -->
        <div class="elegant-card" @click="goToAmblyopia">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/amblyopia.webp" alt="amblyopia" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">弱视/抑制检查</h2>
            <p class="card-text">
              检测是否存在单眼抑制，并精准测定暗光惩罚阈值。
            </p>
          </div>
        </div>

        <!-- Training Card -->
        <div class="elegant-card" @click="goToTraining">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/training.webp" alt="training" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">康复训练</h2>
            <p class="card-text">
              基于检查数据的智能引擎，进行定制化脱抑制与融合训练。
            </p>
          </div>
        </div>

        <!-- Theory & References Card -->
        <div class="elegant-card" @click="goToTheory">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/theory.webp" alt="Theory & Literature" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">原理解析与文献</h2>
            <p class="card-text">
              查阅系统的核心临床指南、参考论文及医学实现原理。
            </p>
          </div>
        </div>

        <!-- User Profile Card -->
        <div class="elegant-card" @click="goToProfile">
          <div class="card-img-wrapper">
            <img class="card-img" src="../assets/images/cards/profile.webp" alt="Profile" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">个人信息与档案</h2>
            <p class="card-text">
              查看您完整的视功能报告与专科检查数据。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Dialog -->
    <v-dialog v-model="showDebug" max-width="400">
      <v-card bg-color="grey-darken-4">
        <v-card-title class="text-h5 text-warning font-weight-bold pt-4">
          <v-icon color="warning" class="mr-2">mdi-bug</v-icon>
          Debug / 开发模式
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-grey-lighten-1 mb-6">
            您已进入隐藏的开发者调试模式。您可以在此快速解锁所有训练阶段或重置系统状态。
          </p>
          <v-btn 
            color="success" 
            block 
            size="large" 
            class="mb-4"
            @click="unlockAllStages"
          >
            一键解锁所有训练阶段
          </v-btn>
          <v-btn 
            color="error" 
            block 
            size="large" 
            variant="outlined"
            @click="resetSystem"
          >
            清空数据并重置应用
          </v-btn>
        </v-card-text>
        <v-card-actions class="pb-4 pr-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showDebug = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../store/progress'
import { useSettingsStore } from '../store/settings'
import CosmicBackground from '../components/CosmicBackground.vue'

defineOptions({ name: 'HomeMenuLevel' })

const router = useRouter()
const progressStore = useProgressStore()
const settingsStore = useSettingsStore()

const showDebug = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('error')

let clickCount = 0
let clickTimeout: ReturnType<typeof setTimeout>

const handleSecretClick = () => {
  clickCount++
  if (clickCount >= 5) {
    showDebug.value = true
    clickCount = 0
  }
  clearTimeout(clickTimeout)
  clickTimeout = setTimeout(() => {
    clickCount = 0
  }, 1000)
}

const unlockAllStages = () => {
  progressStore.unlockStage(4)
  showDebug.value = false
  snackbarText.value = '已成功解锁全部 4 个训练阶段！'
  snackbarColor.value = 'success'
  snackbar.value = true
}

const resetSystem = () => {
  if (confirm('确认清空所有本地数据并重置应用吗？此操作不可逆。')) {
    localStorage.clear()
    window.location.reload() // Use reload instead of href='/' to clear memory cache without routing weirdness
  }
}

const goToIntro = () => {
  router.push({ name: 'Intro', query: { force: '1' } })
}

const goToVision = () => {
  router.push({ name: 'SectionIntroVision' })
}

const goToExam = () => {
  router.push({ name: 'SectionIntroExam' })
}

const goToAmblyopia = () => {
  router.push({ name: 'SectionIntroAmblyopia' })
}

const goToTraining = () => {
  const lastTest = settingsStore.lastTestTime
  const limit = settingsStore.testFrequency * 24 * 3600 * 1000
  
  if (lastTest === 0) {
    snackbarText.value = '您尚未进行视功能检查，请先完成测试以便生成专属康复方案'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  
  if (Date.now() - lastTest > limit) {
    snackbarText.value = '您的检测数据已过期，请先进行视力或斜弱视检查'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  router.push({ name: 'TrainingMenu' })
}

const goToTheory = () => {
  router.push({ name: 'Theory' })
}

const goToProfile = () => {
  router.push({ name: 'UserProfile' })
}
</script>

<style scoped>
.home-menu-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: white;
  position: relative;
  z-index: 0;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (min-width: 901px) {
  .home-menu-container {
    justify-content: center;
  }
}

.bg-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -2;
}

.bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%);
  z-index: -1;
}

.content-area {
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  min-height: min-content;
}

.title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 12px;
  letter-spacing: 2px;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.subtitle {
  font-size: 1.15rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 48px;
  text-align: center;
  font-style: italic;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}

.cards-wrapper {
  display: grid;
  /* Make cards smaller and more compact on PC, down to 260px minimum width */
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.elegant-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  display: flex;
  flex-direction: column;
}

.elegant-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  height: 140px; /* Reduced image height to make the card more compact */
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.elegant-card:hover .card-img {
  transform: scale(1.05);
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%; /* Extended gradient to ensure text remains readable */
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
}

.card-content {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.35rem; /* Slightly smaller title */
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.card-text {
  font-size: 0.95rem; /* Slightly smaller description */
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
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

@media (max-width: 900px) {
  .title {
    font-size: 2.5rem;
  }
  .content-area {
    padding-top: 40px;
  }
  .cards-wrapper {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
}
</style>
