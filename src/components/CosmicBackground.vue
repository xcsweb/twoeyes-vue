<template>
  <div class="cosmic-bg-container">
    <!-- Use Canvas to completely bypass CSS sub-pixel rendering gaps -->
    <canvas ref="bgCanvas" width="1920" height="1080" class="bg-canvas fade-in"></canvas>
    
    <!-- Porthole Vignette Overlay -->
    <div class="porthole-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const bgCanvas = ref<HTMLCanvasElement | null>(null)

// Import all background tiles dynamically
const tilesImages = import.meta.glob('../assets/images/bg_tiles/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

onMounted(() => {
  const canvas = bgCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Original image was 1920x1080, sliced into 4x4 grid
  const tileW = 480
  const tileH = 270

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const path = `../assets/images/bg_tiles/bg_tile_${r}_${c}.webp`
      const url = tilesImages[path]
      if (url) {
        const img = new Image()
        img.src = url
        img.onload = () => {
          // Draw exactly at integer pixel coordinates, preventing any sub-pixel gaps
          ctx.drawImage(img, c * tileW, r * tileH, tileW, tileH)
        }
      }
    }
  }
})
</script>

<style scoped>
.cosmic-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background-color: #000;
}

.bg-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Maintain 16:9 aspect ratio (1080/1920 = 56.25%) */
  width: 100vw;
  height: 56.25vw;
  /* Fallbacks for tall screens */
  min-height: 100vh;
  min-width: 177.78vh;
  transform: translate(-50%, -50%);
  object-fit: fill;
  display: block;
}

/* Subtle fade in for the whole canvas */
.fade-in {
  animation: fadeInCanvas 1.5s ease-in-out forwards;
}

@keyframes fadeInCanvas {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Porthole Vignette Effect */
.porthole-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Simulates looking out of a spaceship window */
  background: radial-gradient(
    circle at center, 
    transparent 20%, 
    rgba(0, 0, 0, 0.4) 60%, 
    rgba(0, 0, 0, 0.95) 90%, 
    #000 100%
  );
  box-shadow: inset 0 0 100px 50px #000;
}
</style>