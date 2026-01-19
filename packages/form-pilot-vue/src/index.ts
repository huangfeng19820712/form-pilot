import { isVue2 } from "vue-demi";
import type { AiFormHandle, UseAiFormOptions, FormPilotPluginOptions } from "./shared/types.js";
import * as v2 from "./vue2/useAiForm.js";
import * as v3 from "./vue3/useAiForm.js";
import { FormPilotPlugin as V2Plugin } from "./vue2/install.js";
import { FormPilotPlugin as V3Plugin } from "./vue3/install.js";

export function useAiForm<I = unknown>(formRef: any, options: UseAiFormOptions<I> = {}): AiFormHandle {
  return isVue2 ? v2.useAiForm<I>(formRef, options) : v3.useAiForm<I>(formRef, options);
}

export const FormPilotPlugin = isVue2 ? V2Plugin : V3Plugin;

export type { UseAiFormOptions, AiFormHandle, FormPilotPluginOptions };