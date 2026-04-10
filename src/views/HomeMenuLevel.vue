<template>
  <div class="home-menu-container">
    <!-- 右上角个人信息按钮 -->
    <v-btn 
      icon="mdi-account-circle" 
      size="x-large"
      color="white"
      variant="text" 
      class="profile-btn"
      @click="goToProfile"
    ></v-btn>

    <div class="bg-overlay"></div>
    <img class="bg-image" src="../assets/images/bg.jpg" alt="background" />
    
    <div class="content-area">
      <h1 class="title" @click="handleSecretClick">双眼视觉康复系统</h1>
      <p class="subtitle">临床级视功能检查与分阶段脱抑制训练平台</p>
      
      <div class="cards-wrapper">
        <!-- Intro Card -->
        <div class="elegant-card" @click="goToIntro">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20futuristic%20glowing%20digital%20book%20floating%20in%20dark%20space%20with%20abstract%20data%20streams%20and%20glowing%20blue%20neon%20lights%2C%20high%20tech%2C%20sci-fi%2C%20medical%20research%2C%20cinematic%20lighting&image_size=landscape_16_9" alt="intro" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">应用介绍</h2>
            <p class="card-text">
              了解双眼视觉康复的基本原理和应用使用指南。
            </p>
          </div>
        </div>

        <!-- Vision Test Card -->
        <div class="elegant-card" @click="goToVision">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20glowing%20holographic%20Snellen%20eye%20chart%20with%20letter%20E%2C%20modern%20medical%20clinic%20environment%2C%20dark%20background%2C%20blue%20and%20cyan%20lighting%2C%20cyberpunk%20medical%20aesthetic&image_size=landscape_16_9" alt="vision" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">普通视力检查</h2>
            <p class="card-text">
              测试单双眼视力水平，涵盖散光、色觉、黄斑功能及对比敏感度筛查。
            </p>
          </div>
        </div>

        <!-- Exam Card -->
        <div class="elegant-card" @click="goToExam">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Red%20and%20blue%20anaglyph%203D%20glasses%20glowing%20in%20the%20dark%2C%20cyber%20medical%20aesthetic%2C%20neon%20lights%2C%20high%20technology%2C%20holographic%20data%20overlay&image_size=landscape_16_9" alt="exam" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">斜视检查</h2>
            <p class="card-text">
              通过红蓝分视技术客观测量隐斜视，测算视觉偏移量。
            </p>
          </div>
        </div>

        <!-- Amblyopia Exam Card -->
        <div class="elegant-card" @click="goToAmblyopia">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20close%20up%20of%20a%20human%20eye%20with%20glowing%20digital%20data%20overlay%20on%20the%20pupil%2C%20medical%20technology%2C%20red%20and%20blue%20neon%20lights%2C%20dark%20background%2C%20cyber%20eye&image_size=landscape_16_9" alt="amblyopia" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">弱视/抑制检查</h2>
            <p class="card-text">
              检测是否存在单眼抑制，并精准测定弱视眼的暗光惩罚阈值。
            </p>
          </div>
        </div>

        <!-- Training Card -->
        <div class="elegant-card" @click="goToTraining">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Abstract%20floating%203D%20cubes%20in%20red%20and%20cyan%20colors%2C%20dynamic%20motion%2C%20dark%20background%2C%20cyber%20aesthetic%2C%20rehabilitation%20training%20concept&image_size=landscape_16_9" alt="training" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">康复训练</h2>
            <p class="card-text">
              基于检查数据的智能推荐引擎，进行脱抑制、融合与立体视定制化训练。
            </p>
          </div>
        </div>

        <!-- Theory & References Card -->
        <div class="elegant-card" @click="goToTheory">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20futuristic%20glowing%20digital%20book%20or%20hologram%20of%20medical%20literature%20floating%20in%20dark%20space%20with%20abstract%20data%20streams%20and%20glowing%20blue%20and%20purple%20neon%20lights%2C%20high%20tech%2C%20sci-fi%2C%20medical%20research%2C%20extremely%20high%20quality%2C%208k%20resolution%2C%20cinematic%20lighting%2C%20unreal%20engine%205%20render&image_size=landscape_16_9" alt="Theory & Literature" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">原理解析与文献</h2>
            <p class="card-text">
              了解本系统如何将检查数据与康复训练进行智能绑定。查阅核心临床指南与参考论文，包含洗牌训练（暗光惩罚疗法）、动态融合、聚散球（Brock String 视差原理）及俄罗斯方块（分视立体视建立）的医学实现原理。
            </p>
          </div>
        </div>

        <!-- User Profile Card -->
        <div class="elegant-card" @click="goToProfile">
          <div class="card-img-wrapper">
            <img class="card-img" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20futuristic%20digital%20medical%20dashboard%20showing%20human%20eye%20and%20brain%20data%2C%20holographic%20projections%2C%20dark%20background%2C%20cyan%20and%20purple%20neon%20lights&image_size=landscape_16_9" alt="Profile" />
            <div class="card-gradient"></div>
          </div>
          <div class="card-content">
            <h2 class="card-title">个人信息与康复档案</h2>
            <p class="card-text">
              查看您完整的 5 项基础视功能报告与斜弱视专科检查数据。
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../store/progress'

const router = useRouter()
const progressStore = useProgressStore()

const showDebug = ref(false)
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
  alert('已成功解锁全部 4 个训练阶段！')
}

const resetSystem = () => {
  if (confirm('确认清空所有本地数据并重置应用吗？此操作不可逆。')) {
    localStorage.clear()
    window.location.href = '/'
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
.profile-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
}

.home-menu-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
  padding: 60px 20px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -1px;
  color: #ffffff;
  text-align: center;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 60px;
  text-align: center;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}

.cards-wrapper {
  display: grid;
  /* Make cards smaller and more compact on PC, down to 260px minimum width */
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
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
  height: 160px; /* Reduced image height to make the card more compact */
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
  padding: 24px 20px;
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
