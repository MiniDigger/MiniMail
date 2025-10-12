export const selectedAccount = ref<string>();
export const selectedFolder = ref<{
  name: string;
  path: string[];
}>();
export const selectedFolderAsString = computed(() => {
  if (!selectedFolder.value) return undefined;
  return [...selectedFolder.value.path, selectedFolder.value.name].join(".");
});
export const selectedMailId = ref<number>();
