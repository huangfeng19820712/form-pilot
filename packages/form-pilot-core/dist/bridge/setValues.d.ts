import type { FormRuntime } from "../types/index.js";
import type { SetValuesOptions } from "../types/index.js";
export declare function setValues<I>(runtime: FormRuntime<I>, values: Record<string, unknown>, options?: SetValuesOptions): Promise<void>;
