import type { Config } from "../server/services/config.types";

export default {
  filters: [
    {
      id: "example",
      match: "any",
      conditions: [
        {
          field: "subject",
          modifier: "contains",
          value: "MoveMe",
        },
      ],
      actions: [
        {
          type: "move to folder",
          value: "test@benndorf.dev/Test",
        },
      ],
      inboxes: "global",
    },
  ],
} satisfies Config;
