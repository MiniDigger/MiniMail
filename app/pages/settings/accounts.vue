<script lang="ts" setup>
import { useAccount } from "community-jazz-vue";
import { type AccountLoaded, type AccountType, UserAccount } from "~/jazz/schema";
import { EditAccountModal } from "#components";

const { me } = useAccount(UserAccount);

const overlay = useOverlay();
const modal = overlay.create(EditAccountModal);

async function createNew() {
  const instance = modal.open();
  const account = await instance.result;
  if (account) {
    me.value?.root?.accounts?.$jazz?.push(account);
  }
}

async function edit(account: AccountLoaded) {
  const instance = modal.open({ account });
  const updatedAccount = await instance.result;
  if (updatedAccount && account !== updatedAccount) {
    account.$jazz.applyDiff(updatedAccount);
  }
}

async function remove(account: AccountLoaded) {
  if (
    confirm(
      `Are you sure you want to delete the account ${account.name} (${account.email})? This action cannot be undone.`
    )
  ) {
    me.value?.root?.accounts?.$jazz?.remove((a) => a.$jazz.id === account.$jazz.id);
  }
}
</script>

<template>
  <UContainer class="w-128">
    <div class="space-y-4">
      <div v-for="account in me?.root?.accounts" class="grid grid-cols-[1fr_48px_70px] gap-4">
        <p>{{ account?.name }} ({{ account?.email }})</p>
        <UButton @click="edit(account)">Edit</UButton>
        <UButton @click="remove(account)">Remove</UButton>
      </div>
    </div>
    <UButton @click="createNew">New</UButton>
  </UContainer>
</template>
