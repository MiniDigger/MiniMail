import { watchConfig } from "c12";
import type { Config } from "./config.types";

let config = null as Config | null;

export default defineNitroPlugin(async (nitro) => {
  async function loadConfig(loadedConfig: Config) {
    config = loadedConfig;
    console.log("loaded config", config);
    await nitro.hooks.callHook("minimail:config", config);
  }

  const { config: loadedConfig } = await watchConfig<Config>({
    name: "minimail",
    configFileRequired: true,
    async onUpdate({ newConfig: { config: loadedConfig } }) {
      await loadConfig(loadedConfig);
    },
  });
  await loadConfig(loadedConfig);
});
