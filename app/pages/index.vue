<script setup lang="ts">
import { ref } from "vue";
import useEmailFilterAndSort from "~/composables/useEmailFilterAndSort";
import { selectedFolder, selectedMail } from "~/store";
import { computedAsync } from "@vueuse/core";

const tabItems = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
];
const selectedTab = ref("all");

const rawMails = computedAsync(async () => {
  console.log("check raw mail");
  const loaded = await selectedFolder.value?.$jazz.ensureLoaded({ resolve: { mails: { $each: true } } });
  if (!loaded?.mails?.$isLoaded) return [];
  console.log("raw mails", loaded.mails);
  return loaded.mails;
}, []);

const mails = useEmailFilterAndSort(rawMails, "", selectedTab);
</script>

<template>
  <UDashboardPanel id="inbox-1" :default-size="25" :min-size="20" :max-size="30" resizable>
    <UDashboardNavbar title="Inbox">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge :label="mails.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs v-model="selectedTab" :items="tabItems" :content="false" size="xs" />
      </template>
    </UDashboardNavbar>
    <InboxList :mails="mails" />
  </UDashboardPanel>

  <InboxMail v-if="selectedMail" :mail="selectedMail" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
  </div>
</template>
