<template>
  <div class="exercise-container" ref="containerRef">
    <div v-if="!isWebGLAvailable" class="fallback-msg">
      当前环境无法创建 WebGL 渲染上下文，已自动切换为兼容模式。请使用支持 WebGL 的浏览器继续训练。
    </div>
    <div class="progress-hud">
      <span :class="{ 'text-success': stageTime >= 60, 'text-white': stageTime < 60 }">
        本阶段今日训练: {{ stageTime }} / 60 秒
        <span v-if="stageTime >= 60" class="ml-2">✓ 今日训练已达标</span>
      </span>
    </div>
      </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import * as THREE from 'three'
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
let timerId: number
let instancedMesh: THREE.InstancedMesh

const STAGE_NUMBER = 2 // Particles Exercise belongs to Stage 2
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)
const numParticles = 1000
const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

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

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 30

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Instanced Mesh
  const { alignmentOffset } = settingsStore
  const colors = [
    settingsStore.leftEyeColorStr,
    settingsStore.rightEyeColorStr
  ]

  const particles = new Array(numParticles).fill(null).map((_, i) => ({
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40,
    z: (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    vz: (Math.random() - 0.5) * 0.1,
    color: colors[i % 2 === 0 ? 0 : 1],
    scale: Math.random() * 0.5 + 0.2,
  }))

  const geometry = new THREE.CircleGeometry(0.5, 32)
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
  instancedMesh = new THREE.InstancedMesh(geometry, material, numParticles)

  const colorArray = new Float32Array(numParticles * 3)
  for (let i = 0; i < numParticles; i++) {
    tempColor.set(particles[i].color)
    tempColor.toArray(colorArray, i * 3)
  }
  geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3))
  scene.add(instancedMesh)

  const offset = alignmentOffset.x
  const clock = new THREE.Clock()

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const time = clock.getElapsedTime()

    for (let i = 0; i < numParticles; i++) {
      const p = particles[i]

      const zDirection = offset < 0 ? 1 : offset > 0 ? -1 : 0
      const speedMultiplier = 1 + Math.min(Math.abs(offset) / 50, 2)

      p.x += p.vx + Math.sin(time * 0.5 + p.y * 0.1) * 0.05 * speedMultiplier
      p.y += p.vy + Math.cos(time * 0.5 + p.x * 0.1) * 0.05 * speedMultiplier
      
      if (zDirection !== 0) {
        p.z += zDirection * (0.05 + Math.abs(p.vz)) * speedMultiplier
      } else {
        p.z += p.vz
      }

      if (p.x > 20) p.x = -20
      if (p.x < -20) p.x = 20
      if (p.y > 20) p.y = -20
      if (p.y < -20) p.y = 20
      if (p.z > 20) p.z = -20
      if (p.z < -20) p.z = 20

      tempObject.position.set(p.x, p.y, p.z)

      const breath = Math.sin(time * 2 + i) * 0.2 + 1
      const s = p.scale * breath
      tempObject.scale.set(s, s, s)

      tempObject.lookAt(0, 0, 50)

      tempObject.updateMatrix()
      instancedMesh.setMatrixAt(i, tempObject.matrix)
    }
    instancedMesh.instanceMatrix.needsUpdate = true

    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', onWindowResize)

  timerId = window.setInterval(() => {
    progressStore.addStageTime(STAGE_NUMBER, 1)
  }, 1000)
}

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

onMounted(() => {
  initThree()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
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
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
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
}
</style>