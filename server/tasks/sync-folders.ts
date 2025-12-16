import { useJazzWorker } from "~~/server/services/jazz";
import { getFolders } from "~~/server/services/mail";
import type { FolderType } from "#shared/schema";
import { Folder, Mail } from "#shared/schema";
import type { CoList } from "jazz-tools";
import { co, getLoadedOrUndefined, z } from "jazz-tools";

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
        const existingFolders = (getLoadedOrUndefined(account.folders) || []) as unknown as CoList<FolderType>;
        const stats = syncFolders(actualFolders, existingFolders);
        console.log("Synced account", account.username, "of user", user.name, ":", stats);
      });
    });

    return { result: "Success" };
  },
});

function syncFolders(imapFolders: { name: string; path: string[] }[], existingFolders: CoList<FolderType>) {
  function buildKey(folder: { name: string; path: string[] }) {
    return folder.path.join("/") + "/" + folder.name;
  }

  const imapKeys = new Set(imapFolders.map(buildKey));
  const jazzFolders = new Map<string, FolderType>();
  for (const folder of existingFolders) {
    if (!folder) continue;
    jazzFolders.set(buildKey(folder), folder);
  }

  const stats = { created: [] as string[], updated: [] as string[], removed: [] as string[] };

  for (const folder of imapFolders) {
    // Create folders that exist on IMAP but not in Jazz
    const key = buildKey(folder);
    if (!jazzFolders.has(key)) {
      stats.created.push(key);
      const coFolder = Folder.create(
        {
          name: folder.name,
          path: folder.path,
          mails: co.list(Mail).create([], { owner: existingFolders.$jazz.owner }),
          mailIndex: co.record(z.string(), Mail).create({}, { owner: existingFolders.$jazz.owner }),
        },
        { owner: existingFolders.$jazz.owner }
      );
      existingFolders.$jazz.push(coFolder);
    } else {
      // TODO update folder?
      stats.updated.push(key);
    }
  }

  // Remove folders that exist in Jazz but not on IMAP
  existingFolders.$jazz.remove((folder) => {
    const key = buildKey(folder);
    if (!imapKeys.has(key)) {
      stats.removed.push(key);
      return true;
    }
    return false;
  });

  return stats;
}
