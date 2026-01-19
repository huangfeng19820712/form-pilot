import type { AdapterDescriptor } from "../adapter/types.js";
import { detectAdapter } from "../adapter/detect.js";
import { extractSchema } from "../schema/extract.js";
import { normalizeSchema } from "../schema/normalize.js";
import { createContext } from "./context.js";
import type { FormLifecycleHooks, FormRuntime } from "../types/index.js";

export interface CreateFormRuntimeOptions<I = unknown> {
  adapters: AdapterDescriptor<I>[];
  hooks?: FormLifecycleHooks<I>;
}

export function createFormRuntime<I>(instance: I, options: CreateFormRuntimeOptions<I>): FormRuntime<I> {
  const adapter = detectAdapter(instance, options.adapters);
  const rawSchema = extractSchema(adapter, instance);
  const schema = normalizeSchema(rawSchema);
  return createContext(instance, adapter, schema, options.hooks);
}