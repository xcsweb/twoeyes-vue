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
let leftMesh: THREE.InstancedMesh
let rightMesh: THREE.InstancedMesh

const STAGE_NUMBER = 2 // Spiral Exercise belongs to Stage 2
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)

const numItemsPerEye = 300
const tempObject = new THREE.Object3D()

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
    settingsStore.leftEyeFinalColorStr,
    settingsStore.rightEyeFinalColorStr
  ]

  const geometry = new THREE.OctahedronGeometry(0.5, 0)
  const leftMaterial = new THREE.MeshPhongMaterial({ color: colors[0], blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
  const rightMaterial = new THREE.MeshPhongMaterial({ color: colors[1], blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
  
  leftMesh = new THREE.InstancedMesh(geometry, leftMaterial, numItemsPerEye)
  rightMesh = new THREE.InstancedMesh(geometry, rightMaterial, numItemsPerEye)

  scene.add(leftMesh)
  scene.add(rightMesh)

  const offset = alignmentOffset.x
  const clock = new THREE.Clock()

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const time = clock.getElapsedTime()

    const direction = offset < 0 ? -1 : 1
    const speed = 0.2 + Math.min(Math.abs(offset) / 100, 0.5)
    
    leftMesh.rotation.z = rightMesh.rotation.z = time * speed * direction

    const zBaseOffset = offset > 0 ? -Math.min(offset, 15) : offset < 0 ? Math.min(Math.abs(offset), 10) : 0

    // Compute pixel shift in world units at the mesh center
    const dist = camera.position.z - zBaseOffset
    const worldHeight = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const unitsPerPixel = worldHeight / window.innerHeight
    const shiftX = alignmentOffset.x * unitsPerPixel / 2
    const shiftY = alignmentOffset.y * unitsPerPixel / 2

    // Apply shifting directly to the parent meshes in world space (unaffected by local rotation)
    leftMesh.position.set(-shiftX, -shiftY, 0)
    rightMesh.position.set(shiftX, shiftY, 0)

    let leftIdx = 0
    let rightIdx = 0

    const totalItems = numItemsPerEye * 2
    for (let i = 0; i < totalItems; i++) {
      const angle = i * 0.5 + time * 0.5 * direction
      const radius = 0.5 + i * 0.05

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      const z = Math.sin(i * 0.1 - time * 2) * 2 + zBaseOffset

      tempObject.position.set(x, y, z)
      tempObject.rotation.z = angle
      tempObject.rotation.x = time + i * 0.1

      const scale = 0.2 + (i / totalItems) * 0.8
      tempObject.scale.set(scale, scale, scale)

      tempObject.updateMatrix()
      
      if (i % 2 === 0) {
        leftMesh.setMatrixAt(leftIdx++, tempObject.matrix)
      } else {
        rightMesh.setMatrixAt(rightIdx++, tempObject.matrix)
      }
    }
    
    leftMesh.instanceMatrix.needsUpdate = true
    rightMesh.instanceMatrix.needsUpdate = true

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
}

</style>