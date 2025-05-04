import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
      },
      chunkSizeWarningLimit: 1600,
      sourcemap: true
    },
    base: '/'
  }
})
