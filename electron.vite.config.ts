import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

const sharedAliases = {
  '@core': resolve('src/core'),
  '@shared': resolve('src/shared')
}

export default defineConfig({
  main: {
    resolve: {
      alias: sharedAliases
    }
  },
  preload: {
    resolve: {
      alias: sharedAliases
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        ...sharedAliases
      }
    },
    plugins: [react()]
  }
})
