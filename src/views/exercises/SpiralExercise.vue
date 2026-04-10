<template>
  <div class="exercise-container" ref="containerRef">
    <div v-if="!isWebGLAvailable" class="fallback-msg">
      当前环境无法创建 WebGL 渲染上下文，已自动切换为兼容模式。请使用支持 WebGL 的浏览器继续训练。
    </div>
    <div class="progress-hud">
      <span :class="{ 'text-success': stageTime >= 60, 'text-white': stageTime < 60 }">
        本阶段累计训练: {{ stageTime }} / 60 秒
        <span v-if="stageTime >= 60" class="ml-2">✓ 已达标，下一阶段已解锁</span>
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

const STAGE_NUMBER = 2 // Spiral Exercise belongs to Stage 2
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)
const numItems = 600
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
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 35

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 0, 20)
  scene.add(pointLight)

  // Instanced Mesh
  const { alignmentOffset } = settingsStore
  const colors = [
    settingsStore.leftEyeColorStr,
    settingsStore.rightEyeColorStr
  ]

  const geometry = new THREE.OctahedronGeometry(0.5, 0)
  const material = new THREE.MeshPhongMaterial({ vertexColors: true })
  instancedMesh = new THREE.InstancedMesh(geometry, material, numItems)

  const colorArray = new Float32Array(numItems * 3)
  for (let i = 0; i < numItems; i++) {
    const color = colors[i % 2 === 0 ? 0 : 1]
    tempColor.set(color)
    tempColor.toArray(colorArray, i * 3)
  }
  geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3))
  scene.add(instancedMesh)

  const offset = alignmentOffset.x
  const clock = new THREE.Clock()

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const time = clock.getElapsedTime()

    const direction = offset < 0 ? -1 : 1
    const speed = 0.2 + Math.min(Math.abs(offset) / 100, 0.5)
    instancedMesh.rotation.z = time * speed * direction

    for (let i = 0; i < numItems; i++) {
      const angle = i * 0.5 + time * 0.5 * direction
      const radius = 0.5 + i * 0.05

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      const zBaseOffset = offset > 0 ? -Math.min(offset, 15) : offset < 0 ? Math.min(Math.abs(offset), 10) : 0
      const z = Math.sin(i * 0.1 - time * 2) * 2 + zBaseOffset

      tempObject.position.set(x, y, z)
      tempObject.rotation.z = angle
      tempObject.rotation.x = time + i * 0.1

      const scale = 0.2 + (i / numItems) * 0.8
      tempObject.scale.set(scale, scale, scale)

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
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
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