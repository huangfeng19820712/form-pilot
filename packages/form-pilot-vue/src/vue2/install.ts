import type { FormPilotPluginOptions } from "../shared/types.js";
import { setGlobalConfig } from "../shared/utils.js";

export const FormPilotPlugin: { install: (Vue: any, options?: FormPilotPluginOptions<any>) => void } = {
  install(Vue: any, options?: FormPilotPluginOptions<any>) {
    if (options?.adapters && options.adapters.length) {
      setGlobalConfig({ adapters: options.adapters, hooks: options.hooks });
    }
  },
};