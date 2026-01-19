import type { FormLifecycleHooks } from "../types/index.js";
import type { PartialHooks } from "./types.js";
export declare function createHooks<I>(hooks?: PartialHooks<I>): FormLifecycleHooks<I>;
