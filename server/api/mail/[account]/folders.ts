import { getFolders } from "~~/server/services/mail";

export default defineEventHandler(async (event) => {
  // TODO fetch from db here, maybe do the prisma query in the frontend
  return await getFolders({ user: event.context.params?.account!, pass: "dum" });
});
