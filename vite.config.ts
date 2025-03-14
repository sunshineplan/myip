import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const api_key = process.env.API_KEY

const replace = (): Plugin => {
  return {
    name: 'replace',
    transform(src) {
      return {
        code: src.replace('__api_key__', api_key || ''),
        map: null
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [replace(), svelte()]
})
