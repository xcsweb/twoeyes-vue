<template>
  <div
    class="exercise-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="progress-hud">
      <span :class="{ 'text-success': stageTime >= 60, 'text-white': stageTime < 60 }">
        本阶段累计训练: {{ stageTime }} / 60 秒
        <span v-if="stageTime >= 60" class="ml-2">✓ 已达标</span>
      </span>
    </div>

        <h2 class="score">得分: {{ score }}</h2>
    
    <div class="tetris-board">
      <div
        v-for="(row, r) in renderBoard"
        :key="r"
        class="tetris-row"
      >
        <div
          v-for="(cell, c) in row"
          :key="`${r}-${c}`"
          class="tetris-cell"
          :style="{ backgroundColor: cell ? cell.color : 'transparent' }"
        ></div>
      </div>
    </div>

    <div class="controls-overlay">
      <div class="dpad-row">
        <button class="dpad-btn" @click.stop="moveLeft">←</button>
        <button class="dpad-btn" @click.stop="dropPiece">↓</button>
        <button class="dpad-btn" @click.stop="moveRight">→</button>
        <button class="dpad-btn rotate-btn" @click.stop="rotatePiece">↻</button>
      </div>
    </div>

    <div v-if="gameOver" class="game-over-overlay">
      <h2 class="mb-6">游戏结束</h2>
      <v-btn color="primary" size="x-large" @click="resetGame">重新开始</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { useSettingsStore } from '../../store/settings'
import { useProgressStore } from '../../store/progress'

const settingsStore = useSettingsStore()
const progressStore = useProgressStore()

const STAGE_NUMBER = 4 // Tetris Exercise belongs to Stage 4
const stageTime = computed(() => progressStore.stages[STAGE_NUMBER]?.totalTime || 0)

const ROWS = 30
const COLS = 15
const TETROMINOES = [
  [[1, 1, 1, 1]],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
]

type Block = { color: string } | null
type Board = Block[][]
type Piece = {
  shape: number[][]
  x: number
  y: number
  color: string
}

const leftColor = computed(() => settingsStore.leftEyeColorStr)
const rightColor = computed(() => settingsStore.rightEyeColorStr)

const board = ref<Board>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)))
const currentPiece = ref<Piece | null>(null)
const gameOver = ref(false)
const score = ref(0)
const isPaused = ref(false)

let requestRef: number
let lastUpdateRef = 0
let timerId: number
const dropTime = 1000

// Touch gestures
let touchStartX = 0
let touchStartY = 0

const createPiece = (): Piece => {
  const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
  return {
    shape,
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
    color: leftColor.value, // Moving pieces are seen by left eye
  }
}

const resetGame = () => {
  board.value = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  currentPiece.value = createPiece()
  gameOver.value = false
  score.value = 0
  isPaused.value = false
}

const checkCollision = (piece: Piece, testX: number, testY: number) => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const newX = testX + c
        const newY = testY + r
        if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board.value[newY][newX])) {
          return true
        }
      }
    }
  }
  return false
}

const moveDown = () => {
  if (!currentPiece.value || gameOver.value || isPaused.value) return
  if (!checkCollision(currentPiece.value, currentPiece.value.x, currentPiece.value.y + 1)) {
    currentPiece.value.y += 1
  } else {
    if (currentPiece.value.y <= 0) {
      gameOver.value = true
      return
    }
    // Merge to board (Static pieces seen by right eye)
    const newBoard = board.value.map(row => [...row])
    currentPiece.value.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const py = currentPiece.value!.y + r
          const px = currentPiece.value!.x + c
          if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
            newBoard[py][px] = { color: rightColor.value }
          }
        }
      })
    })

    // Clear lines
    let linesCleared = 0
    const finalBoard = newBoard.filter(row => {
      const isFull = row.every(cell => cell !== null)
      if (isFull) linesCleared++
      return !isFull
    })

    while (finalBoard.length < ROWS) {
      finalBoard.unshift(Array(COLS).fill(null))
    }

    board.value = finalBoard
    score.value += linesCleared * 100
    currentPiece.value = createPiece()
  }
}

