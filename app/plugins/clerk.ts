import { clerkPlugin } from "@clerk/vue";

export default defineNuxtPlugin((nuxtApp) => {
  const {
    public: { clerkPubKey },
  } = useRuntimeConfig();

  if (!clerkPubKey) {
    throw new Error("Missing clerk publishable key");
  }

  nuxtApp.vueApp.use(clerkPlugin, {
    publishableKey: clerkPubKey,
    afterSignOutUrl: "/",
  });
});
