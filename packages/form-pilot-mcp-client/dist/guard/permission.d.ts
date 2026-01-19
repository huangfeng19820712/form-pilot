import type { FieldGuardConfig } from "../types/index.js";
export declare function filterAllowedValues(values: Record<string, unknown>, guard?: FieldGuardConfig): {
    allowed: Record<string, unknown>;
    blockedFields: string[];
};
