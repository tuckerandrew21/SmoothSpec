import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load .env.local for tests
  const env = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      environment: 'node',
      globals: true,
      testTimeout: 30000, // 30s for API calls
      include: ['src/**/*.test.ts'],
      env: {
        ...env,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
