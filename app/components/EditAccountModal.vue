<script lang="ts" setup>
import { type AccountType, Account } from "#shared/schema";

const {
  account = {
    name: "New Account",
    email: "dummy@test",
  },
} = defineProps<{
  account?: AccountType;
}>();
const state = reactive<AccountType>(JSON.parse(JSON.stringify(toRaw(account))));

const emit = defineEmits<{
  close: [AccountType?];
}>();
</script>

<template>
  <UModal :title="'Edit Account ' + account?.name + ' (' + account?.email + ')'" description="dum">
    <template #body>
      <UForm
        :schema="Account.getDefinition()"
        :state="state"
        class="space-y-4 p-4 overflow-y-auto"
        @submit="emit('close', $event.data)"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" class="w-48" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-48" />
        </UFormField>

        <UCard>
          <UFormField label="Incoming Server" name="incomingServer">
            <UInput v-model="state.incomingServer" class="w-48" />
          </UFormField>
          <UFormField label="Incoming Port" name="incomingPort">
            <UInput v-model="state.incomingPort" class="w-48" />
          </UFormField>
        </UCard>

        <UCard>
          <UFormField label="Outgoing Server" name="outgoingServer">
            <UInput v-model="state.outgoingServer" class="w-48" />
          </UFormField>
          <UFormField label="Outgoing Port" name="outgoingPort">
            <UInput v-model="state.outgoingPort" class="w-48" />
          </UFormField>
        </UCard>

        <UCard>
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" class="w-48" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" class="w-48" />
          </UFormField>
        </UCard>

        <div class="space-x-2">
          <UButton type="submit"> Save </UButton>
          <UButton color="neutral" @click="emit('close')"> Abort </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
