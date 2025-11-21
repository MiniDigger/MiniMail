<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAccount, useLogOut } from "community-jazz-vue";
import { getLoadedOrUndefined } from "jazz-tools";
import { UserAccount } from "#shared/schema";

defineProps<{
  collapsed?: boolean;
}>();

const colorMode = useColorMode();
const appConfig = useAppConfig();
const me = useAccount(UserAccount, { resolve: { root: { settings: true } } });
const logout = useLogOut();

watch(
  () => getLoadedOrUndefined(me.value)?.root?.settings,
  (settings) => {
    if (settings) {
      if (settings.$jazz.has("colorMode")) {
        colorMode.preference = settings.colorMode;
      }
      if (settings.$jazz.has("primaryColor")) {
        appConfig.ui.colors.primary = settings.primaryColor;
      }
      if (settings.$jazz.has("neutralColor")) {
        appConfig.ui.colors.neutral = settings.neutralColor;
      }
    }
  },
  { immediate: true }
);

const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;
const neutrals = ["slate", "gray", "zinc", "neutral", "stone"] as const;

const items = computed<DropdownMenuItem[][]>(
  () =>
    [
      [
        {
          label: "Home - Remove Me again!",
          icon: "i-lucide-home",
          to: "/",
        },
        {
          label: "Filters",
          icon: "i-lucide-filter",
          to: "/settings/filters",
        },
        {
          label: "Accounts",
          icon: "i-lucide-users",
          to: "/settings/accounts",
        },
        {
          label: "Notifications",
          icon: "i-lucide-bell",
          to: "/settings/notifications",
        },
      ],
      [
        {
          label: "Theme",
          icon: "i-lucide-palette",
          children: [
            {
              label: "Primary",
              slot: "chip",
              chip: appConfig.ui.colors.primary,
              content: {
                align: "center",
                collisionPadding: 16,
              },
              children: colors.map((color) => ({
                label: color,
                chip: color,
                slot: "chip",
                checked: appConfig.ui.colors.primary === color,
                type: "checkbox",
                onSelect: (e) => {
                  e.preventDefault();

                  appConfig.ui.colors.primary = color;
                  getLoadedOrUndefined(me.value)?.root?.settings?.$jazz?.set("primaryColor", color);
                },
              })),
            },
            {
              label: "Neutral",
              slot: "chip",
              chip: appConfig.ui.colors.neutral === "neutral" ? "old-neutral" : appConfig.ui.colors.neutral,
              content: {
                align: "end",
                collisionPadding: 16,
              },
              children: neutrals.map((color) => ({
                label: color,
                chip: color === "neutral" ? "old-neutral" : color,
                slot: "chip",
                type: "checkbox",
                color,
                checked: appConfig.ui.colors.neutral === color,
                onSelect: (e) => {
                  e.preventDefault();

                  appConfig.ui.colors.neutral = color;
                  getLoadedOrUndefined(me.value)?.root?.settings?.$jazz?.set("neutralColor", color);
                },
              })),
            },
          ] as DropdownMenuItem[],
        },
        {
          label: "Appearance",
          icon: "i-lucide-sun-moon",
          children: [
            {
              label: "Light",
              icon: "i-lucide-sun",
              type: "checkbox",
              checked: colorMode.value === "light",
              onSelect(e: Event) {
                e.preventDefault();

                colorMode.preference = "light";
                getLoadedOrUndefined(me.value)?.root?.settings?.$jazz?.set("colorMode", "light");
              },
            },
            {
              label: "Dark",
              icon: "i-lucide-moon",
              type: "checkbox",
              checked: colorMode.value === "dark",
              onUpdateChecked(checked: boolean) {
                if (checked) {
                  colorMode.preference = "dark";
                  getLoadedOrUndefined(me.value)?.root?.settings?.$jazz?.set("colorMode", "dark");
                }
              },
              onSelect(e: Event) {
                e.preventDefault();
              },
            },
          ],
        },
      ],
      [
        {
          label: "Log out",
          icon: "i-lucide-log-out",
          onSelect(e: Event) {
            e.preventDefault();
            logout();
          },
        },
      ],
    ] satisfies DropdownMenuItem[][]
);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      v-bind="{
        icon: 'i-lucide-cog',
        label: collapsed ? undefined : 'Settings',
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
