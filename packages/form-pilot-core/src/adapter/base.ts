import type { AdapterDescriptor } from "./types.js";

// Lightweight helper to describe adapters by capability for runtime detection
export function defineAdapter<I>(descriptor: AdapterDescriptor<I>): AdapterDescriptor<I> {
  return descriptor;
}