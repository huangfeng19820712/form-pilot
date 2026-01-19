import type { FormAdapter, FormRuntime, ValidationResult } from "../types/index.js";
import type { ValidateOptions } from "./types.js";

export async function validate<I>(runtime: FormRuntime<I>, options: ValidateOptions = {}): Promise<ValidationResult> {
  if (runtime.hooks?.beforeValidate) {
    await runtime.hooks.beforeValidate({ instance: runtime.instance, fieldIds: options.fieldIds });
  }
  const adapter: FormAdapter<I> = runtime.adapter;
  return adapter.validate(runtime.instance, options.fieldIds);
}