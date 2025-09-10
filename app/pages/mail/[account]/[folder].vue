<script setup lang="ts">
import { computed, ref, watch } from "vue";

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

const router = useRouter();
const route = useRoute("account-folder");
const { data: mails } = await useFetch(() => `/api/mail/${route.params.account}/${route.params.folder}/list`, {
  default: () => [],
});

// Filter mails based on the selected tab
const filteredMails = computed(() => {
  if (selectedTab.value === "unread") {
    return mails.value.filter((mail) => !!mail.unread);
  }

  return mails.value;
});

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, async () => {
  const selectedMail = route.params.mail;
  if (selectedMail && !filteredMails.value.find((mail) => mail.id === selectedMail)) {
    await router.push(`/mail/${route.params.account}/${route.params.folder}`);
  }
});
</script>

<template>
  <UDashboardPanel id="inbox-1" :default-size="25" :min-size="20" :max-size="30" resizable>
    <UDashboardNavbar title="Inbox">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge :label="filteredMails.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs v-model="selectedTab" :items="tabItems" :content="false" size="xs" />
      </template>
    </UDashboardNavbar>
    <InboxList :mails="filteredMails" />
  </UDashboardPanel>

  <NuxtPage v-if="route.params.mail" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
  </div>
</template>
