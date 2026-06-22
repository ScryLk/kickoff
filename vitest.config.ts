import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

/**
 * Os testes cobrem o core puro (validação e transpilers). Por isso o ambiente
 * é Node e o escopo fica restrito a `src/core` — sem Electron, sem DOM.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@core': resolve('src/core')
    }
  },
  test: {
    environment: 'node',
    include: ['src/core/**/*.{test,spec}.ts']
  }
})
