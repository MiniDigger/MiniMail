import type { Filter } from "./filters.types";

export interface Config {
  filters: Filter[];
}

declare module "nitropack/types" {
  interface NitroRuntimeHooks {
    "minimail:config": (config: Config) => void;
  }
}
