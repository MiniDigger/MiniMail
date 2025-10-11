<script setup lang="ts">
const pwa = usePWA();

async function doStuff() {
  const result = await Notification.requestPermission();
  console.log("Permission result:", result);
  if (result === "granted") {
    // new Notification("Successfully subscribed!");
    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not found");
      return;
    }
    console.log("wait for service worker to be ready");
    const sw = await navigator.serviceWorker.ready;
    const sub = await sw.pushManager.getSubscription();
    if (sub == null) {
      console.log("No subscription found");
      const {
        public: { webPushPublicKey },
      } = useRuntimeConfig();
      const newSub = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: webPushPublicKey,
      });
      console.log("New subscription:", newSub);
    } else {
      console.log("Existing subscription:", sub);
      console.log(JSON.stringify(sub));
    }
  }
}
</script>

<template>
  <div>
    <h1>Nuxt Vite PWA</h1>
    <ClientOnly> PWA Installed: {{ pwa?.isPWAInstalled }} </ClientOnly>
    <!--    <OneSignalSubscribeButton />-->
    <UButton @click="doStuff">Subscribe</UButton>
  </div>
</template>
