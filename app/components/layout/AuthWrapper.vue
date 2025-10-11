<script setup lang="ts">
import { SignInButton } from "@clerk/vue";
import { useIsAuthenticated } from "community-jazz-vue";
const isAuthenticated = useIsAuthenticated();
</script>
<template>
  <div v-if="isAuthenticated">
    <slot />
  </div>
  <div v-else>
    <SignInButton />
  </div>
</template>
