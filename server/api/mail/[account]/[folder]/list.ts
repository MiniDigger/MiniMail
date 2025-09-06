import { getMails } from "~~/server/services/mail";

export default defineEventHandler(async (event) => {
  // TODO fetch from db here, maybe do the prisma query in the frontend
  return await getMails(
    { user: event.context.params?.account!, pass: "dum" },
    event.context.params?.folder!.split(".")!
  );
});
