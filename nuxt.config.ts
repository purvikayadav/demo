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
    databaseUrl: process.env.DATABASE_URL,
    kvRestApiUrl: process.env.KV_REST_API_URL,
    kvRestApiToken: process.env.KV_REST_API_TOKEN,
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-change-in-production',
    
    // Public keys (exposed to client-side)
    public: {
      appName: 'Teacher Portal',
      apiBase: '/api'
    }
  }
})