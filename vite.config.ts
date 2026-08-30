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
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('recharts') || id.includes('victory') || id.includes('d3-')) return 'charts'
          return 'vendor'
        },
      },
    },
  },
})
