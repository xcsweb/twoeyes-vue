<template>
  <v-app class="bg-black">
    <v-btn
      v-if="showBackButton"
      icon="mdi-arrow-left"
      variant="text"
      class="global-back-btn"
      @click="goBack"
    ></v-btn>

    <div class="global-welfare-badge">
      公益
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
.global-welfare-badge {
  position: fixed;
  top: env(safe-area-inset-top, 16px);
  right: 16px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  font-size: 14px;
  font-weight: bold;
  pointer-events: none;
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
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3 !important;
}

.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  line-height: 1.3 !important;
}
</style>
