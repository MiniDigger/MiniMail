<script setup lang="ts">
const pwa = usePWA();
</script>

<template>
  <div>
    <h1>Nuxt Vite PWA</h1>
    <ClientOnly> PWA Installed: {{ pwa?.isPWAInstalled }} </ClientOnly>
  </div>
</template>
