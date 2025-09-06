import { createTransport } from "nodemailer";

export default defineEventHandler(async () => {
  const transporter = createTransport({
    host: "localhost",
    port: 3025,
    secure: false,
    logger: false,
    auth: {
      user: "test@benndorf.dev",
      pass: "dum",
    },
  });

  return await transporter.sendMail({
    from: {
      name: "Test",
      address: "test@benndorf.dev",
    },
    to: "test2@benndorf.dev",
    subject: "Hello 👋",
    html: "<b>Hello world</b>",
  });
});
