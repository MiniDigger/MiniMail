import { type FetchMessageObject, ImapFlow, type MessageAddressObject } from "imapflow";
import type { MailAccount, Mail } from "~~/server/services/mail.types";
import { text } from "stream/consumers";

export default defineNitroPlugin(async () => {
  // await fetchMailAccount({ user: "test2@benndorf.dev", pass: "dum" });
});

const clients: Record<string, ImapFlow | undefined> = {};

async function ensureConnected(mailAccount: MailAccount): Promise<ImapFlow> {
  if (clients[mailAccount.user]) {
    const client = clients[mailAccount.user];
    if (!client?.usable) {
      clients[mailAccount.user] = undefined;
      return ensureConnected(mailAccount);
    }
    return client;
  }

  const client = new ImapFlow({
    host: "localhost",
    port: 3143,
    secure: false,
    logger: false,
    auth: {
      user: mailAccount.user,
      pass: mailAccount.pass,
    },
  });

  clients[mailAccount.user] = client;
  await client.connect();
  return client;
}

export async function getFolders(mailAccount: MailAccount) {
  const client = await ensureConnected(mailAccount);

  const folders = await client.list();

  return folders.map((f) => ({
    name: f.name,
    path: f.path.split(f.delimiter).slice(0, -1),
  }));
}

export async function getMails(mailAccount: MailAccount, path: string[]) {
  console.log("Getting mails:", mailAccount.user, path);
  const client = await ensureConnected(mailAccount);

  const mails = [] as Mail[];
  const lock = await client.getMailboxLock(path.join("."));
  try {
    for await (const message of client.fetch("1:*", { all: true })) {
      if (!message.envelope) continue;
      mails.push(mapMessage(message)!);
    }
  } finally {
    lock.release();
  }
  return mails.reverse();
}

export async function getMail(mailAccount: MailAccount, path: string[], seq: string, preferredPart = "text/plain") {
  console.log("Getting mail:", mailAccount.user, path, seq);
  const client = await ensureConnected(mailAccount);
  const lock = await client.getMailboxLock(path.join("."));
  try {
    const message = await client.fetchOne(seq, {
      envelope: true,
      bodyStructure: true,
    });
    if (message && message.envelope) {
      let part = "1";
      if (message.bodyStructure?.type === "multipart/alternative") {
        part = message.bodyStructure.childNodes?.find((n) => n.type === preferredPart)?.part || part;
      }

      const { content } = await client.download(message.uid, part);
      const body = await text(content);
      return {
        ...mapMessage(message),
        body,
      };
    }
    return undefined;
  } finally {
    lock.release();
  }
}

function mapMessage(message: FetchMessageObject): Mail {
  return {
    seq: message.seq,
    flags: mapFlags(message),
    messageId: message.envelope?.messageId?.slice(1, -1) || "-1",
    subject: message.envelope?.subject || "(no subject)",
    date: message.envelope?.date!,
    from: mapAddresses(message.envelope?.from) || [],
    to: mapAddresses(message.envelope?.to) || [],
    replyTo: mapAddresses(message.envelope?.replyTo) || [],
  };
}

function mapFlags(message: FetchMessageObject) {
  if (!message.flags) return { seen: false, flagged: undefined, answered: false };
  return {
    seen: message.flags.has("\\Seen"),
    flagged: message.flags.has("\\Flagged") ? message.flagColor || "red" : undefined,
    answered: message.flags.has("\\Answered"),
  };
}

function mapAddresses(addresses: MessageAddressObject[] | undefined) {
  return addresses?.map((a) => ({ name: a.name!, address: a.address! }));
}
