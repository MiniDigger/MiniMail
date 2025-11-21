<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAccount } from "community-jazz-vue";
import { getLoadedOrUndefined } from "jazz-tools";
import { UserAccount } from "#shared/schema";
import { selectedAccount } from "~/store";

const me = useAccount(UserAccount, { resolve: { root: { accounts: { $each: true } } } });

defineProps<{
  collapsed?: boolean;
}>();

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    getLoadedOrUndefined(me.value)?.root?.accounts?.map(
      (account) =>
        ({
          label: account?.email,
          async onSelect() {
            selectedAccount.value = account?.email;
          },
        }) satisfies DropdownMenuItem
    ) || [],
    [
      {
        label: "Add account",
        icon: "i-lucide-circle-plus",
        to: "/settings/accounts?new=true",
      },
      {
        label: "Manage accounts",
        icon: "i-lucide-cog",
        to: "/settings/accounts",
      },
    ] satisfies DropdownMenuItem[],
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
        label: collapsed ? undefined : selectedAccount || 'Select account...',
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
