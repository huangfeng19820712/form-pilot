import type { FieldId, ValidationResult } from "../types/index.js";
export interface ValidateOptions {
    fieldIds?: FieldId[];
}
export interface BridgeValidateResult extends ValidationResult {
}
