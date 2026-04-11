<template>
  <v-container fluid class="level-container fill-height" :style="{ backgroundColor: bgStyleColor }">
    <div class="content-wrapper">
      <h1 class="section-title" :style="{ color: hintStyleColor }">
        <transition name="typewriter">
          <span>{{ title }}</span>
        </transition>
      </h1>
      
      <h3 v-if="subtitle" class="section-subtitle delayed-1" :style="{ color: hintStyleColor }">
        {{ subtitle }}
      </h3>
      
      <ul v-if="notes && notes.length" class="section-notes delayed-2" :style="{ color: hintStyleColor }">
        <li v-for="(note, idx) in notes" :key="idx" class="note-item">
          {{ note }}
        </li>
      </ul>

      <!-- 新增的游戏卡片列表区域 -->
      <div v-if="games && games.length" class="cards-wrapper mt-8 delayed-2">
        <div 
          v-for="(game, index) in games" 
          :key="index"
          class="elegant-card" 
          @click="startGame(game.routeName)"
        >
          <div class="card-img-wrapper">
            <img class="card-img" :src="trainingImg" :alt="game.title" :style="{ filter: 'hue-rotate(' + game.hueRotate + ')' }" />
            <div class="card-gradient"></div>
            <div class="play-overlay">
              <v-icon size="48" color="white">mdi-play-circle</v-icon>
            </div>
          </div>
          <div class="card-content">
            <h2 class="card-title mb-2">{{ game.title }}</h2>
            <p class="card-text">
              {{ game.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 针对没有子游戏列表的普通介绍页，显示开始大按钮 -->
      <div v-else class="start-btn-wrapper mt-10 delayed-2">
        <v-btn
          color="white"
          size="x-large"
          class="start-btn text-black font-weight-bold px-12"
          height="64"
          @click="startGame('')"
        >
          我已准备好，开始
        </v-btn>
      </div>

    </div>

    <!-- Snackbar for unauthorized stage access -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="error"
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
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgressStore } from '../store/progress'
import { useSettingsStore } from '../store/settings'
import trainingImg from '../assets/images/cards/training.jpg'
import { useFlowManager } from '../composables/useFlowManager'

const props = defineProps<{
  title: string
  subtitle?: string
  notes?: string[]
  requiredStageToEnter?: number
  games?: {
    title: string
    description: string
    routeName: string
    hueRotate: string
  }[]
}>()

const bgStyleColor = '#000000'
const hintStyleColor = '#ffffff'

const router = useRouter()
const route = useRoute()
const progressStore = useProgressStore()
const settingsStore = useSettingsStore()
const { navigateForward } = useFlowManager()

const snackbar = ref(false)
const snackbarText = ref('')

const startGame = (routeName: string) => {
  const result = navigateForward(route.name as string, routeName, props.requiredStageToEnter)
  if (!result.success && result.error) {
    snackbarText.value = result.error
    snackbar.value = true
  }
}
</script>

<style scoped>
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 2rem 2rem 80px 2rem;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
}

.section-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.section-subtitle {
  opacity: 0.8;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: normal;
}

.section-notes {
  opacity: 0.9;
  font-size: 1.2rem;
  line-height: 2rem;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
  list-style-type: disc;
  padding-left: 2rem;
}

.note-item {
  margin-bottom: 1rem;
}

/* Animations */
.delayed-1 {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.delayed-2 {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cards Wrapper */
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
}

.elegant-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;
}

.elegant-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.elegant-card:hover .card-img {
  transform: scale(1.05);
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 100%);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.elegant-card:hover .play-overlay {
  opacity: 1;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.card-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}
</style>
