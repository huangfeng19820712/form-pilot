import type { FormLifecycleHooks } from "../types/index.js";

export type PartialHooks<I = unknown> = Partial<FormLifecycleHooks<I>>;