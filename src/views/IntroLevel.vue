<template>
  <v-container fluid class="level-container fill-height" :style="{ backgroundColor: bgStyleColor }">
    <div class="content-wrapper">
      <h1 class="hint-top" :style="{ color: hintStyleColor }">
        <transition name="fade-slide" mode="out-in">
          <span :key="currentHint">{{ currentHint }}</span>
        </transition>
      </h1>
      
      <div class="hint-bottom-wrapper fade-in-delayed">
        <v-btn
          color="white"
          variant="outlined"
          size="x-large"
          class="start-btn mb-4"
          @click="startExperience"
        >
          开始体验
        </v-btn>
      </div>
    </div>
  </v-container>
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
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.content-wrapper {
  max-width: 800px;
  width: 100%;
}

.hint-top {
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.5px;
}

.hint-bottom-wrapper {
  margin-top: 6rem;
  display: flex;
  justify-content: center;
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

.fade-in-delayed {
  animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 2s forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .hint-top {
    font-size: 2rem;
  }
}
</style>
