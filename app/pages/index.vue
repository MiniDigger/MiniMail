<script setup lang="ts">
import { ref } from "vue";
import useEmailFilterAndSort from "~/composables/useEmailFilterAndSort";
import { selectedFolderId, selectedMailId } from "~/store";
import { useCoState } from "community-jazz-vue";
import { Folder } from "#shared/schema";

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

const folder = useCoState(Folder, selectedFolderId, {
  resolve: { mails: { $each: true } },
});

const mails = useEmailFilterAndSort(() => (folder.value?.$isLoaded ? folder.value.mails : []), "", selectedTab);
</script>

<template>
  <div>
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

    <InboxMail v-if="selectedMailId" />
    <div v-else class="hidden lg:flex flex-1 items-center justify-center">
      <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
    </div>
  </div>
</template>
