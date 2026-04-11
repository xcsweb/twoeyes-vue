<template>
  <div class="manifesto-container" :style="{ backgroundColor: bgStyleColor, color: hintStyleColor }">
    <div class="manifesto-content">
      <!-- Intro Section -->
      <section class="manifesto-section hero-section">
        <transition name="fade-slide" mode="out-in">
          <h1 class="hero-text" :key="currentHint">{{ currentHint }}</h1>
        </transition>
        <div class="scroll-indicator">
          <span>向下滚动</span>
          <v-icon icon="mdi-chevron-down" class="bounce-icon"></v-icon>
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
            开始体验
          </v-btn>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

const hints = [
  "欢迎来到双眼视觉康复系统",
  "本系统将通过红蓝分离技术帮助您进行视功能训练",
  "在开始之前，请确保您已经准备好了红蓝或红青3D眼镜"
]
const currentIndex = ref(0)
const currentHint = computed(() => hints[currentIndex.value])

// Basic color setup
const bgStyleColor = '#000000'
const hintStyleColor = '#ffffff'

let intervalId: ReturnType<typeof setInterval>

const startExperience = () => {
  settingsStore.setHasSeenIntro(true)
  router.push({ name: 'Home' })
}

onMounted(() => {
  // Cycle hints automatically
  intervalId = setInterval(() => {
    if (currentIndex.value < hints.length - 1) {
      currentIndex.value++
    } else {
      clearInterval(intervalId) // Stop once we reach the end
    }
  }, 4000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
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

.hero-text {
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.5px;
  margin-bottom: 2rem;
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
  margin-top: 0.5rem;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 600px) {
  .hero-text {
    font-size: 2rem;
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
