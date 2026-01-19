import type { FieldGuardConfig } from "../types/index.js";

export function filterAllowedValues(values: Record<string, unknown>, guard?: FieldGuardConfig): {
  allowed: Record<string, unknown>;
  blockedFields: string[];
} {
  if (!guard?.allowedFields || guard.allowedFields.length === 0) {
    return { allowed: { ...values }, blockedFields: [] };
  }
  const allowed: Record<string, unknown> = {};
  const blocked: string[] = [];
  for (const [key, val] of Object.entries(values)) {
    if (guard.allowedFields.includes(key)) {
      if (!guard.canWrite || guard.canWrite(key, val)) {
        allowed[key] = val;
      } else {
        blocked.push(key);
      }
    } else {
      blocked.push(key);
    }
  }
  return { allowed, blockedFields: blocked };
}