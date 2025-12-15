<script setup lang="ts">
import AccountMenu from "~/components/layout/AccountMenu.vue";
import SettingsMenu from "~/components/layout/SettingsMenu.vue";
import { useCoState } from "community-jazz-vue";
import { Account } from "#shared/schema";
import { selectedAccountId, selectedFolderId } from "~/store";
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";

const open = ref(false);

const account = useCoState(Account, selectedAccountId, { resolve: { folders: { $each: true } } });

// Reset selected folder when account changes
watch(account, () => {
  if (!account.value.$isLoaded) {
    selectedFolderId.value = undefined;
  } else {
    selectedFolderId.value = account.value?.folders?.[0]?.$jazz?.id;
  }
});

const folders = computed(() => {
  if (!account.value.$isLoaded) return [];
  // TODO properly nest these
  return (
    account.value?.folders?.map(
      (folder) =>
        ({
          label: folder.name,
          icon: "i-lucide-house",
          active: selectedFolderId.value === folder.$jazz.id,
          onSelect() {
            selectedFolderId.value = folder.$jazz.id;
          },
        }) satisfies NavigationMenuItem
    ) || []
  );
});
const groups = computed(() => [
  {
    id: "folders",
    label: "Go to",
    items: folders.value,
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        label: "Filters",
        icon: "i-lucide-filter",
        to: "/settings/filters",
      },
      {
        label: "Inboxes",
        icon: "i-lucide-cog",
        to: "/settings/accounts",
      },
    ],
  },
]);
</script>
<template>
  <UApp>
    <UDashboardGroup unit="rem">
      <UDashboardSidebar
        id="default"
        v-model:open="open"
        collapsible
        resizable
        class="bg-elevated/25"
        :ui="{ footer: 'lg:border-t lg:border-default' }"
      >
        <template #header="{ collapsed }">
          <AccountMenu :collapsed />
        </template>

        <template #default="{ collapsed }">
          <UDashboardSearchButton :collapsed class="bg-transparent ring-default" />

          <UNavigationMenu :collapsed :items="folders" orientation="vertical" tooltip popover />
        </template>

        <template #footer="{ collapsed }">
          <SettingsMenu :collapsed />
        </template>
      </UDashboardSidebar>

      <UDashboardSearch :groups />

      <slot />
    </UDashboardGroup>
  </UApp>
</template>
