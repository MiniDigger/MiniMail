<script setup lang="ts">
import type { Mail } from "~~/server/services/mail.types";
import RelativeDate from "~/components/RelativeDate.vue";

defineProps<{
  mail: Mail;
}>();

const router = useRouter();
const route = useRoute();

const dropdownItems = [
  [
    {
      label: "Mark as unread",
      icon: "i-lucide-check-circle",
    },
    {
      label: "Mark as important",
      icon: "i-lucide-triangle-alert",
    },
  ],
  [
    {
      label: "Star thread",
      icon: "i-lucide-star",
    },
    {
      label: "Mute thread",
      icon: "i-lucide-circle-pause",
    },
  ],
];

const toast = useToast();

const reply = ref("");
const loading = ref(false);

function onSubmit() {
  loading.value = true;

  setTimeout(() => {
    reply.value = "";

    toast.add({
      title: "Email sent",
      description: "Your email has been sent successfully",
      icon: "i-lucide-check-circle",
      color: "success",
    });

    loading.value = false;
  }, 1000);
}

async function close() {
  await router.push(`/mail/${route.params.account}/${route.params.folder}`);
}
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="mail.subject" :toggle="false">
      <template #leading>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="-ms-1.5" @click="close" />
      </template>

      <template #right>
        <UTooltip text="Archive">
          <UButton icon="i-lucide-inbox" color="neutral" variant="ghost" />
        </UTooltip>

        <UTooltip text="Reply">
          <UButton icon="i-lucide-reply" color="neutral" variant="ghost" />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
      <div class="flex items-start gap-4 sm:my-1.5">
        <div v-for="a in mail.from" :key="a.address" class="min-w-0">
          <p class="font-semibold text-highlighted">
            {{ a.name }}
          </p>
          <p class="text-muted">
            {{ a.address }}
          </p>
        </div>
      </div>

      <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
        <RelativeDate :date="mail.date" />
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
      <p class="whitespace-pre-wrap">
        {{ mail.body }}
      </p>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard variant="subtle" class="mt-auto" :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }">
        <template #header>
          <UIcon name="i-lucide-reply" class="size-5" />

          <template v-if="mail.replyTo.length > 0">
            <span class="text-sm truncate">
              Reply to {{ mail.replyTo[0]?.name }} ({{ mail.replyTo[0]?.address }})
            </span>
          </template>
          <template v-else>
            <span class="text-sm truncate"> Reply to {{ mail.from[0]?.name }} ({{ mail.from[0]?.address }}) </span>
          </template>
        </template>

        <form @submit.prevent="onSubmit">
          <UTextarea
            v-model="reply"
            color="neutral"
            variant="none"
            required
            autoresize
            placeholder="Write your reply..."
            :rows="4"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'p-0 resize-none' }"
          />

          <div class="flex items-center justify-between">
            <UTooltip text="Attach file">
              <UButton color="neutral" variant="ghost" icon="i-lucide-paperclip" />
            </UTooltip>

            <div class="flex items-center justify-end gap-2">
              <UButton color="neutral" variant="ghost" label="Save draft" />
              <UButton type="submit" color="neutral" :loading="loading" label="Send" icon="i-lucide-send" />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
