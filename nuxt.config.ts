// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'standalone'
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['vuetify/styles','@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify'],
  },
})
