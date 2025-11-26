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
      "* * * * *": ["run-filters", "sync-folders", "sync-mails"],
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
      enabled: false,
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
  runtimeConfig: {
    webPushPrivateKey: "wO2tigOhp4Xy9MJJSX078nZonQGDsv0t0XNHmkfbI6c",
    workerSecret:
      "sealerSecret_z7wJbwgEGrdmvVFqz3jNtxs39z19GeXVKP9qdQSzsuEmj/signerSecret_z3AFog7BAfZLqLnnqujRJScCQKR4jjuGurGqnFnyU9ezF",
    public: {
      clerkPubKey: "pk_test_YW1hemluZy10ZXJyaWVyLTQ4LmNsZXJrLmFjY291bnRzLmRldiQ",
      jazzApiKey:
        "Y29fekRHeFdnUjdXTHdTc2FNOVdNZ0NaUmJ1VWt4fGNvX3o1VE45aFBCTmtoTGdua2pBYWpDSHN5Sm1Gc3xjb196QVlyOGR0dmIzSzZzSzhHV3pvZ3R2aTlmTWY",
      jazzServerUrl: "wss://cloud.jazz.tools",
      onesignalAppId: "96265c81-9366-4069-8c9a-fdcfcb167772", //"f775d0bd-f2a1-4c22-b4ef-157541939562",
      webPushPublicKey: "BNJreu9HwQ88JOlu2HNQ329tiC6B-05aTFjQcXwaENGB1WQUOBBjkBYA2HndkoqT6jMzuNq_yV1bD8a7RsheGPA",
      workerAccountID: "co_zDJNYtPykdq1sFKpH27wAoYnGQX",
    },
  },
});
