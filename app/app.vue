<script setup lang="ts">
useSeoMeta({
  title: "MiniMail",
  robots: "noindex, nofollow",
});
</script>

<template>
  <div>
    <NuxtPwaAssets />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UpdateServerWorker />
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
