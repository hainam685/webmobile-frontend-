import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["2403-2401-d800-16e-9e4a-c10a-5602-1086-2c04.ngrok-free.app"],
  }
})


