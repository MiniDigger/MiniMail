<script lang="ts" setup>
import { UserAccount } from "~/jazz/schema";
import { JazzVueProviderWithClerk } from "community-jazz-vue";
import { useClerk } from "@clerk/vue";
import AuthWrapper from "~/components/AuthWrapper.vue";

// import "jazz-tools/inspector/register-custom-element";

const {
  public: { jazzServerUrl, jazzApiKey },
} = useRuntimeConfig();
const peer = (jazzServerUrl + (jazzApiKey ? `?key=${jazzApiKey}` : "")) as "wss://${string}";

const clerk = useClerk();
</script>

<template>
  <JazzVueProviderWithClerk
    v-if="clerk"
    :AccountSchema="UserAccount"
    :sync="{ peer, when: 'signedUp' }"
    :guest-mode="false"
    :clerk
  >
    <AuthWrapper>
      <slot />
      <!--    <component-->
      <!--      :is="-->
      <!--        h('jazz-inspector', {-->
      <!--          style: { position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 },-->
      <!--        })-->
      <!--      "-->
      <!--    />-->
    </AuthWrapper>
  </JazzVueProviderWithClerk>
  <div v-else>
    <p>Loading Clerk...</p>
  </div>
</template>
