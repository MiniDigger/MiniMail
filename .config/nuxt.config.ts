import { createAppleSplashScreens } from "@vite-pwa/assets-generator/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@compodium/nuxt", "@vite-pwa/nuxt"],
  css: ["~/assets/style/main.css"],
  nitro: {
    plugins: ["services/mail.ts", "services/jazz.ts"],
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      "* * * * *": ["run-filters"],
    },
    prerender: {
      routes: ["/", "/pwatest", "/settings/accounts", "/settings/filters", "/settings/notifications"],
    },
  },
  experimental: {
    typedPages: true,
    asyncContext: true,
  },
  ssr: false,
  eslint: {
    config: {
      autoInit: false,
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        lib: ["webworker"],
      },
    },
  },
  pwa: {
    mode: "development",
    devOptions: {
      enabled: true,
      type: "module",
    },
    srcDir: ".",
    filename: "sw.ts",
    strategies: "injectManifest",
    // strategies: "generateSW",
    registerType: "autoUpdate",
    manifest: {
      theme_color: "#1e293b",
      name: "MiniMail",
      short_name: "MiniMail",
      description: "A mail client, just for me.",
    },
    pwaAssets: {
      preset: {
        transparent: {
          sizes: [64, 192, 512],
          favicons: [[48, "favicon.ico"]],
        },
        maskable: {
          sizes: [512],
        },
        apple: {
          sizes: [180],
        },
        appleSplashScreens: createAppleSplashScreens(
          {
            padding: 0.3,
            resizeOptions: { fit: "contain", background: "white" },
            darkResizeOptions: { fit: "contain", background: "black" },
            linkMediaOptions: {
              log: true,
              addMediaScreen: true,
              xhtml: true,
            },
          },
          ['iPad Air 9.7"']
        ),
      },
      image: "../public/favicon.svg",
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
  },
});
