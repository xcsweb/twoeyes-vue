<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <v-bottom-navigation
      v-if="showNav"
      v-model="navValue"
      :bg-color="navBgColor"
      :color="navColor"
      grow
      class="bottom-nav"
      @update:model-value="handleNavChange"
    >
      <v-btn v-if="btnBack" value="back">
        <v-icon>mdi-arrow-left</v-icon>
        <span>{{ btnBack.label ?? '上一步' }}</span>
      </v-btn>

      <v-btn v-if="btnNext" value="next">
        <v-icon>mdi-arrow-right</v-icon>
        <span>{{ btnNext.label ?? nextLabel }}</span>
      </v-btn>

      <v-btn v-if="btnMenu" value="menu">
        <v-icon>mdi-view-grid</v-icon>
        <span>{{ btnMenu.label ?? '训练菜单' }}</span>
      </v-btn>

      <v-btn v-if="btnHome" value="home">
        <v-icon>mdi-home</v-icon>
        <span>{{ btnHome.label ?? '回到主页' }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routeBottomNavConfig, type BottomNavAction, type NavTarget } from './config/routeBottomNav'
import { useProgressStore } from './store/progress'
import { useExamFlow } from './composables/useExamFlow'
import { useVisionFlow } from './composables/useVisionFlow'

const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()
const { goNext: goExamNext, goBack: goExamBack } = useExamFlow()
const { goNext: goVisionNext, goBack: goVisionBack } = useVisionFlow()
const navValue = ref<string>('')

const navBgColor = computed(() => '#121212')
const navColor = computed(() => 'white')

const routeSpec = computed(() => {
  const name = route.name as string | undefined
  if (!name) return undefined
  return routeBottomNavConfig[name]
})

const showNav = computed(() => routeSpec.value?.showNav ?? false)
const nextLabel = computed(() => {
  const spec = routeSpec.value
  if (!spec) return '下一步'
  
  if (route.name === 'SuppressionTest' || route.name === 'ContrastTest') {
    if (route.query.step === 'test') return '' // Hide next during test
    if (route.query.step === 'result') return '确认结果'
    return '开始测试'
  }
  
  return spec.nextLabel ?? '下一步'
})

const btnBack = computed(() => routeSpec.value?.buttons.back)
const btnNext = computed(() => {
  if ((route.name === 'SuppressionTest' || route.name === 'ContrastTest') && route.query.step === 'test') {
    return undefined // Hide next button completely during test
  }
  return routeSpec.value?.buttons.next
})
const btnHome = computed(() => routeSpec.value?.buttons.home)
const btnMenu = computed(() => routeSpec.value?.buttons.menu)

const runTarget = (target: NavTarget, action: BottomNavAction) => {
  if (target.type === 'exam_flow') {
    const currentRouteName = route.name as string
    if (action === 'next') {
      goExamNext(currentRouteName)
    } else if (action === 'back') {
      goExamBack(currentRouteName)
    }
    return
  }
  if (target.type === 'exam_flow_test') {
    const currentRouteName = route.name as string
    if (currentRouteName === 'SuppressionTest' || currentRouteName === 'ContrastTest') {
      if (route.query.step === 'test') {
        // already testing, shouldn't click next, but just in case
      } else if (route.query.step === 'result') {
        goExamNext(currentRouteName)
      } else {
        // from intro -> start test
        router.replace({ query: { ...route.query, step: 'test' } })
      }
    }
    return
  }
  if (target.type === 'vision_flow') {
    const currentRouteName = route.name as string
    if (action === 'next') {
      goVisionNext(currentRouteName)
    } else if (action === 'back') {
      goVisionBack(currentRouteName)
    }
    return
  }
  if (target.type === 'history') {
    router.go(target.delta)
    return
  }
  router.push(target.to)
}

const handleNavChange = (value: string) => {
  if (!['back', 'next', 'home', 'menu'].includes(value)) {
    navValue.value = ''
    return
  }
  const action = value as BottomNavAction
  const spec = routeSpec.value
  const btn = spec?.buttons?.[action]
  if (!btn) return

  if (action === 'next' && spec?.requiredStageToEnter !== undefined) {
    if (progressStore.unlockedStage < spec.requiredStageToEnter) {
      alert(`请先在阶段 ${spec.requiredStageToEnter - 1} 训练满规定时间（60秒）后再进入本阶段！`)
      navValue.value = ''
      return
    }
  }

  runTarget(btn.target, action)

  setTimeout(() => {
    navValue.value = ''
  }, 100)
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  transform: translateX(-50%);
  width: calc(100% - 24px);
  max-width: 720px;
  z-index: 1000;
  border-radius: 18px;
  background: rgba(18, 18, 18, 0.72) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
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
