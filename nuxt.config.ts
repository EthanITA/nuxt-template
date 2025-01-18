// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4
  },
  ssr: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxthub/core",
  ],
  sourcemap: false,
  css: ["@/assets/main.css"],
  nitro: { experimental: { openAPI: true } },
})
