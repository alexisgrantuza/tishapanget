// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
  ],
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    public: {
      apiBase: "/api",
    },
  },
  icon: {
    componentName: "NuxtIcon",
  },
});
