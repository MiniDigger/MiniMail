import webpush from "web-push";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  webpush.setVapidDetails("https://minimail.benndorf.dev", config.public.webPushPublicKey, config.webPushPrivateKey);

  return await webpush.sendNotification(body.registration, JSON.stringify(body.payload), {
    urgency: "high",
  });
});
