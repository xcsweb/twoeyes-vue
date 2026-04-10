<template>
  <div class="alignment-exercise-container">
    <div class="instructions text-center px-4 pt-6">
      <p class="text-h6 text-white mb-2">请戴上您的 3D 眼镜。</p>
      <p class="text-body-2 text-grey">
        使用屏幕上的箭头按钮或键盘方向键，移动其中一个十字准星，直到两个十字准星在您的视觉中完全重合（看起来像一个发光的白色十字）。
      </p>
    </div>

    <!-- Background overlay to prevent distractions -->
    <div class="bg-black-overlay"></div>

    <div class="canvas-area">
      <!-- Static Left Box (Target) -->
      <div
        class="box left-box"
        :style="{ backgroundColor: leftLenseRGBString }"
      >
        <div class="horizontal-line"></div>
        <div class="vertical-line"></div>
      </div>

      <!-- Draggable/Movable Right Box (Controller) -->
      <div
        class="box right-box alignment-exercise-interactive"
        :style="{
          backgroundColor: rightLenseRGBString,
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
        }"
        tabindex="0"
        @keydown="handleKeyDown"
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
      <div class="dpad">
        <button class="dpad-btn" @click.stop="moveBox(0, -1)">↑</button>
        <div class="dpad-row">
          <button class="dpad-btn" @click.stop="moveBox(-1, 0)">←</button>
          <button class="dpad-btn" @click.stop="moveBox(1, 0)">→</button>
        </div>
        <button class="dpad-btn" @click.stop="moveBox(0, 1)">↓</button>
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
import { useExamFlow } from '../../composables/useExamFlow'

const route = useRoute()
const settingsStore = useSettingsStore()
const { goNext } = useExamFlow()

const position = ref({ x: 0, y: 0 })
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
  }
}

const handlePointerUp = (e: PointerEvent) => {
  isDragging.value = false
  const target = e.currentTarget as HTMLElement
  target.releasePointerCapture(e.pointerId)
}

// Keyboard Events
const handleKeyDown = (e: KeyboardEvent) => {
  const step = 1
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
  }
}

const moveBox = (dx: number, dy: number) => {
  position.value.x += dx
  position.value.y += dy
}

const handleConfirm = () => {
  settingsStore.setAlignmentOffset({ x: position.value.x, y: position.value.y })
  goNext(route.name as string)
}
</script>

<style scoped>
.alignment-exercise-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: auto; /* changed from hidden to auto */
  padding-bottom: 100px; /* add padding to prevent bottom nav overlap */
  background-color: #000;
  touch-action: none; /* Prevent browser scrolling while dragging */
  display: flex;
  flex-direction: column;
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
  height: 4px;
  background-color: #000;
  transform: translateY(-50%);
  pointer-events: none;
}

.vertical-line {
  position: absolute;
  left: 50%;
  top: 10%;
  width: 4px;
  height: 80%;
  background-color: #000;
  transform: translateX(-50%);
  pointer-events: none;
}

.controls-overlay {
  position: relative;
  flex: 0 0 auto;
  padding-bottom: 40px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.dpad-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.confirm-button {
  border-radius: 12px;
  font-weight: bold;
}
</style>