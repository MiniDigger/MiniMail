<script lang="ts" setup>
import { useAccount } from "community-jazz-vue";
import { getLoadedOrUndefined } from "jazz-tools";
import { type AccountType, UserAccount } from "#shared/schema";
import { EditAccountModal } from "#components";

const me = useAccount(UserAccount, { resolve: { root: { accounts: { $each: true } } } });

const overlay = useOverlay();
const modal = overlay.create(EditAccountModal);

async function createNew() {
  const instance = modal.open();
  const account = (await instance.result) as AccountType | undefined;
  if (account) {
    getLoadedOrUndefined(me.value)?.root?.accounts?.$jazz?.push(account);
  }
}

async function edit(account: AccountType) {
  const instance = modal.open({ account });
  const updatedAccount = await instance.result;
  if (updatedAccount && account !== updatedAccount) {
    account.$jazz.applyDiff(updatedAccount);
  }
}

async function remove(account: AccountType) {
  if (
    confirm(
      `Are you sure you want to delete the account ${account.name} (${account.email})? This action cannot be undone.`
    )
  ) {
    getLoadedOrUndefined(me.value)?.root?.accounts?.$jazz?.remove((a) => a?.$jazz?.id === account.$jazz.id);
  }
}
</script>

<template>
  <UDashboardPanel id="accounts">
    <UDashboardNavbar title="Accounts">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>
    <div class="border-b border-default p-4 sm:px-6">
      <div class="w-lg mx-auto">
        <div v-if="me?.$isLoaded" class="space-y-4">
          <div
            v-for="account in me.root?.accounts"
            :key="account.$jazz.id"
            class="grid grid-cols-[1fr_48px_70px] gap-4"
          >
            <template v-if="account?.$isLoaded">
              <!--suppress HtmlUnknownTarget -->
              <NuxtLink :to="'/mail/' + account.email">{{ account.name }} ({{ account.email }})</NuxtLink>
              <UButton @click="edit(account)">Edit</UButton>
              <UButton @click="remove(account)">Remove</UButton>
            </template>
            <span v-else>Loading...</span>
          </div>
        </div>
        <UButton @click="createNew">New</UButton>
      </div>
    </div>
  </UDashboardPanel>
</template>
