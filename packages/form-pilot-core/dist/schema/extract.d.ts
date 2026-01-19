import type { FormAdapter, FormSchema } from "../types/index.js";
export declare function extractSchema<I>(adapter: FormAdapter<I>, instance: I): FormSchema;
