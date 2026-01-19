import type { FormAdapter, FormLifecycleHooks, FormRuntime, FormSchema } from "../types/index.js";

export interface FormRuntimeContext<I = unknown> extends FormRuntime<I> {
  // Context can carry additional runtime-specific data without polluting core types
}

export function createContext<I>(
  instance: I,
  adapter: FormAdapter<I>,
  schema: FormSchema,
  hooks?: FormLifecycleHooks<I>
): FormRuntimeContext<I> {
  return { instance, adapter, schema, hooks };
}