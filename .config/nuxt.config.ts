// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@compodium/nuxt"],
  css: ["~/assets/style/main.css"],
  nitro: {
    plugins: ["services/config.ts", "services/filters.ts", "services/mail.ts"],
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      "*/5 * * * *": ["filters:run"],
    },
  },
  experimental: {
    typedPages: true,
  },
  eslint: {
    config: {
      autoInit: false,
    },
  },
});
