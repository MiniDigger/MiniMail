<script lang="ts" setup>
import { useAccount } from "community-jazz-vue";
import { type AccountLoaded, type AccountType, UserAccount } from "~/jazz/schema";
import { EditAccountModal } from "#components";

const { me } = useAccount(UserAccount);
</script>

<template>
  <UDashboardPanel id="notifications">
    <UDashboardNavbar title="Notifications">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>
    <div class="border-b border-default p-4 sm:px-6">
      <div class="w-128 mx-auto">
        <div class="space-y-4">
          <div v-for="device in me?.root?.devices" class="grid grid-cols-[1fr_48px_70px] gap-4"></div>
        </div>
      </div>
    </div>
  </UDashboardPanel>
</template>
