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

const STAGE_NUMBER = 1 // Boxes Exercise belongs to Stage 1
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)
const numBoxes = 1000
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
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 5, 20)
  camera.position.z = 15

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.55)
  pointLight.position.set(150, 150, 150)
  scene.add(pointLight)

  // Instanced Mesh
  const { alignmentOffset } = settingsStore
  const colors = [
    settingsStore.leftEyeColorStr,
    settingsStore.rightEyeColorStr
  ]

  const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7)
  const material = new THREE.MeshPhongMaterial({ vertexColors: true })
  instancedMesh = new THREE.InstancedMesh(geometry, material, numBoxes)

  const colorArray = new Float32Array(numBoxes * 3)
  for (let i = 0; i < numBoxes; i++) {
    const color = colors[Math.floor(Math.random() * 2)]
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

    instancedMesh.rotation.x = Math.sin(time / 4)
    instancedMesh.rotation.y = Math.sin(time / 2)

    const zBaseOffset = offset > 0 ? -Math.min(offset / 2, 10) : offset < 0 ? Math.min(Math.abs(offset) / 2, 5) : 0

    let i = 0
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        for (let z = 0; z < 10; z++) {
          tempObject.position.set(5 - x, 5 - y, 5 - z + zBaseOffset)
          tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
          tempObject.rotation.z = tempObject.rotation.y * 2
          tempObject.scale.set(1, 1, 1)
          tempObject.updateMatrix()
          instancedMesh.setMatrixAt(i, tempObject.matrix)
          i++
        }
      }
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
  overflow: hidden;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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