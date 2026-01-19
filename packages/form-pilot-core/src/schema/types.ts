import type { FormSchema, FormFieldSchema, FormFieldType } from "../types/index.js";

export interface NormalizationOptions {
  // Allows custom field id strategies while keeping defaults deterministic
  fieldIdStrategy?: (field: FormFieldSchema, index: number) => string;
  defaultType?: FormFieldType;
}

export interface SchemaWithIndex extends FormSchema {
  // Internal helper for normalization routines
}