<template>
  <div class="manifesto-container" :style="{ backgroundColor: bgStyleColor, color: hintStyleColor }">
    <div class="manifesto-content">
      <!-- Intro Section -->
      <section class="manifesto-section hero-section">
        <h1 class="hero-title fade-in-up">双眼视觉康复系统</h1>
        <p class="hero-subtitle fade-in-up-delay-1">治愈的双眼，才能仰望星空</p>
        
        <div class="hero-badges mt-6 mb-8 fade-in-up-delay-2">
          <v-chip color="primary" variant="flat" class="mr-2 mb-2">红蓝分离技术</v-chip>
          <v-chip color="info" variant="flat" class="mr-2 mb-2">临床数据驱动</v-chip>
          <v-chip color="success" variant="flat" class="mb-2">智能闭环康复</v-chip>
        </div>

        <p class="hero-description text-grey-lighten-1 fade-in-up-delay-3">
          在开始体验之前，请确保您已经准备好了 <strong class="text-white">红蓝（或红青）3D眼镜</strong>。
        </p>

        <div class="scroll-indicator fade-in-up-delay-4">
          <span>向下滚动了解更多</span>
          <v-icon icon="mdi-chevron-down" class="bounce-icon mt-2"></v-icon>
        </div>
      </section>

      <!-- 1. The problem with traditional therapy -->
      <section class="manifesto-section">
        <h2 class="section-title">传统治疗的困境</h2>
        <p class="section-text">
          传统的视觉康复往往枯燥且缺乏针对性。患者日复一日地重复着单调的训练，难以获得及时的正反馈。
          临床数据与居家训练之间存在难以跨越的鸿沟，导致治疗效果往往无法达到预期。
        </p>
        <p class="section-text">
          这种割裂不仅消耗了患者的耐心，也让康复之路显得漫长而孤独。
        </p>
      </section>

      <!-- 2. Our Core Advantage -->
      <section class="manifesto-section">
        <h2 class="section-title">我们的核心优势</h2>
        <p class="section-text highlight">
          打破壁垒，构建闭环。
        </p>
        <p class="section-text">
          我们将枯燥的训练转化为引人入胜的交互体验。通过先进的红蓝分离技术，我们将专业的临床数据与个性化训练紧密连接。
        </p>
        <p class="section-text">
          系统能够根据您的实时表现动态调整难度，形成一个精准、高效、千人千面的康复闭环。
          每一次训练，都是一次基于科学数据的专属视力唤醒。
        </p>
      </section>

      <!-- 3. Poetic Quote and Start Button -->
      <section class="manifesto-section ending-section">
        <blockquote class="poetic-quote">
          “我们倾尽心血构建这套系统，<br>
          却私心期盼您永远不必依赖它。<br>
          愿所有的视界终将重归澄明，<br>
          让治愈的双眼，去仰望那浩瀚的星空。”
        </blockquote>
        
        <div class="action-wrapper">
          <v-btn
            color="white"
            variant="outlined"
            size="x-large"
            class="start-btn"
            @click="startExperience"
          >
            我已准备好，开始体验
          </v-btn>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

// Basic color setup
const bgStyleColor = '#000000'
const hintStyleColor = '#ffffff'

const startExperience = () => {
  settingsStore.setHasSeenIntro(true)
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.manifesto-container {
  min-height: 100vh;
  width: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: center;
}

.manifesto-content {
  max-width: 800px;
  width: 100%;
  padding: 0 2rem;
  padding-bottom: 4rem;
}

.manifesto-section {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4rem 0;
  position: relative;
}

.hero-section {
  min-height: 100vh;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -1px;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
}

.hero-description {
  font-size: 1.1rem;
  max-width: 500px;
  line-height: 1.6;
}

.fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}
.fade-in-up-delay-1 {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
  transform: translateY(30px);
}
.fade-in-up-delay-2 {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
  transform: translateY(30px);
}
.fade-in-up-delay-3 {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
  opacity: 0;
  transform: translateY(30px);
}
.fade-in-up-delay-4 {
  animation: fadeIn 1.5s ease 1.5s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.6;
  font-size: 0.9rem;
  letter-spacing: 2px;
}

.bounce-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 2px;
}

.section-text {
  font-size: 1.25rem;
  line-height: 2;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.5rem;
  max-width: 650px;
  text-align: justify;
  text-align-last: center;
}

.section-text.highlight {
  font-size: 1.5rem;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 2rem;
}

.poetic-quote {
  font-size: 1.6rem;
  line-height: 2.2;
  font-style: italic;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 5rem 0;
  font-weight: 300;
  letter-spacing: 1px;
}

.action-wrapper {
  margin-top: 2rem;
}

.start-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 0 40px;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .section-text {
    font-size: 1.1rem;
    text-align: left;
    text-align-last: left;
  }
  .poetic-quote {
    font-size: 1.25rem;
  }
}
</style>
