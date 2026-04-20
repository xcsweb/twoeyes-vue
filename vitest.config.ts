import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/store/**/*.spec.ts'],
    environment: 'node'
  }
})

