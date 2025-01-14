import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  envDir: '../../shared/',
  server: {
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' *;",
    },
    port: 5174,
  },
})
