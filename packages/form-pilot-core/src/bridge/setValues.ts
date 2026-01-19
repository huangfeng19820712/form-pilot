import type { FormAdapter, FormRuntime } from "../types/index.js";
import type { SetValuesOptions } from "../types/index.js";

export async function setValues<I>(runtime: FormRuntime<I>, values: Record<string, unknown>, options?: SetValuesOptions): Promise<void> {
  if (runtime.hooks?.beforeSet) {
    await runtime.hooks.beforeSet({ instance: runtime.instance, next: values });
  }
  const adapter: FormAdapter<I> = runtime.adapter;
  adapter.setValues(runtime.instance, values, options);
  if (runtime.hooks?.afterSet) {
    await runtime.hooks.afterSet({ instance: runtime.instance, values });
  }
}