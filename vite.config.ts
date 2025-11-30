import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true // Esto permite el acceso desde la red WiFi
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});