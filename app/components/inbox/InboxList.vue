<script setup lang="ts">
import type { Mail } from "~~/server/services/mail.types";
import RelativeDate from "~/components/RelativeDate.vue";

const props = defineProps<{
  mails: Mail[];
}>();

const router = useRouter();
const route = useRoute("account-folder-mail");
const mailsRefs = ref<Record<string, Element>>({});

const selectedMail = computed({
  get: () => {
    return props.mails.find((mail) => mail.seq === route.params.mail) || null;
  },
  async set(mail: Mail | undefined) {
    if (mail) {
      await router.push(`/${route.params.account}/${route.params.folder}/${mail.seq}`);
    } else {
      await router.push(`/${route.params.account}/${route.params.folder}`);
    }
  },
});

watch(selectedMail, () => {
  if (!selectedMail.value) {
    return;
  }
  const ref = mailsRefs.value[selectedMail.value.seq];
  if (ref) {
    ref.scrollIntoView({ block: "nearest" });
  }
});

defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex((mail) => mail.seq === selectedMail.value?.seq);

    if (index === -1) {
      selectedMail.value = props.mails[0];
    } else if (index < props.mails.length - 1) {
      selectedMail.value = props.mails[index + 1];
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex((mail) => mail.seq === selectedMail.value?.seq);

    if (index === -1) {
      selectedMail.value = props.mails[props.mails.length - 1];
    } else if (index > 0) {
      selectedMail.value = props.mails[index - 1];
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
          mailsRefs[mail.seq] = el as Element;
        }
      "
    >
      <div
        class="p-2 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          !mail.flags.seen ? 'text-highlighted' : 'text-toned',
          selectedMail && selectedMail.seq === mail.seq
            ? 'border-primary bg-primary/10'
            : 'border-(--ui-bg) hover:border-primary hover:bg-primary/5',
        ]"
        @click="selectedMail = mail"
      >
        <div class="flex items-center justify-between" :class="[!mail.flags.seen && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ mail.from[0]?.name }} <{{ mail.from[0]?.address }}>

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
