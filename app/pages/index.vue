<script setup lang="ts">
import { ref } from "vue";
import useEmailFilterAndSort from "~/composables/useEmailFilterAndSort";
import { selectedAccount, selectedFolder, selectedFolderAsString, selectedMailId } from "~/store";

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

const { data: rawMails } = await useFetch(
  () => `/api/mail/${selectedAccount.value}/${selectedFolderAsString.value}/list`,
  {
    default: () => [],
  }
);

const mails = useEmailFilterAndSort(rawMails, "", selectedTab);

const { data: mail } = await useFetch(
  () => `/api/mail/${selectedAccount.value}/${selectedFolderAsString.value}/${selectedMailId.value}`,
  {
    default: () => {},
  }
);
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

  <InboxMail v-if="mail" :mail />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
  </div>
</template>
