import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Set the path to your repository root (one level up)
  const rootPath = resolve(__dirname, '..')
  // Load all environment variables from the repo root .env file
  const env = loadEnv(mode, rootPath, '')

  return {
    plugins: [react()],
    // Optionally expose env variables to your client code
    define: {
      'process.env': env,
    },
  }
})
