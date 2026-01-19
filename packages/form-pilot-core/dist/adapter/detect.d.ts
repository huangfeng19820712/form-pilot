import type { FormAdapter } from "../types/index.js";
import type { AdapterDescriptor } from "./types.js";
export declare function detectAdapter<I>(instance: I, adapters: AdapterDescriptor<I>[]): FormAdapter<I>;
