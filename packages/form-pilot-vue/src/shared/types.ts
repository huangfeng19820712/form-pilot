import type { AdapterDescriptor } from "@huangfeng19820712/core";
import type { FormLifecycleHooks } from "@huangfeng19820712/core";

export interface UseAiFormOptions<I = unknown> {
  id?: string;
  ui?: string;
  adapters?: AdapterDescriptor<I>[];
  hooks?: FormLifecycleHooks<I>;
}

export interface AiFormHandle {
  getSchema: () => { fields: Array<{ id: string; type: string; label?: string; required: boolean }> };
  setValues: (values: Record<string, unknown>) => Promise<void> | void;
  getValues: () => Record<string, unknown>;
  validate: () => Promise<{ valid: boolean; issues: Array<{ fieldId: string; message: string }> }>;
  submit: () => Promise<{ ok: boolean; data?: unknown; error?: unknown }>;
}

export interface FormPilotPluginOptions<I = unknown> {
  adapters: AdapterDescriptor<I>[];
  hooks?: FormLifecycleHooks<I>;
}

export const FORM_PILOT_GLOBAL_KEY = "__form_pilot_global__";

export interface FormPilotGlobalConfig<I = unknown> {
  adapters: AdapterDescriptor<I>[];
  hooks?: FormLifecycleHooks<I>;
}