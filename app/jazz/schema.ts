import { co, z } from "jazz-tools";

export const Settings = co.map({
  colorMode: z.literal(["light", "dark", "system"]),
  primaryColor: z.string(),
  neutralColor: z.string(),
});

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
  incomingServer: z.string(),
  incomingPort: z.number(),
  incomingSecurity: z.literal(["ssl", "starttls", "none"]),
  outgoingServer: z.string(),
  outgoingPort: z.number(),
  outgoingSecurity: z.literal(["ssl", "starttls", "none"]),
  username: z.string(),
  password: z.string(), // TODO how to do this better?
});
export type AccountType = z.infer<typeof Account>;
export type AccountLoaded = co.loaded<typeof Account>;

export const MiniMailRoot = co
  .map({
    filters: co.list(Filter),
    accounts: co.list(Account),
    settings: Settings,
  })
  .withMigration((root) => {
    if (!root.$jazz.has("filters")) {
      root.$jazz.set("filters", []);
    }
    if (!root.$jazz.has("accounts")) {
      root.$jazz.set("accounts", []);
    }
    if (!root.$jazz.has("settings")) {
      root.$jazz.set("settings", {
        colorMode: "system",
        primaryColor: "blue",
        neutralColor: "slate",
      });
    }
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
