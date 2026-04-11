<template>
  <div class="alignment-exercise-container">
    <!-- Background overlay to prevent distractions -->
    <div class="bg-black-overlay"></div>
    <div class="reference-grid"></div>

    <div class="instructions text-center px-4 pt-6">
      <p class="text-h6 text-white mb-2">请戴上您的 3D 眼镜。</p>
      <p class="text-body-2 text-grey">
        使用屏幕上的箭头按钮、键盘方向键或触摸拖动，移动其中一个十字准星。使用旋转按钮或键盘 Q/E (左眼) 和 U/O (右眼) 键调整旋转角度，直到两个十字准星在您的视觉中完全重合（看起来像一个发光的白色十字）。
        <br/><br/>
        <strong class="text-orange">请先确保每个十字都与背景的白色参考线完全平行</strong>
      </p>
    </div>

    <!-- The actual test area where boxes move -->
    <div class="canvas-area d-flex align-center justify-center">
      <!-- Static Left Box (Target) -->
      <div
        class="box left-box"
        :style="{ 
          backgroundColor: leftLenseRGBString,
          transform: `translate(-50%, -50%) rotate(${position.rLeft}deg)`
        }"
      >
        <div class="horizontal-line"></div>
        <div class="vertical-line"></div>
      </div>

      <!-- Draggable/Movable Right Box (Controller) -->
      <div
        class="box right-box alignment-exercise-interactive"
        :style="{
          backgroundColor: rightLenseRGBString,
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
        <div class="horizontal-line"></div>
        <div class="vertical-line"></div>
      </div>
    </div>

    <!-- On-Screen Controls for Mobile -->
    <div class="controls-overlay alignment-exercise-interactive">
      <div class="controls-row">
        <!-- Left eye rotation -->
        <div class="rotate-controls">
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateLeftBox(-0.2))"
            @touchstart.prevent="startContinuous(() => rotateLeftBox(-0.2))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↺</button>
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateLeftBox(0.2))"
            @touchstart.prevent="startContinuous(() => rotateLeftBox(0.2))"
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
            @pointerdown.prevent="startContinuous(() => rotateRightBox(-0.2))"
            @touchstart.prevent="startContinuous(() => rotateRightBox(-0.2))"
            @pointerup="stopContinuous" 
            @pointerleave="stopContinuous" 
            @pointercancel="stopContinuous" 
            @contextmenu.prevent>↺</button>
          <button class="dpad-btn" 
            @pointerdown.prevent="startContinuous(() => rotateRightBox(0.2))"
            @touchstart.prevent="startContinuous(() => rotateRightBox(0.2))"
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
      position.value.y -= step
      e.preventDefault()
      break
    case 'ArrowDown':
      position.value.y += step
      e.preventDefault()
      break
    case 'ArrowLeft':
      position.value.x -= step
      e.preventDefault()
      break
    case 'ArrowRight':
      position.value.x += step
      e.preventDefault()
      break
    case 'q':
    case 'Q':
      position.value.rLeft -= step
      e.preventDefault()
      break
    case 'e':
    case 'E':
      position.value.rLeft += step
      e.preventDefault()
      break
    case 'u':
    case 'U':
      position.value.rRight -= step
      e.preventDefault()
      break
    case 'o':
    case 'O':
      position.value.rRight += step
      e.preventDefault()
      break
  }
}

const handleKeyUp = () => {
  applyMagneticSnap()
}

const applyMagneticSnap = () => {
  if (Math.abs(position.value.x) <= 1.5) position.value.x = 0
  if (Math.abs(position.value.y) <= 1.5) position.value.y = 0
  if (Math.abs(position.value.rLeft) <= 0.4) position.value.rLeft = 0
  if (Math.abs(position.value.rRight) <= 0.4) position.value.rRight = 0
}

const moveBox = (dx: number, dy: number) => {
  position.value.x += dx
  position.value.y += dy
}

const rotateLeftBox = (dr: number) => {
  position.value.rLeft += dr
}

const rotateRightBox = (dr: number) => {
  position.value.rRight += dr
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
  /* Using a single vertical and horizontal line intersecting at center */
  background-image: 
    linear-gradient(to right, transparent calc(50% - 1px), rgba(255,255,255,0.3) calc(50% - 1px), rgba(255,255,255,0.3) calc(50% + 1px), transparent calc(50% + 1px)),
    linear-gradient(to bottom, transparent calc(50% - 1px), rgba(255,255,255,0.3) calc(50% - 1px), rgba(255,255,255,0.3) calc(50% + 1px), transparent calc(50% + 1px));
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
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.horizontal-line {
  position: absolute;
  top: 50%;
  left: 10%;
  width: 80%;
  height: 2px;
  background-color: #000;
  transform: translateY(-50%);
  pointer-events: none;
}

.vertical-line {
  position: absolute;
  left: 50%;
  top: 10%;
  width: 2px;
  height: 80%;
  background-color: #000;
  transform: translateX(-50%);
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
