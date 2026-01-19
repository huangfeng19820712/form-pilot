import type { FormAdapter, FormSchema } from "../types/index.js";

// Extraction is delegated to the adapter to avoid leaking UI specifics into core
export function extractSchema<I>(adapter: FormAdapter<I>, instance: I): FormSchema {
  const schema = adapter.extractSchema(instance);
  return schema;
}