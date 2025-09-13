<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAccount } from "community-jazz-vue";
import { UserAccount } from "~/jazz/schema";

interface Account {
  label: string;
}

const router = useRouter();
const route = useRoute();
const { me } = useAccount(UserAccount);

defineProps<{
  collapsed?: boolean;
}>();

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    me.value?.root?.accounts?.map((account) => ({
      label: account?.email,
      async onSelect() {
        await router.push("/mail/" + account?.email);
      },
    })),
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
