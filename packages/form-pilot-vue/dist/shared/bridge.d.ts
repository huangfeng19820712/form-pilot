import type { AdapterDescriptor } from "@fhuang/form-pilot-core";
import type { FormLifecycleHooks, FormRuntime } from "@fhuang/form-pilot-core";
import type { AiFormHandle, UseAiFormOptions } from "./types.js";
export declare function createHandle<I>(runtime?: FormRuntime<I>): AiFormHandle;
export declare function buildRuntime<I>(instance: I, adapters: AdapterDescriptor<I>[], hooks?: FormLifecycleHooks<I>): FormRuntime<I>;
export declare function mergeAdapters<I>(optsAdapters?: AdapterDescriptor<I>[], globalAdapters?: AdapterDescriptor<I>[]): AdapterDescriptor<I>[];
export declare function finalizeHandle<I>(instance: I | undefined, options: UseAiFormOptions<I>, globalAdapters?: AdapterDescriptor<I>[]): AiFormHandle;
