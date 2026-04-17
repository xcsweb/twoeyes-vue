<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper" v-if="paper">
      
      <!-- Header / Title -->
      <div class="header mb-8">
        <h1 class="title text-white text-wrap">{{ paper.titleEn }}</h1>
        <h2 class="subtitle text-primary text-wrap mt-2">【译】{{ paper.titleZh }}</h2>
        
        <div class="meta-info mt-6 text-grey">
          <p class="mb-1"><v-icon size="small" class="mr-2">mdi-account-group</v-icon> <strong>Authors:</strong> {{ paper.authors }}</p>
          <p class="mb-1"><v-icon size="small" class="mr-2">mdi-book-open-page-variant</v-icon> <strong>Journal:</strong> <i>{{ paper.journal }}</i> ({{ paper.year }})</p>
        </div>
      </div>

      <!-- Abstracts -->
      <v-card class="theory-card mb-6" variant="outlined">
        <v-card-text>
          <div class="d-flex align-center mb-4">
            <v-icon color="white" class="mr-2">mdi-text-box-outline</v-icon>
            <h3 class="text-h6 text-white">Abstract (English)</h3>
          </div>
          <p class="text-body-1 text-grey-lighten-1 paragraph-text">
            {{ paper.abstractEn }}
          </p>

          <v-divider class="my-6 border-opacity-25" color="white"></v-divider>

          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-translate</v-icon>
            <h3 class="text-h6 text-white">摘要 (中文翻译)</h3>
          </div>
          <p class="text-body-1 text-grey-lighten-1 paragraph-text">
            {{ paper.abstractZh }}
          </p>
        </v-card-text>
      </v-card>

      <!-- System Relevance -->
      <v-card class="theory-card mb-8" variant="outlined" style="border-color: rgba(76, 175, 80, 0.4);">
        <v-card-text>
          <div class="d-flex align-center mb-2">
            <v-icon color="success" class="mr-2">mdi-check-decagram</v-icon>
            <h3 class="text-h6 text-white">本系统应用</h3>
          </div>
          <p class="text-body-1 text-success mt-2">
            {{ paper.systemRelevance }}
          </p>
        </v-card-text>
      </v-card>

      <!-- External Link -->
      <div class="text-center pb-10">
        <v-btn 
          color="info" 
          size="x-large" 
          variant="elevated" 
          class="external-btn"
          :href="paper.externalLink"
          target="_blank"
        >
          <v-icon left class="mr-2">mdi-open-in-new</v-icon>
          前往外部网站查看原文 (PubMed / PMC)
        </v-btn>
      </div>

    </div>
    <div class="content-wrapper text-center text-white" v-else>
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
      <h2 class="mb-4">找不到该文献</h2>
      <v-btn color="primary" @click="goBack">返回原理解析</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { papers } from '../data/papers'

const route = useRoute()
const router = useRouter()

const paper = computed(() => {
  const id = route.params.id as string
  return papers.find(p => p.id === id)
})

const goBack = () => {
  router.push({ name: 'Theory' })
}
</script>

<style scoped>
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 80px;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 800px;
  width: 100%;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.title {
  font-size: 1.8rem;
  line-height: 1.3;
}

.subtitle {
  font-size: 1.3rem;
  font-weight: normal;
  opacity: 0.9;
}

.theory-card {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 10px;
}

.paragraph-text {
  line-height: 1.8;
  letter-spacing: 0.5px;
}

.external-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: bold;
  letter-spacing: 1px;
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
</style>
