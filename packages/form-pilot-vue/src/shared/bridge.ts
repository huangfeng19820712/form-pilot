import { createFormRuntime } from "@form-pilot/core";
import { setValues as coreSetValues } from "@form-pilot/core";
import { getValues as coreGetValues } from "@form-pilot/core";
import { validate as coreValidate } from "@form-pilot/core";
import { submit as coreSubmit } from "@form-pilot/core";
import type { AdapterDescriptor } from "@form-pilot/core";
import type { FormLifecycleHooks, FormRuntime, FormSchema } from "@form-pilot/core";
import type { AiFormHandle, UseAiFormOptions } from "./types.js";

function noOpHandle(): AiFormHandle {
  return {
    getSchema: () => ({ fields: [] }),
    setValues: async () => {},
    getValues: () => ({}),
    validate: async () => ({ valid: true, issues: [] }),
    submit: async () => ({ ok: false, error: "Form not mounted" }),
  };
}

export function createHandle<I>(runtime?: FormRuntime<I>): AiFormHandle {
  if (!runtime) return noOpHandle();
  return {
    getSchema: () => runtime.schema as FormSchema,
    setValues: async (values) => {
      await coreSetValues(runtime, values);
    },
    getValues: () => coreGetValues(runtime),
    validate: async () => coreValidate(runtime),
    submit: async () => coreSubmit(runtime),
  };
}

export function buildRuntime<I>(instance: I, adapters: AdapterDescriptor<I>[], hooks?: FormLifecycleHooks<I>): FormRuntime<I> {
  return createFormRuntime(instance, { adapters, hooks });
}

export function mergeAdapters<I>(optsAdapters?: AdapterDescriptor<I>[], globalAdapters?: AdapterDescriptor<I>[]): AdapterDescriptor<I>[] {
  if (optsAdapters && optsAdapters.length) return optsAdapters;
  return globalAdapters ?? [];
}

export function finalizeHandle<I>(instance: I | undefined, options: UseAiFormOptions<I>, globalAdapters?: AdapterDescriptor<I>[]): AiFormHandle {
  if (!instance) return noOpHandle();
  const adapters = mergeAdapters(options.adapters, globalAdapters);
  const runtime = buildRuntime(instance, adapters, options.hooks);
  return createHandle(runtime);
}