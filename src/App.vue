<template>
  <v-app class="bg-black">
    <v-btn
      v-if="showBackButton"
      icon="mdi-arrow-left"
      variant="text"
      class="global-back-btn"
      @click="goBack"
    ></v-btn>

    <div v-if="isHome" class="welfare-corner">
      <div class="welfare-ribbon">
        <span class="flower flower-left">🌸</span>
        <span class="welfare-text">公益</span>
        <span class="flower flower-right">🌺</span>
      </div>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" @after-leave="onAfterLeave" @after-enter="onAfterEnter">
        <keep-alive include="HomeMenuLevel,UserProfileLevel">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

    <v-dialog v-model="showUpdateDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          发现新版本
        </v-card-title>
        <v-card-text>
          系统有新版本可用，为了更好的体验，请点击确认进行更新。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="handleUpdateConfirm">立即更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { scrollState } from './router'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const showBackButton = computed(() => {
  return route.name !== 'Home' && route.name !== 'Intro'
})

const isHome = computed(() => {
  return route.name === 'Home'
})

const goBack = () => {
  router.go(-1)
}

const onAfterLeave = () => {
  if (!scrollState.savedPosition) {
    window.scrollTo(0, 0)
  }
}

const onAfterEnter = () => {
  if (scrollState.savedPosition) {
    window.scrollTo(
      scrollState.savedPosition.left || 0,
      scrollState.savedPosition.top || 0
    )
  }
}

router.beforeEach((_to, _from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {
  isLoading.value = false
})

const showUpdateDialog = ref(false)

const handleUpdateAvailable = () => {
  showUpdateDialog.value = true
}

const handleUpdateConfirm = () => {
  // @ts-ignore
  window.location.reload(true)
}

onMounted(() => {
  window.addEventListener('app-update-available', handleUpdateAvailable)
})

onUnmounted(() => {
  window.removeEventListener('app-update-available', handleUpdateAvailable)
})
</script>

<style>
.welfare-corner {
  position: fixed;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  overflow: hidden;
  z-index: 9999;
  pointer-events: none;
}

.welfare-ribbon {
  position: absolute;
  top: 25px;
  right: -35px;
  width: 200px;
  background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
  padding: 6px 0;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.welfare-text {
  color: #ff2a2a;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 2px;
  margin: 0 4px;
  text-shadow:
    -1px -1px 0 #fff,
     1px -1px 0 #fff,
    -1px  1px 0 #fff,
     1px  1px 0 #fff,
     0 2px 3px rgba(0,0,0,0.3);
}

.flower {
  font-size: 16px;
  display: inline-block;
  animation: flower-swing 3s ease-in-out infinite alternate;
  transform-origin: center bottom;
}

.flower-left { margin-right: 4px; }
.flower-right { margin-left: 4px; }

@keyframes flower-swing {
  0% { transform: rotate(-15deg) scale(0.95); }
  100% { transform: rotate(15deg) scale(1.05); }
}

.global-back-btn {
  position: fixed !important;
  top: env(safe-area-inset-top, 16px);
  left: 16px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  backdrop-filter: blur(4px);
}

.v-application {
  background-color: #000000 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;
  overflow: hidden; /* Prevent body level scrolling */
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  overflow: hidden;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3 !important;
}

.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  line-height: 1.3 !important;
}
</style>
