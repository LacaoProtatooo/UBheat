import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiUrl,
    },
  },
  build: {
    outDir: 'dist'
  }
});
