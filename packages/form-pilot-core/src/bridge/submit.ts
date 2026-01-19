import type { FormAdapter, FormRuntime, SubmitResult } from "../types/index.js";

export async function submit<I>(runtime: FormRuntime<I>): Promise<SubmitResult> {
  if (runtime.hooks?.beforeSubmit) {
    await runtime.hooks.beforeSubmit({ instance: runtime.instance });
  }
  const adapter: FormAdapter<I> = runtime.adapter;
  return adapter.submit(runtime.instance);
}