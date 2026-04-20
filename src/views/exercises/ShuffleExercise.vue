<template>
  <div class="exercise-container" ref="containerRef">
    <div v-if="!isWebGLAvailable" class="fallback-msg">
      当前环境无法创建 WebGL 渲染上下文，已自动切换为兼容模式。请使用支持 WebGL 的浏览器继续训练。
    </div>
    <div class="progress-hud">
      <span :class="{ 'text-success': isTargetReached, 'text-white': !isTargetReached }">
        剩余训练时间: {{ formattedTime }}
        <span v-if="isTargetReached" class="ml-2">✓ 今日训练已达标</span>
      </span>
    </div>
    <PersonalizedHud />

      </div>

    <v-dialog v-model="showCompletionDialog" max-width="400" persistent>
      <v-card color="grey-darken-4" class="text-center pa-4">
        <v-card-title class="text-h5 text-success mb-4">
          🎉 恭喜完成今日训练！
        </v-card-title>
        <v-card-text class="text-body-1 mb-4">
          您已达到本阶段每日建议的训练时长（15分钟）。
          继续训练可能导致眼睛疲劳，建议您现在休息。
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" variant="elevated" @click="returnToMenu">
            返回菜单
          </v-btn>
          <v-btn color="grey" variant="text" @click="showCompletionDialog = false">
            继续训练
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script setup lang="ts">
import { useStageTimer } from '../../composables/useStageTimer'

import PersonalizedHud from '../../components/PersonalizedHud.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

import * as THREE from 'three'
import gsap from 'gsap'
import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'

const containerRef = ref<HTMLElement | null>(null)
const isWebGLAvailable = ref(true)
const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let intervalId: number
let timerId: number

const STAGE_NUMBER = 1 // Shuffle Exercise belongs to Stage 1
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)


const numBoxes = 10
const boxes: { mesh: THREE.Mesh, material: THREE.MeshStandardMaterial }[] = []

const initThree = () => {
  if (!containerRef.value) return

  // Check WebGL
  try {
    const canvas = document.createElement('canvas')
    isWebGLAvailable.value = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch (e) {
    isWebGLAvailable.value = false
  }

  if (!isWebGLAvailable.value) return

  // Setup Scene
  scene = new THREE.Scene()
  
  // Setup Camera
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 100

  // Setup Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  containerRef.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 2)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.3)
  scene.add(pointLight)

  const spotLight = new THREE.SpotLight(0xffffff, 0.2)
  spotLight.position.set(150, 150, 250)
  spotLight.angle = Math.PI / 7
  spotLight.penumbra = 1
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  scene.add(spotLight)

  // Create Boxes
  const colors = [
    new THREE.Color(settingsStore.leftEyeFinalColorStr),
    new THREE.Color(settingsStore.rightEyeFinalColorStr)
  ]

  const offset = settingsStore.alignmentOffset.x

  // Dynamic sizing based on clinical offset
  // A larger offset means worse fusion capability -> larger blocks (lower spatial frequency)
  const absOffset = Math.abs(offset)
  const sizeMultiplier = 1 + Math.min(absOffset / 20, 1.5) // Up to 2.5x larger

  // Dynamic speed based on offset
  // A larger offset means slower speed to allow more time for motor fusion
  const duration = 1.5 + (absOffset / 30) // Slower by up to +1.5s
  const intervalTime = Math.max(3000, duration * 1000 + 500)

  for (let i = 0; i < numBoxes; i++) {
    // Base size is 3 to 6
    const w = (3 + Math.random() * 3) * sizeMultiplier
    const h = (3 + Math.random() * 3) * sizeMultiplier
    const d = 5 * sizeMultiplier
    const geometry = new THREE.BoxGeometry(w, h, d)
    
    const material = new THREE.MeshStandardMaterial({
      color: colors[Math.round(Math.random())],
      roughness: 0.75,
      metalness: 0.5
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Initial positioning
    const pos = getRandomPositionalArgs(i, offset, sizeMultiplier)
    mesh.position.set(pos.position[0], pos.position[1], pos.position[2])
    mesh.scale.set(pos.scale[0], pos.scale[1], pos.scale[2])
    mesh.rotation.set(pos.rotation[0], pos.rotation[1], pos.rotation[2])

    scene.add(mesh)
    boxes.push({ mesh, material })
  }

  // Handle Resize
  window.addEventListener('resize', onWindowResize)

  // Start Animation Loop
  animate()

  // Start Shuffle Interval
  intervalId = window.setInterval(() => {
    shuffleBoxes(colors, offset, duration, sizeMultiplier)
  }, intervalTime)

  // Start progress timer
  timerId = window.setInterval(() => {
    progressStore.addStageTime(STAGE_NUMBER, 1) // Add 1 second
  }, 1000)
}

const getRandomPositionalArgs = (i: number, offset: number, sizeMultiplier: number) => {
  const r = Math.random()
  let zDepth = i * 1.5
  
  if (offset > 0) {
    zDepth = -10 - Math.random() * 50
  } else if (offset < 0) {
    zDepth = 10 + Math.random() * 40
  }

  // Adjust X/Y spread based on size so they don't cover the entire screen
  // If they are large, they need a smaller spread to stay within the camera view
  const spread = 80 / sizeMultiplier

  return {
    position: [spread - Math.random() * (spread * 2), spread - Math.random() * (spread * 2), zDepth],
    scale: [3 + r * 3, 3 + r * 3, 1],
    rotation: [0, 0, THREE.MathUtils.degToRad(Math.round(Math.random()) * 180)]
  }
}

const shuffleBoxes = (colors: THREE.Color[], offset: number, duration: number, sizeMultiplier: number) => {
  boxes.forEach((box, i) => {
    const pos = getRandomPositionalArgs(i, offset, sizeMultiplier)
    const targetColor = colors[Math.round(Math.random())]
    
    const delay = i * 0.04

    // Animate Position, Scale, Rotation
    gsap.to(box.mesh.position, {
      x: pos.position[0],
      y: pos.position[1],
      z: pos.position[2],
      duration: duration,
      delay,
      ease: "elastic.out(1, 0.7)"
    })

    gsap.to(box.mesh.scale, {
      x: pos.scale[0],
      y: pos.scale[1],
      z: pos.scale[2],
      duration: duration,
      delay,
      ease: "elastic.out(1, 0.7)"
    })

    gsap.to(box.mesh.rotation, {
      x: pos.rotation[0],
      y: pos.rotation[1],
      z: pos.rotation[2],
      duration: duration,
      delay,
      ease: "elastic.out(1, 0.7)"
    })

    // Animate Color
    gsap.to(box.material.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: duration,
      delay
    })
  })
}

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

onMounted(() => {
  initThree()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (intervalId) clearInterval(intervalId)
  if (timerId) clearInterval(timerId)
  if (animationId) cancelAnimationFrame(animationId)
  
  if (renderer && containerRef.value) {
    containerRef.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})
</script>

<style scoped>
.exercise-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.progress-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.85);
  padding: 8px 16px;
  font-size: 0.85rem;
  white-space: nowrap;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  z-index: 100;
  font-weight: bold;
  pointer-events: none;
}



.fallback-msg {
  color: white;
  padding: 24px;
  text-align: center;
  font-size: 1.2rem;
}

</style>