const moveLeft = () => {
  if (!currentPiece.value || gameOver.value || isPaused.value) return
  if (!checkCollision(currentPiece.value, currentPiece.value.x - 1, currentPiece.value.y)) {
    currentPiece.value.x -= 1
  }
}

const moveRight = () => {
  if (!currentPiece.value || gameOver.value || isPaused.value) return
  if (!checkCollision(currentPiece.value, currentPiece.value.x + 1, currentPiece.value.y)) {
    currentPiece.value.x += 1
  }
}

const rotatePiece = () => {
  if (!currentPiece.value || gameOver.value || isPaused.value) return
  const newShape = currentPiece.value.shape[0].map((_, index) =>
    currentPiece.value!.shape.map(row => row[index]).reverse()
  )
  const newPiece = { ...currentPiece.value, shape: newShape }
  if (!checkCollision(newPiece, newPiece.x, newPiece.y)) {
    currentPiece.value = newPiece
  }
}

const dropPiece = () => {
  if (!currentPiece.value || gameOver.value || isPaused.value) return
  let newY = currentPiece.value.y
  while (!checkCollision(currentPiece.value, currentPiece.value.x, newY + 1)) {
    newY += 1
  }
  currentPiece.value.y = newY
  moveDown() // Trigger immediate merge
}

const update = (time: number) => {
  if (!lastUpdateRef) lastUpdateRef = time
  const deltaTime = time - lastUpdateRef
  if (deltaTime > dropTime) {
    moveDown()
    lastUpdateRef = time
  }
  requestRef = requestAnimationFrame(update)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
    e.stopPropagation()
    e.preventDefault()
  }
  switch (e.key) {
    case 'ArrowLeft':
      moveLeft()
      break
    case 'ArrowRight':
      moveRight()
      break
    case 'ArrowDown':
    case ' ':
      dropPiece()
      break
    case 'ArrowUp':
      rotatePiece()
      break
  }
}

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault() // Prevent scrolling
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  
  const dx = touchEndX - touchStartX
  const dy = touchEndY - touchStartY

  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    if (dx > 0) moveRight()
    else moveLeft()
  } else if (Math.abs(dy) > 30 && dy > 0) {
    dropPiece()
  } else if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
    rotatePiece() // Tap to rotate
  }
}

const renderBoard = computed(() => {
  const displayBoard = board.value.map(row => [...row])
  if (currentPiece.value) {
    currentPiece.value.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const py = currentPiece.value!.y + r
          const px = currentPiece.value!.x + c
          if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
            displayBoard[py][px] = { color: currentPiece.value!.color }
          }
        }
      })
    })
  }
  return displayBoard
})

onMounted(() => {
  currentPiece.value = createPiece()
  window.addEventListener('keydown', handleKeyDown, true)
  requestRef = requestAnimationFrame(update)

  timerId = window.setInterval(() => {
    if (!gameOver.value && !isPaused.value) {
      progressStore.addStageTime(STAGE_NUMBER, 1)
    }
  }, 1000)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown, true)
  if (requestRef) cancelAnimationFrame(requestRef)
  if (timerId) clearInterval(timerId)
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
  touch-action: none; /* Prevent scroll on mobile */
  z-index: 1; /* Ensure it stays behind the bottom nav */
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



.score {
  position: absolute;
  top: 20px;
  color: white;
  z-index: 10;
  font-size: 2rem;
  font-weight: bold;
}

.tetris-board {
  display: flex;
  flex-direction: column;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 80px; /* Room for controls */
}

.tetris-row {
  display: flex;
}

.tetris-cell {
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.controls-overlay {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dpad-row {
  display: flex;
  gap: 15px;
}

.dpad-btn {
  width: 50px;
  height: 50px;
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

.rotate-btn {
  margin-left: 20px;
  background-color: rgba(187, 134, 252, 0.2);
  border-color: rgba(187, 134, 252, 0.5);
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  color: white;
}

@media (max-width: 600px) {
  .tetris-cell {
    width: 16px;
    height: 16px;
  }
}
</style>