<script lang="ts" setup>
import { UserAccount } from "~/jazz/schema";
import { JazzVueProvider, PasskeyAuthBasicUI } from "community-jazz-vue";

import "jazz-tools/inspector/register-custom-element";
</script>

<template>
  <JazzVueProvider
    :AccountSchema="UserAccount"
    :sync="{ peer: 'wss://cloud.jazz.tools/?key=jazz@benndorf.dev' }"
    :guestMode="false"
  >
    <PasskeyAuthBasicUI appName="Test">
      <slot />
    </PasskeyAuthBasicUI>
  </JazzVueProvider>
</template>
