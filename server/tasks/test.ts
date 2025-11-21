import { MiniMailRoot } from "#shared/schema";
import webpush, { type PushSubscription } from "web-push";
import { getLoadedOrUndefined } from "jazz-tools";
import { useJazzWorker } from "~~/server/services/jazz";

export default defineTask({
  meta: {
    name: "test",
    description: "test",
  },
  async run() {
    const test = await MiniMailRoot.load("co_zGJK5onTy2jD5CMyrduQym8bnym", {
      loadAs: await useJazzWorker(),
      resolve: {
        filters: {
          $onError: "catch",
        },
        accounts: {
          $each: { $onError: "catch" },
        },
        devices: {
          $each: { $onError: "catch" },
        },
      },
    });

    const config = useRuntimeConfig();
    getLoadedOrUndefined(test)?.devices?.forEach((d) => {
      webpush.setVapidDetails(
        "https://minimail.benndorf.dev",
        config.public.webPushPublicKey,
        config.webPushPrivateKey
      );

      if (!d.$isLoaded) return;

      webpush.sendNotification(
        d.pushRegistration as PushSubscription,
        JSON.stringify({ title: "woo", content: "woooooooo" }),
        {
          urgency: "high",
        }
      );
    });

    return { result: test };
  },
});
