import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [legacy({
    targets: ['defaults', 'IE>=11'],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    
  }),vue()],
  build: {
    target: ['es2015', 'chrome63'],}
})
