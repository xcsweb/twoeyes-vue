<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4 rounded-xl pa-6">
          <v-card-title class="text-h4 text-center mb-6 font-weight-bold">
            基本信息
          </v-card-title>
          <v-card-subtitle class="text-center mb-6 text-body-1">
            为了提供更个性化的训练方案，我们需要了解您的基本信息
          </v-card-subtitle>
          
          <v-card-text>
            <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
              <v-text-field
                v-model.number="age"
                label="年龄 (岁)"
                type="number"
                :rules="ageRules"
                variant="outlined"
                class="mb-6"
                prepend-inner-icon="mdi-calendar-account"
                required
              ></v-text-field>
              
              <v-btn
                color="primary"
                block
                size="x-large"
                type="submit"
                :disabled="!valid"
                class="rounded-lg text-h6 font-weight-bold"
              >
                继续
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'
import { useFlowManager } from '../composables/useFlowManager'

const router = useRouter()
const route = useRoute()
const store = useSettingsStore()
const { goNext } = useFlowManager()

const valid = ref(false)
const formRef = ref()
const age = ref<number | null>(store.age)

const ageRules = [
  (v: any) => !!v || '请输入年龄',
  (v: any) => (v > 0 && v <= 120) || '请输入有效的年龄 (1-120)'
]

onMounted(() => {
  // If age is already set and valid, we might want to validate the form immediately
  if (age.value) {
    // wait for next tick or just let vuetify handle it
    setTimeout(() => {
      if (formRef.value) formRef.value.validate()
    }, 100)
  }
})

const submitForm = async () => {
  if (!formRef.value) return
  
  const { valid: isValid } = await formRef.value.validate()
  
  if (isValid && age.value) {
    store.setAge(age.value)
    
    if (route.name) {
      goNext(route.name as string)
    } else {
      router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
</style>
