// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'vercel',
    experimental: {
      wasm: true
    }
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-05-15',
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    
    // Public keys (exposed to client-side)
    public: {
      appName: 'Teacher Portal',
      apiBase: '/api'
    }
  }
})