<script setup lang="ts">
import { Filter, type FilterType, Condition } from "~/jazz/schema";

const {
  filter = {
    name: "New Filter",
    match: "all",
    conditions: [{ field: "subject", operator: "contains", value: "" }],
    actions: [{ type: "move to folder", value: "" }],
  },
} = defineProps<{
  filter: FilterType;
}>();

const state = reactive<FilterType>(JSON.parse(JSON.stringify(filter)));

const emit = defineEmits<{
  close: [FilterType?];
}>();

function insertCondition(idx: number) {
  state.conditions?.splice(idx + 1, 0, { field: "subject", operator: "contains", value: "" });
}
function deleteCondition(idx: number) {
  state.conditions?.splice(idx, 1);
}

function insertAction(idx: number) {
  state.actions?.splice(idx + 1, 0, { type: "move to folder", value: "" });
}
function deleteAction(idx: number) {
  state.actions?.splice(idx, 1);
}
</script>

<template>
  <UModal>
    <template #content>
      <UForm :schema="Filter" :state="state" class="space-y-4 p-4 overflow-y-auto" @submit="emit('close', $event.data)">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" class="w-48" />
        </UFormField>

        <URadioGroup
          v-model="state.match"
          legend="Match"
          :items="[...Filter.shape.match.values]"
          orientation="horizontal"
        />

        <UCard variant="outline" :class="[state.match === 'always' && 'opacity-50 pointer-events-none']">
          <div class="space-y-4">
            <div v-for="(condition, idx) in state.conditions" class="flex gap-4">
              <USelect
                label="Field"
                v-model="condition.field"
                :items="[...Condition.shape.field.values]"
                class="flex-grow"
              />
              <USelect
                label="Operator"
                v-model="condition.operator"
                :items="[...Condition.shape.operator.values]"
                class="flex-grow"
              />
              <UInput label="Value" v-model="condition.value" class="flex-grow" />

              <UButton icon="i-lucide-plus" size="md" color="primary" variant="solid" @click="insertCondition(idx)" />
              <UButton
                :disabled="state.conditions!.length == 1"
                icon="i-lucide-minus"
                size="md"
                color="primary"
                variant="solid"
                @click="deleteCondition(idx)"
              />
            </div>
          </div>
        </UCard>

        <div class="font-medium text-default text-sm">Actions</div>
        <UCard variant="outline">
          <div class="space-y-4">
            <div v-for="(action, idx) in state.actions" class="flex gap-4">
              <USelect
                label="Action"
                v-model="action.type"
                :items="[...Filter.shape.actions.element.shape.type.values]"
                class="flex-grow"
              />
              <div v-if="action.type === 'delete'" class="flex-grow" />
              <!-- todo better selector for folder -->
              <UInput v-else label="Value" v-model="action.value" class="flex-grow" />

              <UButton icon="i-lucide-plus" size="md" color="primary" variant="solid" @click="insertAction(idx)" />
              <UButton
                :disabled="state.actions!.length == 1"
                icon="i-lucide-minus"
                size="md"
                color="primary"
                variant="solid"
                @click="deleteAction(idx)"
              />
            </div>
          </div>
        </UCard>

        <div class="space-x-2">
          <UButton type="submit"> Save </UButton>
          <UButton color="neutral" @click="emit('close')"> Abort </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
