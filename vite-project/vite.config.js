import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        characters: resolve(__dirname, 'characters.html'),
        dragons:    resolve(__dirname, 'dragons.html'),
        houses:     resolve(__dirname, 'houses.html'),
        history:    resolve(__dirname, 'history.html'),
      }
    }
  }
})
