import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env from parent folder manually
  const env = loadEnv(mode, '../', '')

  return {
    plugins: [react()],
    define: {
      'import.meta.env': {
        VITE_APP_API_URL: JSON.stringify(env.VITE_APP_API_URL),
        VITE_APP_APP_NAME: JSON.stringify(env.VITE_APP_APP_NAME),
        VITE_APP_DEBUG: JSON.stringify(env.VITE_APP_DEBUG),
        VITE_TINYMCE_API_KEY: JSON.stringify(env.VITE_TINYMCE_API_KEY),
      }
    }
  }
})
