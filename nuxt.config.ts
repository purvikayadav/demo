export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'vercel'
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-05-15',
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify']
  }
})
