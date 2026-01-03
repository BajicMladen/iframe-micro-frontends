import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  envDir: '../../shared/',
  server: {
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' http://localhost:5173 https://iframe-micro-frontends-container.vercel.app;",
    },
    port: 5174,
  },
})
