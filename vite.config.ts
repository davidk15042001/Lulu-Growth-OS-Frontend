import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const sharedEnvDir = resolve(projectRoot, '..', 'Lulu-Growth-OS-Backend')

// https://vite.dev/config/
export default defineConfig({
  envDir: sharedEnvDir,
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
})
