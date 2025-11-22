import type { AccountType } from "#shared/schema";

export const selectedAccount = ref<AccountType>();
export const selectedFolder = ref<{
  name: string;
  path: string[];
}>();
export const selectedFolderAsString = computed(() => {
  if (!selectedFolder.value) return undefined;
  return [...selectedFolder.value.path, selectedFolder.value.name].join(".");
});
export const selectedMailId = ref<number>();
