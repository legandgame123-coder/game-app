import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['battelgame.com', 'www.battelgame.com'] // ✅ add your domain(s) here
  }
})
