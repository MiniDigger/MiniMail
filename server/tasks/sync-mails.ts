import { useJazzWorker } from "~~/server/services/jazz";
import { getMails } from "~~/server/services/mail";
import { Mail } from "#shared/schema";

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
          const mails = await getMails({ user: account.username, pass: account.password }, [
            folder.name,
            ...folder.path,
          ]);
          mails.forEach((mail) => {
            if (folder.mailIndex.$jazz.has(mail.messageId)) {
              // TODO update existing mail
              console.log("update existing mail", mail);
            } else {
              console.log("create comail");
              const coMail = Mail.create(mail, { unique: mail.messageId, owner: folder.$jazz.owner });
              folder.mails.$jazz.push(coMail);
              folder.mailIndex.$jazz.set(mail.messageId, coMail);
            }
          });
          console.log(`Folder ${folder.name} has ${mails.length} mails`);
        });
      });
    });

    return { result: "Success" };
  },
});
