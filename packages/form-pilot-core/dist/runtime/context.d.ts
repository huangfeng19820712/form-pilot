import type { FormAdapter, FormLifecycleHooks, FormRuntime, FormSchema } from "../types/index.js";
export interface FormRuntimeContext<I = unknown> extends FormRuntime<I> {
}
export declare function createContext<I>(instance: I, adapter: FormAdapter<I>, schema: FormSchema, hooks?: FormLifecycleHooks<I>): FormRuntimeContext<I>;
