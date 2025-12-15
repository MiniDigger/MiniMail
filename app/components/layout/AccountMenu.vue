<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAccount, useCoState } from "community-jazz-vue";
import { getLoadedOrUndefined } from "jazz-tools";
import { Account, UserAccount } from "#shared/schema";
import { selectedAccountId } from "~/store";

const me = useAccount(UserAccount, { resolve: { root: { accounts: { $each: true } } } });

const { collapsed } = defineProps<{
  collapsed?: boolean;
}>();

const selectedAccount = useCoState(Account, selectedAccountId);
const label = computed(() => {
  if (collapsed) {
    return undefined;
  } else {
    if (selectedAccount.value.$isLoaded && selectedAccount.value.email) {
      return selectedAccount.value.email;
    } else {
      return "Select account...";
    }
  }
});

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    getLoadedOrUndefined(me.value)?.root?.accounts?.map(
      (account) =>
        ({
          label: account?.email,
          async onSelect() {
            selectedAccountId.value = account.$jazz.id;
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
      :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
      :label
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
