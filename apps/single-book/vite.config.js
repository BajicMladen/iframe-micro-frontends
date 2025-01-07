import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../../shared/',
  plugins: [vue()],
  server: {
    port: 5175,
  },
});
