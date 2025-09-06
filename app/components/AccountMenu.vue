<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

interface Account {
  label: string;
}

const router = useRouter();
const route = useRoute();

const { accounts } = defineProps<{
  collapsed?: boolean;
  accounts: Account[];
}>();

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    accounts.map((account) => ({
      label: account.label,
      async onSelect() {
        await router.push("/" + account.label);
      },
    })),
    [
      {
        label: "Add inbox",
        icon: "i-lucide-circle-plus",
      },
      {
        label: "Manage inboxes",
        icon: "i-lucide-cog",
      },
    ],
  ];
});
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      v-bind="{
        label: collapsed ? undefined : route.params.account + '',
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
