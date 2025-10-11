export default function (allMail: MaybeRefOrGetter, filter: MaybeRefOrGetter<string>, sort: MaybeRefOrGetter<string>) {
  const mails = computed(() => {
    let input = toValue(allMail);
    const filterValue = toValue(filter);

    if (filterValue === "unread") {
      input = input?.filter((mail) => !!mail.unread);
    }

    // TODO sorters

    return input;
  });

  return mails;
}
