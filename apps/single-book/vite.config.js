import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../../shared/',
  plugins: [vue()],
  server: {
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' http://localhost:5173 https://iframe-micro-frontends-container.vercel.app;",
    },
    port: 5175,
  },
});
