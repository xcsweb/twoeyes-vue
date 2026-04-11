<template>
  <div class="cosmic-bg-container">
    <div class="tiles-grid-wrapper">
      <!-- Grid of 16 tiles -->
      <div class="tiles-grid">
        <template v-for="r in 4" :key="'r'+r">
          <img 
            v-for="c in 4" 
            :key="'c'+c" 
            class="bg-tile fade-in"
            :src="getTileUrl(r - 1, c - 1)" 
            alt="space tile" 
          />
        </template>
      </div>
    </div>
    
    <!-- Porthole Vignette Overlay -->
    <div class="porthole-overlay"></div>
  </div>
</template>

<script setup lang="ts">
// Import all background tiles eagerly or dynamically. We use dynamic paths with Vite helper
const tilesImages = import.meta.glob('../assets/images/bg_tiles/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

const getTileUrl = (r: number, c: number) => {
  const path = `../assets/images/bg_tiles/bg_tile_${r}_${c}.webp`
  return tilesImages[path] || ''
}
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

.tiles-grid-wrapper {
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
}

.tiles-grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.bg-tile {
  width: 100%;
  height: 100%;
  display: block;
  /* The wrapper guarantees perfect 16:9, so fill is safe and avoids gaps */
  object-fit: fill; 
}

/* Subtle fade in for tiles */
.fade-in {
  animation: fadeInTile 1.5s ease-in-out forwards;
}

@keyframes fadeInTile {
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