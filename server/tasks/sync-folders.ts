import { useJazzWorker } from "~~/server/services/jazz";
import { getFolders } from "~~/server/services/mail";

export default defineTask({
  meta: {
    name: "sync-folders",
    description: "Sync folders from imap to jazz",
  },
  async run() {
    console.log("Sync folders");
    const pendingWorker = await useJazzWorker();
    const worker = await pendingWorker.$jazz.ensureLoaded({
      resolve: { root: { users: { $each: { data: { accounts: { $each: { folders: { $each: true } } } } } } } },
    });

    if (!worker.$isLoaded || !worker.root.$isLoaded || !worker.root.users.$isLoaded) {
      throw new Error("Jazz worker failed to load");
    }

    worker.root.users.forEach((user) => {
      user.data.accounts.forEach(async (account) => {
        const actualFolders = await getFolders({ user: account.username, pass: account.password });
        account.folders.$jazz.applyDiff(actualFolders);
      });
    });

    return { result: "Success" };
  },
});
