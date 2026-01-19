import type { FormAdapter, FormRuntime } from "../types/index.js";

export function getValues<I>(runtime: FormRuntime<I>): Record<string, unknown> {
  const adapter: FormAdapter<I> = runtime.adapter;
  return adapter.getValues(runtime.instance);
}