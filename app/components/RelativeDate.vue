<script lang="ts" setup>
defineProps<{
  date: Date;
}>();
</script>

<template>
  <UPopover mode="hover">
    <NuxtTime :datetime="date" date-style="short" time-style="short" />
    <template #content>
      <div class="p-2">
        <NuxtTime :datetime="date" relative />
      </div>
    </template>
  </UPopover>
</template>
