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

const STAGE_NUMBER = 1 // Boxes Exercise belongs to Stage 1
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)

const numBoxesPerEye = 500
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
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 5, 20)
  camera.position.z = 15

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Instanced Mesh
  const { alignmentOffset } = settingsStore
  const colors = [
    settingsStore.leftEyeColorStr,
    settingsStore.rightEyeColorStr
  ]

  const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
  const leftMaterial = new THREE.MeshStandardMaterial({ color: colors[0], blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
  const rightMaterial = new THREE.MeshStandardMaterial({ color: colors[1], blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
  
  leftMesh = new THREE.InstancedMesh(geometry, leftMaterial, numBoxesPerEye)
  rightMesh = new THREE.InstancedMesh(geometry, rightMaterial, numBoxesPerEye)
  
  scene.add(leftMesh)
  scene.add(rightMesh)

  const offset = alignmentOffset.x
  const clock = new THREE.Clock()

  const leftCoords: any[] = []
  const rightCoords: any[] = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      for (let z = 0; z < 10; z++) {
        if (Math.random() > 0.5 && leftCoords.length < 500) {
          leftCoords.push({x, y, z})
        } else if (rightCoords.length < 500) {
          rightCoords.push({x, y, z})
        } else {
          leftCoords.push({x, y, z})
        }
      }
    }
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const time = clock.getElapsedTime()

    leftMesh.rotation.x = rightMesh.rotation.x = Math.sin(time / 4)
    leftMesh.rotation.y = rightMesh.rotation.y = Math.sin(time / 2)

    const zBaseOffset = offset > 0 ? -Math.min(offset / 2, 10) : offset < 0 ? Math.min(Math.abs(offset) / 2, 5) : 0

    // Compute pixel shift in world units at the mesh center (zBaseOffset)
    const dist = camera.position.z - zBaseOffset
    const worldHeight = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const unitsPerPixel = worldHeight / window.innerHeight
    const shiftX = alignmentOffset.x * unitsPerPixel / 2
    const shiftY = alignmentOffset.y * unitsPerPixel / 2

    // Apply shifting directly to the parent meshes in world space (unaffected by local rotation)
    leftMesh.position.set(-shiftX, -shiftY, 0)
    rightMesh.position.set(shiftX, shiftY, 0)

    for (let i = 0; i < 500; i++) {
      // Left
      let coord = leftCoords[i]
      if (coord) {
        tempObject.position.set(5 - coord.x, 5 - coord.y, 5 - coord.z + zBaseOffset)
        tempObject.rotation.y = Math.sin(coord.x / 4 + time) + Math.sin(coord.y / 4 + time) + Math.sin(coord.z / 4 + time)
        tempObject.rotation.z = tempObject.rotation.y * 2
        tempObject.scale.set(1, 1, 1)
        tempObject.updateMatrix()
        leftMesh.setMatrixAt(i, tempObject.matrix)
      }
      
      // Right
      coord = rightCoords[i]
      if (coord) {
        tempObject.position.set(5 - coord.x, 5 - coord.y, 5 - coord.z + zBaseOffset)
        tempObject.rotation.y = Math.sin(coord.x / 4 + time) + Math.sin(coord.y / 4 + time) + Math.sin(coord.z / 4 + time)
        tempObject.rotation.z = tempObject.rotation.y * 2
        tempObject.scale.set(1, 1, 1)
        tempObject.updateMatrix()
        rightMesh.setMatrixAt(i, tempObject.matrix)
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