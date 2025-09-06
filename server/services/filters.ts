import type { Filter } from "./filters.types";

let filters: Filter[] = [];

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("minimail:config", (config) => {
    filters = config.filters;
    console.log("loaded filters", filters);
  });
});

export function runFilters() {
  for (const filter of filters) {
    console.log(filter);
  }
}
