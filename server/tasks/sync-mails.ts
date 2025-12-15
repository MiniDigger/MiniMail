import { useJazzWorker } from "~~/server/services/jazz";
import { getMail, getMails } from "~~/server/services/mail";
import { Mail, MailContent } from "#shared/schema";

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
          const mailAccount = { user: account.username, pass: account.password };
          const path = [folder.name, ...folder.path];
          const mails = await getMails(mailAccount, path);
          for (const mail of mails) {
            if (folder.mailIndex.$jazz.has(mail.messageId)) {
              // TODO update existing mail
              console.log("update existing mail", mail.subject, mail.messageId);

              const coMail = await Mail.loadUnique(mail.messageId, folder.$jazz.owner.$jazz.id, {
                loadAs: worker,
                resolve: { content: { $each: true } },
              });
              getMail(mailAccount, path, mail.seq, "text/html").then((mailContent) => {
                console.log("got mail content for", mail.subject, mail.messageId);
                if (!coMail || !coMail.$isLoaded) {
                  console.log("Failed to load existing mail for update:", mail.messageId);
                  return;
                }
                coMail?.content.$jazz.set("html", mailContent?.body || "");
              });
            } else {
              console.log("create new mail");
              const coMail = Mail.create(mail, { unique: mail.messageId, owner: folder.$jazz.owner });
              folder.mails.$jazz.push(coMail);
              folder.mailIndex.$jazz.set(mail.messageId, coMail);
              getMail(mailAccount, path, mail.seq).then((mailContent) => {
                console.log("got mail content for", mail.subject, mail.messageId, mailContent?.body);
                coMail.content.$jazz.set("text", mailContent?.body || "");
              });
            }
          }
          console.log(`Folder ${folder.name} has ${mails.length} mails`);
        });
      });
    });

    return { result: "Success" };
  },
});
