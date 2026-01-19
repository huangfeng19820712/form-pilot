import type { Plugin } from "vue-demi";
import type { FormPilotPluginOptions } from "../shared/types.js";
import { setGlobalConfig } from "../shared/utils.js";

export const FormPilotPlugin: Plugin = {
  install(_app: any, options?: FormPilotPluginOptions<any>) {
    if (options?.adapters && options.adapters.length) {
      setGlobalConfig({ adapters: options.adapters, hooks: options.hooks });
    }
  },
};