import { useJazzWorker } from "~~/server/services/jazz";
import { getMail, getMails } from "~~/server/services/mail";
import { AccountType, FolderType, Mail, MailType, type WorkerAccountLoaded } from "#shared/schema";
import { Mail as ImapMail, MailAccount } from "~~/server/services/mail.types";
import { getLoadedOrUndefined } from "jazz-tools";

export default defineTask({
  meta: {
    name: "sync-mails",
    description: "Sync mails from imap to jazz",
  },
  async run() {
    console.log("Sync mails");
    const pendingWorker = await useJazzWorker();
    const worker = await pendingWorker.$jazz.ensureLoaded({
      resolve: {
        root: {
          users: {
            $each: {
              data: {
                accounts: {
                  $each: {
                    folders: {
                      $each: {
                        mails: { $each: true },
                        mailIndex: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!worker.$isLoaded || !worker.root.$isLoaded || !worker.root.users.$isLoaded) {
      throw new Error("Jazz worker failed to load");
    }

    worker.root.users.forEach((user) => {
      user.data.accounts.forEach((account) => {
        account.folders.forEach(async (folder) => {
          try {
            const stats = await syncFolder(account, folder, worker);
            console.log("Synced folder", folder.name, "of account", account.username, "of user", user.name, ":", stats);
          } catch (err) {
            console.error("Failed to sync folder", folder.name, err);
          }
        });
      });
    });

    return { result: "Success" };
  },
});

async function syncFolder(account: AccountType, folder: FolderType, worker: WorkerAccountLoaded) {
  if (!folder.mails.$isLoaded || !folder.mailIndex.$isLoaded) {
    console.log("Folder mails or mailIndex not loaded, skipping:", folder.name);
    return;
  }

  const mailAccount = { user: account.username, pass: account.password };
  const path = [folder.name, ...folder.path];
  const imapMails = await getMails(mailAccount, path);

  const imapIds = new Set(imapMails.map((m) => m.messageId));

  const stats = { created: [] as string[], updated: [] as string[], removed: [] as string[] };

  // Remove mails that exist in Jazz but not on IMAP anymore
  folder.mails.$jazz.remove((mail) => {
    const key = getLoadedOrUndefined(mail)!.messageId;
    if (!imapIds.has(key)) {
      stats.removed.push(key);
      if (!folder.mailIndex.$isLoaded) return true;
      folder.mailIndex?.$jazz.delete(key);
      return true;
    }
    return false;
  });

  // Create or update mails based on IMAP list
  for (const mail of imapMails) {
    try {
      if (folder.mailIndex.$jazz.has(mail.messageId)) {
        // update existing mail
        const coMail = await Mail.loadUnique(mail.messageId, folder.$jazz.owner.$jazz.id, {
          loadAs: worker,
          resolve: { content: { $each: true } },
        });

        if (!coMail || !coMail.$isLoaded) {
          console.warn("Failed to load existing mail for update:", mail.messageId);
          continue;
        }

        stats.updated.push(mail.messageId);
        await syncMailContent(coMail, mail, mailAccount, path);
      } else {
        // create new mail
        const coMail = Mail.create(mail, { unique: mail.messageId, owner: folder.$jazz.owner });
        folder.mails.$jazz.push(coMail);
        folder.mailIndex.$jazz.set(mail.messageId, coMail);

        stats.created.push(mail.messageId);
        await syncMailContent(coMail, mail, mailAccount, path);
      }
    } catch (err) {
      console.warn("Failed to create or update mail:", mail.messageId, err);
    }
  }

  return stats;
}

async function syncMailContent(coMail: MailType, mail: ImapMail, mailAccount: MailAccount, path: string[]) {
  const mailContent = await getMail(mailAccount, path, mail.seq);
  const loaded = getLoadedOrUndefined(coMail.content);

  for (const [key, value] of Object.entries(mailContent?.content || {})) {
    if (value) {
      loaded?.$jazz?.set(key, value);
    }
  }
}
