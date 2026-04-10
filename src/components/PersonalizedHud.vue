<template>
  <div 
    class="personalized-hud-wrapper"
    :style="dragStyle"
    @mousedown="startDrag"
    @touchstart.passive="startDragTouch"
  >
    <div v-if="isCollapsed" class="hud-collapsed" @click.stop="toggleCollapse">
      <div class="hud-icon">
        ⚙️
      </div>
    </div>
    <div v-else class="hud-expanded" @click.stop="toggleCollapse">
      {{ settingsStore.personalizedHUDText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useSettingsStore } from '../store/settings'

const settingsStore = useSettingsStore()

const isCollapsed = ref(false)

const position = ref({ x: 20, y: 60 }) // Initial position, matching original CSS
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })

const dragStyle = computed(() => {
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    cursor: isCollapsed.value ? (isDragging.value ? 'grabbing' : 'grab') : 'pointer'
  }
})

let dragStartPos = { x: 0, y: 0 }

const toggleCollapse = () => {
  // Only toggle if we didn't just drag significantly
  if (!isDragging.value) {
    isCollapsed.value = !isCollapsed.value
  }
}

// Drag logic
const startDrag = (e: MouseEvent) => {
  if (!isCollapsed.value) return
  isDragging.value = false
  dragStartPos = { x: e.clientX, y: e.clientY }
  startPos.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isCollapsed.value) return
  
  // Mark as dragging if moved more than 5px
  if (Math.abs(e.clientX - dragStartPos.x) > 5 || Math.abs(e.clientY - dragStartPos.y) > 5) {
    isDragging.value = true
  }
  
  if (!isDragging.value) return

  let newX = e.clientX - startPos.value.x
  let newY = e.clientY - startPos.value.y
  
  // Boundary check
  newX = Math.max(0, Math.min(newX, window.innerWidth - 40))
  newY = Math.max(0, Math.min(newY, window.innerHeight - 40))
  
  position.value = { x: newX, y: newY }
}

const stopDrag = () => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  setTimeout(() => {
    isDragging.value = false
  }, 0)
}

const startDragTouch = (e: TouchEvent) => {
  if (!isCollapsed.value) return
  isDragging.value = false
  dragStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  startPos.value = {
    x: e.touches[0].clientX - position.value.x,
    y: e.touches[0].clientY - position.value.y
  }
  document.addEventListener('touchmove', onDragTouch, { passive: false })
  document.addEventListener('touchend', stopDragTouch)
}

const onDragTouch = (e: TouchEvent) => {
  if (!isCollapsed.value) return
  
  if (Math.abs(e.touches[0].clientX - dragStartPos.x) > 5 || Math.abs(e.touches[0].clientY - dragStartPos.y) > 5) {
    isDragging.value = true
  }
  
  if (!isDragging.value) return
  
  e.preventDefault() // prevent scrolling
  
  let newX = e.touches[0].clientX - startPos.value.x
  let newY = e.touches[0].clientY - startPos.value.y
  
  // Boundary check
  newX = Math.max(0, Math.min(newX, window.innerWidth - 40))
  newY = Math.max(0, Math.min(newY, window.innerHeight - 40))
  
  position.value = { x: newX, y: newY }
}

const stopDragTouch = () => {
  document.removeEventListener('touchmove', onDragTouch)
  document.removeEventListener('touchend', stopDragTouch)
  setTimeout(() => {
    isDragging.value = false
  }, 0)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDragTouch)
  document.removeEventListener('touchend', stopDragTouch)
})
</script>

<style scoped>
.personalized-hud-wrapper {
  position: absolute;
  z-index: 1000;
  user-select: none;
  touch-action: none;
}

.hud-collapsed {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.hud-collapsed:hover {
  transform: scale(1.1);
}

.hud-icon {
  font-size: 1.2rem;
}

.hud-expanded {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
