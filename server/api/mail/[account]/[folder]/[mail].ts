import { getMail } from "~~/server/services/mail";

export default defineEventHandler(async (event) => {
  // TODO fetch from db here, maybe do the prisma query in the frontend
  return await getMail(
    { user: event.context.params?.account!, pass: "dum" },
    event.context.params?.folder!.split(".")!,
    event.context.params?.mail!,
    "text/plain"
  );
});
