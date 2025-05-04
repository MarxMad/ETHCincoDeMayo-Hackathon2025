import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      'process.env': env,
      global: 'window',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        buffer: 'buffer/',
        util: 'util/',
      },
    },
    optimizeDeps: {
      include: ['buffer', 'util'],
    },
    build: {
      rollupOptions: {
        external: ['recharts'],
        output: {
          globals: {
            recharts: 'Recharts'
          }
        }
      }
    }
  }
})
