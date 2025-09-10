<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import AccountMenu from "~/components/AccountMenu.vue";

const route = useRoute();

const open = ref(false);

const accounts = [
  {
    label: "test@benndorf.dev",
  },
  {
    label: "test2@benndorf.dev",
  },
];

const { data: folders } = await useFetch(() => `/api/mail/${route.params.account}/folders`, {
  default: () => [],
});
const links = computed(
  () =>
    [
      // TODO properly nest these
      // TODO list folders per account here
      [
        ...(folders.value?.map((folder) => ({
          label: folder.name,
          icon: "i-lucide-house",
          to: `/mail/${route.params.account}/${[...folder.path, folder.name].join(".")}`,
        })) || []),
      ],
    ] satisfies NavigationMenuItem[][]
);

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.value.flat(),
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
        <AccountMenu :collapsed :accounts />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed class="bg-transparent ring-default" />

        <UNavigationMenu :collapsed :items="links[0]" orientation="vertical" tooltip popover />

        <UNavigationMenu :collapsed :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <SettingsMenu :collapsed />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups />

    <NuxtPage />
  </UDashboardGroup>
</template>
