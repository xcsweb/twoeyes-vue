<template>
  <div class="alignment-exercise-container">
    <!-- Background overlay to prevent distractions -->
    <div class="bg-black-overlay"></div>
    <div class="reference-grid"></div>

    <div class="instructions text-center px-4 pt-6">
      <div class="d-flex align-center justify-center mb-2">
        <p class="text-h6 text-white mb-0">请戴上您的 3D 眼镜。</p>
      </div>
      <div class="text-body-2 text-grey text-left d-inline-block">
        <div class="mb-2"><strong>第 1 步 (测水平/垂直偏移距离)：</strong>使用屏幕上的箭头按钮、键盘方向键或触摸拖动，移动横线，直到两条线在您的视觉中完全重合并形成一个<strong>完美的十字（+）</strong>。</div>
        <div><strong>第 2 步 (测旋转偏角)：</strong>使用旋转按钮或键盘 Q/E (左眼) 和 U/O (右眼) 键调整旋转角度，<strong class="text-orange">请确保每一条线都与背景的参考线完全平行或垂直。</strong></div>
      </div>
    </div>

    <!-- The actual test area where boxes move -->
    <div class="canvas-area d-flex align-center justify-center">
      <!-- Static Left Box (Target) -->
      <div
        class="box left-box"
        :style="{ 
          transform: `translate(-50%, -50%) rotate(${position.rLeft}deg)`
        }"
      >
        <div class="vertical-line" :style="{ backgroundColor: leftLenseRGBString }"></div>
        <div class="center-dot" :style="{ backgroundColor: rightLenseRGBString }"></div>
      </div>

      <!-- Draggable/Movable Right Box (Controller) -->
      <div
        class="box right-box alignment-exercise-interactive"
        :style="{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${position.rRight}deg)`
        }"
        tabindex="0"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
      >
        <div class="horizontal-line" :style="{ backgroundColor: rightLenseRGBString }"></div>
        <div class="center-dot" :style="{ backgroundColor: leftLenseRGBString }"></div>
      </div>
    </div>

    <!-- On-Screen Controls for Mobile -->
    <div class="controls-overlay alignment-exercise-interactive">
      <div class="controls-row">
        <!-- Left eye rotation -->
        <div class="rotate-controls">
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateLeftBox(-0.1))"
            @touchstart.prevent="startContinuous(() => rotateLeftBox(-0.1))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↺</button>
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateLeftBox(0.1))"
            @touchstart.prevent="startContinuous(() => rotateLeftBox(0.1))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↻</button>
        </div>

        <!-- Center D-pad -->
        <div class="dpad">
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => moveBox(0, -0.5))"
            @touchstart.prevent="startContinuous(() => moveBox(0, -0.5))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↑</button>
          <div class="dpad-row">
            <button class="dpad-btn" 
              @pointerdown.prevent="startContinuous(() => moveBox(-0.5, 0))"
              @touchstart.prevent="startContinuous(() => moveBox(-0.5, 0))"
              @pointerup="stopContinuous" 
              @pointerleave="stopContinuous" 
              @pointercancel="stopContinuous" 
              @contextmenu.prevent>←</button>
            <button class="dpad-btn" 
              @pointerdown.prevent="startContinuous(() => moveBox(0.5, 0))"
              @touchstart.prevent="startContinuous(() => moveBox(0.5, 0))"
              @pointerup="stopContinuous" 
              @pointerleave="stopContinuous" 
              @pointercancel="stopContinuous" 
              @contextmenu.prevent>→</button>
          </div>
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => moveBox(0, 0.5))"
            @touchstart.prevent="startContinuous(() => moveBox(0, 0.5))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↓</button>
        </div>

        <!-- Right eye rotation -->
        <div class="rotate-controls">
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateRightBox(-0.1))"
            @touchstart.prevent="startContinuous(() => rotateRightBox(-0.1))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↺</button>
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateRightBox(0.1))"
            @touchstart.prevent="startContinuous(() => rotateRightBox(0.1))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↻</button>
        </div>
      </div>
      
      <v-btn
        color="primary"
        class="confirm-button mt-6"
        size="x-large"
        @click.stop="handleConfirm"
      >
        确认对齐
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '../../store/settings'
import { useFlowManager } from '../../composables/useFlowManager'

const route = useRoute()
const settingsStore = useSettingsStore()
const { goNext } = useFlowManager()

const getRandomOffset = () => {
  const sign = Math.random() > 0.5 ? 1 : -1
  // Random offset between 30px and 80px to ensure it's clearly separated but not too far off screen
  return sign * (Math.floor(Math.random() * 50) + 30)
}

const position = ref({ 
  x: getRandomOffset(), 
  y: getRandomOffset(),
  rLeft: Math.floor(Math.random() * 31) - 15,
  rRight: Math.floor(Math.random() * 31) - 15
})
const isDragging = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })

const leftLense = settingsStore.leftLense
const rightLense = settingsStore.rightLense

const leftLenseRGBString = computed(() => `rgb(${leftLense.r}, ${leftLense.g}, ${leftLense.b})`)
const rightLenseRGBString = computed(() => `rgb(${rightLense.r}, ${rightLense.g}, ${rightLense.b})`)

// Pointer Events for Dragging
const handlePointerDown = (e: PointerEvent) => {
  isDragging.value = true
  const target = e.currentTarget as HTMLElement
  target.setPointerCapture(e.pointerId)
  dragStartPos.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  }
}

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  position.value = {
    x: e.clientX - dragStartPos.value.x,
    y: e.clientY - dragStartPos.value.y,
    rLeft: position.value.rLeft,
    rRight: position.value.rRight
  }
}

