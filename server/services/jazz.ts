import { startWorker } from "jazz-tools/worker";
import type { WorkerAccountLoaded } from "#shared/schema";
import { UserAccount, UserStatusMessage, WorkerAccount } from "#shared/schema";
import { getLoadedOrUndefined } from "jazz-tools";

export default defineNitroPlugin(async (nitroApp) => {
  const worker = await useJazzWorker();
  const inbox = await useJazzInbox();

  nitroApp.hooks.hook("request", (event) => {
    console.log("on request", event.path);
    event.context.jazzWorker = worker;
  });

  nitroApp.hooks.hook("close", async () => {
    await (await loadJazz()).shutdownWorker();
  });

  inbox.subscribe(UserStatusMessage, async (message, senderId) => {
    console.log("got inbox message from", senderId, message);
    const sender = await UserAccount.load(senderId, { loadAs: worker, resolve: { root: true } });

    if (!sender?.$isLoaded) {
      console.warn(`Sender account ${senderId} not found`);
      return;
    }

    const loadedWorker = await worker.$jazz.ensureLoaded({ resolve: { root: { users: { $each: true } } } });

    if (message.status) {
      console.log(`User ${senderId} is enabled`, sender.root);
      loadedWorker.root?.users?.$jazz?.push({ name: senderId, data: sender.root });
      sender.root?.$jazz?.set("enabled", true);
    } else {
      console.log(`User ${senderId} is disabled`);
      loadedWorker.root?.users?.$jazz?.remove((u) => getLoadedOrUndefined(u)?.name === senderId);
      sender.root?.$jazz?.set("enabled", false);
    }
  });
});

declare module "h3" {
  interface H3EventContext {
    jazzWorker: WorkerAccountLoaded;
  }
}

// TODO remove and add to task context instead if tasks get hooks
let jazzWorker: Awaited<ReturnType<typeof startWorker<typeof WorkerAccount>>>;

export async function useJazzWorker() {
  return (await loadJazz()).worker;
}

export async function useJazzInbox() {
  return (await loadJazz()).experimental.inbox;
}

async function loadJazz() {
  if (!jazzWorker) {
    const {
      workerSecret,
      public: { jazzServerUrl, jazzApiKey, workerAccountID },
    } = useRuntimeConfig();
    const peer = jazzServerUrl + (jazzApiKey ? `?key=${jazzApiKey}` : "");

    jazzWorker = await startWorker({
      AccountSchema: WorkerAccount,
      syncServer: peer,
      accountID: workerAccountID,
      accountSecret: workerSecret,
    });
  }
  return jazzWorker;
}
