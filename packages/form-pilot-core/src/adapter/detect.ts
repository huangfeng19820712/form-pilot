import type { FormAdapter } from "../types/index.js";
import type { AdapterDescriptor } from "./types.js";

export function detectAdapter<I>(instance: I, adapters: AdapterDescriptor<I>[]): FormAdapter<I> {
  for (const d of adapters) {
    const adapter = d.create();
    if (adapter.isMatch(instance)) {
      return adapter;
    }
  }
  throw new Error("No compatible form adapter found for the given instance");
}