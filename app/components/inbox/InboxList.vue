<script setup lang="ts">
import RelativeDate from "~/components/RelativeDate.vue";
import { selectedMailId } from "~/store";
import type { MailType } from "#shared/schema";

const props = defineProps<{
  mails: MailType[];
}>();

const mailsRefs = ref<Record<string, Element>>({});

watch(selectedMailId, () => {
  if (!selectedMailId.value) {
    return;
  }
  const ref = mailsRefs.value[selectedMailId.value];
  if (ref) {
    ref.scrollIntoView({ block: "nearest" });
  }
});

defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex((mail) => mail.$jazz.id === selectedMailId.value);

    if (index === -1) {
      selectedMailId.value = props.mails[0]?.$jazz?.id;
    } else if (index < props.mails.length - 1) {
      selectedMailId.value = props.mails[index + 1]?.$jazz?.id;
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex((mail) => mail.$jazz.id === selectedMailId.value);

    if (index === -1) {
      selectedMailId.value = props.mails[props.mails.length - 1]?.$jazz?.id;
    } else if (index > 0) {
      selectedMailId.value = props.mails[index - 1]?.$jazz?.id;
    }
  },
});
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div
      v-for="(mail, index) in mails"
      :key="index"
      :ref="
        (el) => {
          mailsRefs[mail.$jazz.id] = el as Element;
        }
      "
    >
      <div
        class="p-2 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          !mail.flags.seen ? 'text-highlighted' : 'text-toned',
          selectedMailId === mail.$jazz.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5',
        ]"
        @click="selectedMailId = mail.$jazz.id"
      >
        <div class="flex items-center justify-between" :class="[!mail.flags.seen && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ mail.from[0]?.name }} &lt;{{ mail.from[0]?.address }}&gt;

            <UChip v-if="!mail.flags.seen" />
            <!-- todo more flag colors? -->
            <UChip v-if="mail.flags.flagged" :color="mail.flags.flagged === 'red' ? 'error' : 'info'" />
          </div>

          <RelativeDate :date="mail.date" />
        </div>
        <p class="truncate" :class="[!mail.flags.seen && 'font-semibold']">
          {{ mail.subject }}
        </p>
      </div>
    </div>
  </div>
</template>
