<template>
  <v-app class="bg-black">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" @after-leave="onAfterLeave" @after-enter="onAfterEnter">
        <keep-alive include="HomeMenuLevel,UserProfileLevel">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

    <v-bottom-navigation
      v-if="showNav"
      :bg-color="navBgColor"
      :color="navColor"
      grow
      class="bottom-nav"
    >
      <v-btn v-if="btnBack" value="back" @click.stop="handleNavClick('back')">
        <v-icon>mdi-arrow-left</v-icon>
        <span>{{ navMeta.backLabel ?? '上一步' }}</span>
      </v-btn>

      <v-btn v-if="btnNext" value="next" @click.stop="handleNavClick('next')">
        <v-icon>mdi-arrow-right</v-icon>
        <span>{{ nextLabel }}</span>
      </v-btn>

      <v-btn v-if="btnMenu" value="menu" @click.stop="handleNavClick('menu')">
        <v-icon>mdi-view-grid</v-icon>
        <span>{{ navMeta.menuLabel ?? '训练菜单' }}</span>
      </v-btn>

      <v-btn v-if="btnHome" value="home" @click.stop="handleNavClick('home')">
        <v-icon>mdi-home</v-icon>
        <span>{{ navMeta.homeLabel ?? '回到主页' }}</span>
      </v-btn>
    </v-bottom-navigation>

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
import { useFlowManager } from './composables/useFlowManager'

const route = useRoute()
const router = useRouter()
const { navigateForward, goBack } = useFlowManager()
const isLoading = ref(false)

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

const navBgColor = computed(() => '#121212')
const navColor = computed(() => 'white')

const navMeta = computed(() => route.meta.nav || {})
const showNav = computed(() => navMeta.value.show ?? false)

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

const nextLabel = computed(() => {
  if (route.name === 'SuppressionTest' || route.name === 'ContrastTest') {
    if (route.query.step === 'test') return '' // Hide next during test
    if (route.query.step === 'result') return '确认结果'
    return '开始测试'
  }
  return navMeta.value.nextLabel ?? '下一步'
})

const btnBack = computed(() => {
  if (navMeta.value.back === false) return false
  return navMeta.value.back !== undefined
})
const btnNext = computed(() => {
  if ((route.name === 'SuppressionTest' || route.name === 'ContrastTest') && route.query.step === 'test') {
    return false // Hide next button completely during test
  }
  return !!navMeta.value.next
})
const btnHome = computed(() => !!navMeta.value.home)
const btnMenu = computed(() => !!navMeta.value.menu)

const handleNavClick = (action: 'back' | 'next' | 'home' | 'menu') => {
  const target = navMeta.value[action]
  
  if (action === 'home') {
    router.push({ name: 'Home' })
    return
  }

  if (action === 'menu') {
    router.push({ name: 'TrainingMenu' })
    return
  }

  if (!target) return

  // For next/back, use unified flow manager
  const currentRouteName = route.name as string
  
  if (action === 'back') {
    const backTarget = navMeta.value.back
    if (typeof backTarget === 'string') {
      router.push({ name: backTarget })
    } else {
      goBack(currentRouteName)
    }
    return
  }

  if (action === 'next') {
    // Test logic specific override
    if (currentRouteName === 'SuppressionTest' || currentRouteName === 'ContrastTest') {
      if (route.query.step === 'test') {
        return // Ignore next during test
      } else if (!route.query.step) {
        // from intro -> start test
        router.replace({ query: { ...route.query, step: 'test' } })
        return
      }
    }

    const result = navigateForward(currentRouteName, undefined, route.meta.requiredStageToEnter as number | undefined)
    if (!result.success && result.error) {
      alert(result.error)
    }
  }
}
</script>

<style>
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

.bottom-nav {
  position: fixed !important;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 12px) !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 auto !important;
  width: calc(100% - 24px) !important;
  max-width: 720px !important;
  z-index: 1000 !important;
  border-radius: 18px !important;
  background: rgba(18, 18, 18, 0.72) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
  /* Reset transform if vuetify adds it inline to prevent horizontal shifting,
     but we only reset translateX just in case, though left/right margin auto handles it */
}

.bottom-nav .v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
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
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 96px);
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3 !important;
}

.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  line-height: 1.3 !important;
}
</style>
