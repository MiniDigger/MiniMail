<script setup lang="ts">
import { useAccount } from "community-jazz-vue";
import { type FilterType, UserAccount } from "~/jazz/schema";
import { EditFilterModal } from "#components";

const { me } = useAccount(UserAccount);

const overlay = useOverlay();
const modal = overlay.create(EditFilterModal);

async function createNew() {
  const instance = modal.open();
  const filter = await instance.result;
  if (filter) {
    me.value?.root?.filters?.$jazz?.push(filter);
  }
}

async function edit(filter: FilterType) {
  const instance = modal.open({ filter });
  const updatedFilter = await instance.result;
  if (updatedFilter && filter !== updatedFilter) {
    const index = me.value?.root?.filters?.indexOf(filter);
    if (index !== undefined && index >= 0) {
      me.value?.root?.filters?.$jazz?.set(index, updatedFilter);
    }
  }
}

async function remove(filter: FilterType) {
  if (confirm(`Are you sure you want to delete the filter ${filter.name}? This action cannot be undone.`)) {
    me.value?.root?.filters?.$jazz?.remove((f) => f.name === filter.name);
  }
}
</script>

<template>
  <UContainer class="w-128">
    <div class="space-y-4">
      <div v-for="filter in me?.root?.filters" class="grid grid-cols-[1fr_48px_70px] gap-4">
        <p>{{ filter.name }}</p>
        <UButton @click="edit(filter)">Edit</UButton>
        <UButton @click="remove(filter)">Remove</UButton>
      </div>
    </div>
    <UButton @click="createNew">New</UButton>
  </UContainer>
</template>
