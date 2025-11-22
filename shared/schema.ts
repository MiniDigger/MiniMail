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

export const Folder = co.map({
  name: z.string(),
  path: z.array(z.string()),
});
export type FolderType = co.loaded<typeof Folder>;

export const Account = co
  .map({
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
    folders: co.list(Folder),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("folders")) {
      account.$jazz.set("folders", []);
    }
  });
export type AccountType = co.loaded<typeof Account>;

export const Device = co.map({
  name: z.string(),
  pushRegistration: z.object({
    endpoint: z.optional(z.string()),
    expirationTime: z.optional(z.number()),
    keys: z.optional(z.record(z.string(), z.string())),
  }),
});
export type DeviceType = co.loaded<typeof Device>;

export const MiniMailRoot = co
  .map({
    filters: co.list(Filter),
    accounts: co.list(Account),
    devices: co.list(Device),
    settings: Settings,
    enabled: z.boolean(),
  })
  .withMigration((root) => {
    if (!root.$jazz.has("filters")) {
      root.$jazz.set("filters", []);
    }
    if (!root.$jazz.has("accounts")) {
      root.$jazz.set("accounts", []);
    }
    if (!root.$jazz.has("devices")) {
      root.$jazz.set("devices", []);
    }
    if (!root.$jazz.has("settings")) {
      root.$jazz.set("settings", {
        colorMode: "system",
        primaryColor: "blue",
        neutralColor: "slate",
      });
    }
    if (!root.$jazz.has("enabled")) {
      root.$jazz.set("enabled", false);
    }

    const {
      public: { workerAccountID },
    } = useRuntimeConfig();
    // make sure server worker can access everything
    if (!root.$jazz.owner.getDirectMembers().find((m) => m.id === workerAccountID)) {
      co.account()
        .load(workerAccountID)
        .then((workerAccount) => {
          if (workerAccount?.$isLoaded) {
            root.$jazz.owner.addMember(workerAccount, "writer");
          } else {
            console.warn("worker account not found", workerAccountID);
          }
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
        devices: [],
        settings: {
          colorMode: "system",
          primaryColor: "blue",
          neutralColor: "slate",
        },
        enabled: false,
      });
    }
  });

export const UserStatusMessage = co.map({
  status: z.boolean(),
});

export const MiniMailUser = co.map({
  name: z.string(),
  id: z.string(),
  data: MiniMailRoot,
});

export const WorkerRoot = co
  .map({
    users: co.list(MiniMailUser),
  })
  .withMigration((root) => {
    if (!root.$jazz.has("users")) {
      root.$jazz.set("users", []);
    }
  });

export const WorkerAccount = co.account({ root: WorkerRoot, profile: co.profile() }).withMigration(async (account) => {
  if (!account.$jazz.has("root")) {
    account.$jazz.set("root", {
      users: [],
    });
  }
});
export type WorkerAccountLoaded = co.loaded<typeof WorkerAccount>;
