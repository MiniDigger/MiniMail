<script setup lang="ts">
import { useAccount } from "community-jazz-vue";
import { getLoadedOrUndefined } from "jazz-tools";
import { type FilterType, UserAccount } from "#shared/schema";
import { EditFilterModal } from "#components";

const me = useAccount(UserAccount, { resolve: { root: { filters: true } } });

const overlay = useOverlay();
const modal = overlay.create(EditFilterModal);

async function createNew() {
  const instance = modal.open();
  const filter = await instance.result;
  if (filter) {
    getLoadedOrUndefined(me.value)?.root?.filters?.$jazz?.push(filter);
  }
}

async function edit(filter: FilterType) {
  const instance = modal.open({ filter });
  const updatedFilter = await instance.result;
  if (updatedFilter && filter !== updatedFilter) {
    const index = getLoadedOrUndefined(me.value)?.root?.filters?.indexOf(filter);
    if (index !== undefined && index >= 0) {
      getLoadedOrUndefined(me.value)?.root?.filters?.$jazz?.set(index, updatedFilter);
    }
  }
}

async function remove(filter: FilterType) {
  if (confirm(`Are you sure you want to delete the filter ${filter.name}? This action cannot be undone.`)) {
    getLoadedOrUndefined(me.value)?.root?.filters?.$jazz?.remove((f) => f.name === filter.name);
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
          <div v-for="filter in me?.root?.filters" :key="filter.name" class="grid grid-cols-[1fr_48px_70px] gap-4">
            <p>{{ filter.name }}</p>
            <UButton @click="edit(filter)">Edit</UButton>
            <UButton @click="remove(filter)">Remove</UButton>
          </div>
        </div>
        <UButton @click="createNew">New</UButton>
      </div>
    </div>
  </UDashboardPanel>
</template>
