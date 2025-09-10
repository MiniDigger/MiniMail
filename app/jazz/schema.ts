import { co, z } from "jazz-tools";

export const Action = z.object({
  type: z.literal(["move to folder", "mark as", "delete", "flag"]),
  value: z.string().optional(),
});
export type ActionType = z.infer<typeof Action>;

export const Condition = z.object({
  field: z.literal(["subject", "from", "to", "cc", "bcc", "body", "date", "size", "priority", "status"]),
  operator: z.literal(["contains", "does not contain", "is", "is not", "begins with", "ends with", "regex"]),
  value: z.string(),
});
export type ConditionType = z.infer<typeof Condition>;

export const Filter = z.object({
  name: z.string(),
  match: z.literal(["any", "all", "always"]),
  conditions: z.array(Condition),
  actions: z.array(Action),
});
export type FilterType = z.infer<typeof Filter>;

export const Account = co.map({
  name: z.string(),
  email: z.string(),
});

export const MiniMailRoot = co.map({
  filters: co.list(Filter),
  accounts: co.list(Account),
});

export const UserAccount = co
  .account({
    root: MiniMailRoot,
    profile: co.profile(),
  })
  .withMigration(async (account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        filters: [],
        accounts: [],
      });
    }
  });
