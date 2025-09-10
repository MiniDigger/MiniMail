<script setup lang="ts">
import { useAccount } from "community-jazz-vue";
import { Filter, type FilterType, UserAccount } from "~/jazz/schema";
import { EditFilterModal } from "#components";

const { me } = useAccount(UserAccount);

const overlay = useOverlay();
const modal = overlay.create(EditFilterModal);

async function openNewFilterModal() {
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
</script>

<template>
  <UContainer class="w-128">
    <div class="space-y-4">
      <div v-for="filter in me?.root?.filters" class="grid grid-cols-[1fr_48px] gap-4">
        <p>{{ filter.name }}</p>
        <UButton @click="edit(filter)">Edit</UButton>
      </div>
    </div>
    <UButton @click="openNewFilterModal">New</UButton>
  </UContainer>
</template>
