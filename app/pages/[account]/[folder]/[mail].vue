<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const route = useRoute("account-folder-mail");

const { data: mail } = await useFetch(
  () => `/api/mail/${route.params.account}/${route.params.folder}/${route.params.mail}`,
  {
    default: () => [],
  }
);
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");
</script>

<template>
  <InboxMail :mail />

  <!--    <ClientOnly>-->
  <!--      <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">-->
  <!--        <template #content>-->
  <!--          <NuxtPage v-if="route.params.mail" />-->
  <!--        </template>-->
  <!--      </USlideover>-->
  <!--    </ClientOnly>-->
</template>
