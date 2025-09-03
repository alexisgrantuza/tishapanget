// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// 1. Fix your nuxt.config.ts - Remove duplicate supabase config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
  ],
  css: ["~/assets/css/main.css", "vue-sonner/style.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/"],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || "",
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY, // Add this
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  icon: {
    componentName: "NuxtIcon",
  },
});
