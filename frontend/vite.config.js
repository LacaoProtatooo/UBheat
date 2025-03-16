import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';

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
