import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '',
  server: {
    proxy: {
      '/submit': process.env.VITE_API_URL
    },
    cors : true,
  },
});