const handlePointerUp = (e: PointerEvent) => {
  isDragging.value = false
  const target = e.currentTarget as HTMLElement
  target.releasePointerCapture(e.pointerId)
  applyMagneticSnap()
}

// Keyboard Events
const handleKeyDown = (e: KeyboardEvent) => {
  const step = 0.5
  switch (e.key) {
    case 'ArrowUp':
      moveBox(0, -step)
      e.preventDefault()
      break
    case 'ArrowDown':
      moveBox(0, step)
      e.preventDefault()
      break
    case 'ArrowLeft':
      moveBox(-step, 0)
      e.preventDefault()
      break
    case 'ArrowRight':
      moveBox(step, 0)
      e.preventDefault()
      break
    case 'q':
    case 'Q':
      rotateLeftBox(-0.1)
      e.preventDefault()
      break
    case 'e':
    case 'E':
      rotateLeftBox(0.1)
      e.preventDefault()
      break
    case 'u':
    case 'U':
      rotateRightBox(-0.1)
      e.preventDefault()
      break
    case 'o':
    case 'O':
      rotateRightBox(0.1)
      e.preventDefault()
      break
  }
}

const handleKeyUp = () => {
  applyMagneticSnap()
}

const applyMagneticSnap = () => {
  // Check translation
  if (Math.abs(position.value.x) <= 1.5) position.value.x = 0
  if (Math.abs(position.value.y) <= 1.5) position.value.y = 0
  // Check rotation
  if (Math.abs(position.value.rLeft) <= 0.2) position.value.rLeft = 0
  if (Math.abs(position.value.rRight) <= 0.2) position.value.rRight = 0
}

const moveBox = (dx: number, dy: number) => {
  // If it was magnetically snapped to 0, pressing a key should break it out of the snap
  if (position.value.x === 0 && dx !== 0) {
    position.value.x = dx > 0 ? 1.6 : -1.6
  } else {
    position.value.x += dx
  }
  
  if (position.value.y === 0 && dy !== 0) {
    position.value.y = dy > 0 ? 1.6 : -1.6
  } else {
    position.value.y += dy
  }
}

const rotateLeftBox = (dr: number) => {
  if (position.value.rLeft === 0 && dr !== 0) {
    position.value.rLeft = dr > 0 ? 0.25 : -0.25
  } else {
    position.value.rLeft += dr
  }
}

const rotateRightBox = (dr: number) => {
  if (position.value.rRight === 0 && dr !== 0) {
    position.value.rRight = dr > 0 ? 0.25 : -0.25
  } else {
    position.value.rRight += dr
  }
}

let timeoutId: number | undefined
let intervalId: number | undefined

const stopContinuous = () => {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
    timeoutId = undefined
  }
  if (intervalId) {
    window.clearInterval(intervalId)
    intervalId = undefined
  }
  applyMagneticSnap()
}

const startContinuous = (action: () => void) => {
  stopContinuous()
  action()
  timeoutId = window.setTimeout(() => {
    intervalId = window.setInterval(action, 50)
  }, 300)
}

const handleConfirm = () => {
  settingsStore.setAlignmentOffset({ 
    x: position.value.x, 
    y: position.value.y, 
    rLeft: position.value.rLeft, 
    rRight: position.value.rRight 
  })
  goNext(route.name as string)
}
</script>

<style scoped>
.alignment-exercise-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  overflow: auto;
  padding-bottom: 100px; /* prevent bottom nav overlap */
  display: flex;
  flex-direction: column;
  touch-action: none; /* Prevent browser scrolling while dragging */
  z-index: 1;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.bg-black-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 0;
}

.reference-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Offset the reference lines so they don't perfectly overlap with the target cross when centered */
  background-image: 
    linear-gradient(to right, transparent calc(40% - 1px), rgba(255, 60, 60, 0.45) calc(40% - 1px), rgba(255, 60, 60, 0.45) calc(40% + 1px), transparent calc(40% + 1px)),
    linear-gradient(to bottom, transparent calc(30% - 1px), rgba(60, 200, 255, 0.45) calc(30% - 1px), rgba(60, 200, 255, 0.45) calc(30% + 1px), transparent calc(30% + 1px));
  z-index: 10; /* Bring it above the canvas area so it's not hidden by the colored boxes */
  pointer-events: none;
}

.instructions {
  position: relative;
  z-index: 10;
  max-width: 600px;
  margin: 0 auto;
  flex: 0 0 auto;
}

.canvas-area {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  min-height: 250px;
  z-index: 1;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: screen;
}

.left-box {
  z-index: 1;
  pointer-events: none;
}

.right-box {
  z-index: 2;
  cursor: pointer;
  outline: none;
}

.right-box:focus {
  outline: none;
}

.horizontal-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  transform: translateY(-50%);
  pointer-events: none;
}

.vertical-line {
  position: absolute;
  left: 50%;
  top: 0;
  width: 4px;
  height: 100%;
  transform: translateX(-50%);
  pointer-events: none;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.controls-overlay {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding-bottom: 40px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.dpad-row {
  display: flex;
  gap: 40px;
}

.rotate-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dpad-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  cursor: pointer;
  transition: background-color 0.2s;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  user-drag: none;
  -webkit-user-drag: none;
}

.dpad-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.confirm-button {
  border-radius: 12px;
  font-weight: bold;
}

</style>
