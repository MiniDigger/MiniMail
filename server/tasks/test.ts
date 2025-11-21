import { startWorker } from "jazz-tools/worker";
import { MiniMailRoot, WorkerAccount } from "#shared/schema";
import webpush from "web-push";
import { useJazzWorker } from "~~/server/services/jazz";

export default defineTask({
  meta: {
    name: "test",
    description: "test",
  },
  async run({ payload, context }) {
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
    test?.devices?.forEach((d) => {
      webpush.setVapidDetails(
        "https://minimail.benndorf.dev",
        config.public.webPushPublicKey,
        config.webPushPrivateKey
      );

      webpush.sendNotification(d!.pushRegistration, JSON.stringify({ title: "woo", content: "woooooooo" }), {
        urgency: "high",
      });
    });

    return { result: test };
  },
});
