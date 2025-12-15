<script setup lang="ts">
import { JazzVueProviderWithClerk } from "community-jazz-vue";
import { useClerk } from "@clerk/vue";
import AuthWrapper from "~/components/layout/AuthWrapper.vue";
import PWAToast from "~/components/layout/PWAToast.vue";
import { UserAccount } from "#shared/schema";

const {
  public: { jazzServerUrl, jazzApiKey },
} = useRuntimeConfig();
const peer = (jazzServerUrl + (jazzApiKey ? `?key=${jazzApiKey}` : "")) as "wss://${string}";

const clerk = useClerk();

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
    <JazzVueProviderWithClerk
      v-if="clerk"
      :AccountSchema="UserAccount"
      :sync="{ peer, when: 'signedUp' }"
      :guest-mode="false"
      :clerk
    >
      <AuthWrapper>
        <NuxtLayout>
          <NuxtPage />
          <PWAToast />
        </NuxtLayout>
      </AuthWrapper>
    </JazzVueProviderWithClerk>
    <div v-else>
      <p>Loading Clerk...</p>
    </div>
  </div>
</template>
