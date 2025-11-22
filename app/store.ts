import type { AccountType, FolderType, MailType } from "#shared/schema";

export const selectedAccount = ref<AccountType>();
export const selectedFolder = ref<FolderType>();
export const selectedFolderAsString = computed(() => {
  if (!selectedFolder.value) return undefined;
  return [...selectedFolder.value.path, selectedFolder.value.name].join(".");
});
export const selectedMail = ref<MailType>();
