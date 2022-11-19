/// <reference types="vite/client" />

import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const env = import.meta.env as ImportMetaEnv | undefined

const replace = (): Plugin => {
  return {
    name: 'replace',
    transform(src) {
      return {
        code: src.replace('__api_key__', env ? env.VITE_API_KEY : ''),
        map: null
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [replace(), svelte()]
})
