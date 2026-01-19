import type { AdapterDescriptor } from "../adapter/types.js";
import type { FormLifecycleHooks, FormRuntime } from "../types/index.js";
export interface CreateFormRuntimeOptions<I = unknown> {
    adapters: AdapterDescriptor<I>[];
    hooks?: FormLifecycleHooks<I>;
}
export declare function createFormRuntime<I>(instance: I, options: CreateFormRuntimeOptions<I>): FormRuntime<I>;
