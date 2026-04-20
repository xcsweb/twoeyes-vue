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

        <div class="instruction-overlay">
      <p class="text-body-1">
        盯着移动的白球，保持球只有一个不重影。
        <br/><br/>
        <span class="text-info">{{ instructionText }}</span>
      </p>
    </div>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

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
let ballGroup: THREE.Group

const STAGE_NUMBER = 3 // Brock String Exercise belongs to Stage 3
const { formattedTime, isTargetReached, showCompletionDialog, returnToMenu } = useStageTimer(STAGE_NUMBER)


const instructionText = computed(() => {
  const offset = settingsStore.alignmentOffset.x
  if (offset < -5) return "检测到内隐斜：请在球远离时着重练习『双眼视线发散』的能力"
  if (offset > 5) return "检测到外隐斜：请在球靠近时着重练习『双眼视线汇聚』的能力（斗鸡眼）"
  return "当球靠近时努力把眼睛“斗”起来（集合），远离时放松（分开）"
})

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
  camera.position.set(0, 0, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 2)
  pointLight.position.set(0, 5, 5)
  scene.add(pointLight)

  const { alignmentOffset } = settingsStore
  const leftColorStr = settingsStore.leftEyeFinalColorStr
  const rightColorStr = settingsStore.rightEyeFinalColorStr

  const IOD_FACTOR = 0.08
  const startZ = 4;
  const endZ = -40;

  // Moving Ball (Dichoptic) - Using Physical 3D Material
  ballGroup = new THREE.Group()
  const sphereGeo = new THREE.SphereGeometry(1, 32, 32)
  
  const leftBallMat = new THREE.MeshStandardMaterial({ 
    color: leftColorStr, 
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    roughness: 0.2,
    metalness: 0.1
  })
  const leftBallMesh = new THREE.Mesh(sphereGeo, leftBallMat)
  leftBallMesh.name = 'leftBall'
  
  const rightBallMat = new THREE.MeshStandardMaterial({ 
    color: rightColorStr, 
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    roughness: 0.2,
    metalness: 0.1
  })
  const rightBallMesh = new THREE.Mesh(sphereGeo, rightBallMat)
  rightBallMesh.name = 'rightBall'

  ballGroup.add(leftBallMesh)
  ballGroup.add(rightBallMesh)
  scene.add(ballGroup)

  const offset = alignmentOffset.x
  const baseSpeed = 1.0 + Math.min(Math.abs(offset) / 50, 1.0)
  const isEsophoria = offset < -5
  const isExophoria = offset > 5
  const clock = new THREE.Clock()
  let timeRef = 0

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    
    timeRef += delta * baseSpeed
      
    let minZ = -20;
    let maxZ = 3;
    if (isEsophoria) {
      minZ = -30; // Push further away for esophoria (train divergence)
      maxZ = 0;
    } else if (isExophoria) {
      minZ = -10;
      maxZ = 4;   // Pull closer for exophoria (train convergence)
    }
    
    const normalized = (Math.sin(timeRef) + 1) / 2
    const zPosition = minZ + normalized * (maxZ - minZ)

    ballGroup.position.z = zPosition

    // Dynamically adjust horizontal separation based on depth (Parallax)
    // Interpolate Y position so it moves naturally
    const t = (zPosition - startZ) / (endZ - startZ);
    const yPos = -1.5 + t * (1.5 - (-1.5));

    const dist = camera.position.z - zPosition
    const worldHeight = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const unitsPerPixel = worldHeight / window.innerHeight
    const shiftX = alignmentOffset.x * unitsPerPixel / 2
    const shiftY = alignmentOffset.y * unitsPerPixel / 2

    const leftBall = ballGroup.getObjectByName('leftBall')
    const rightBall = ballGroup.getObjectByName('rightBall')
    if (leftBall && rightBall) {
      leftBall.position.set(IOD_FACTOR * zPosition - shiftX, yPos - shiftY, 0)
      rightBall.position.set(-IOD_FACTOR * zPosition + shiftX, yPos + shiftY, 0)
    }

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.instruction-overlay {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  text-align: center;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  padding: 16px 24px;
  border-radius: 12px;
  pointer-events: none;
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