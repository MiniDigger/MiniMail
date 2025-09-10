import { co, z } from "jazz-tools";

export const MyStuff = co.map({
  counter: z.number(),
});

export const UserAccount = co
  .account({
    root: MyStuff,
    profile: co.profile(),
  })
  .withMigration(async (account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        counter: 0,
      });
    }
  });
