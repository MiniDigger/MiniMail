import webpush from "web-push";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  webpush.setVapidDetails("https://minimail.benndorf.dev", config.public.webPushPublicKey, config.webPushPrivateKey);
  const payload = JSON.stringify({
    title: "This is a test",
    content: "This is a test!",
  });
  const test = await webpush.sendNotification(
    {
      endpoint:
        "https://wns2-am3p.notify.windows.com/w/?token=BQYAAABUxUmA58iBn0phVdhGT%2fud4j%2fcQuzzpTJV7iKwSMjMHZ7L4AH755bGJJHWYZ5YrMNwESDMNKTuPB5kwkmNLP0UAZdEhEB%2bcpJWdizmSwdNQkw5fOc2DcKheopQDHk2HboSRac9i%2fjwMfVumqssAoqiLPdrmr%2fLhqt2siEZ1Nf8N6y%2bMN78OeTAv8aXLNtqWvHohEA57f%2fYYKq%2bpfQWamp48Yn9Mp6JA3zmj%2b7d%2fFc7x4JIcTAU%2fJhcVynDxrMmdZdwvwifZ8XvF4ENdOXhxIbDVBkx3krJTujEyRy6phDHVhvMYof4rKxW5o%2fh8Fg%2bLi8%3d",
      expirationTime: null,
      keys: {
        p256dh: "BKZ3ih5I2wVkUGdOc1lURGUox1fja16DhnYrH_5_rhrTZSISla5l_8DvV4nW7fXdllk_SSHFRXsSX82pHhswxfI",
        auth: "XFn3RymvfRWcy9n5wG--Bw",
      },
    },
    payload,
    {
      urgency: "high",
    }
  );
  return test;
});
