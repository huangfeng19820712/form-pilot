import type { FormAdapter } from "../types/index.js";

export type AdapterCapability =
  | "schema"
  | "values"
  | "validate"
  | "submit";

export interface AdapterDescriptor<I = unknown> {
  id: string;
  capabilities: AdapterCapability[];
  create: () => FormAdapter<I>;
}