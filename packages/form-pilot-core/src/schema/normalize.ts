import type { FormFieldSchema, FormFieldType, FormSchema } from "../types/index.js";
import type { NormalizationOptions } from "./types.js";

function defaultFieldIdStrategy(field: FormFieldSchema, index: number): string {
  // Ensures stable identifiers even when UI libraries omit them
  return field.id || `field_${index}`;
}

export function normalizeSchema(schema: FormSchema, options: NormalizationOptions = {}): FormSchema {
  const fieldIdStrategy = options.fieldIdStrategy ?? defaultFieldIdStrategy;
  const defaultType: FormFieldType = options.defaultType ?? "unknown";

  const normalizedFields: FormFieldSchema[] = schema.fields.map((f, idx) => {
    const id = fieldIdStrategy(f, idx);
    return {
      id,
      type: f.type ?? defaultType,
      label: f.label,
      required: Boolean(f.required),
      rules: Array.isArray(f.rules) ? f.rules.slice() : undefined,
      options: Array.isArray(f.options) ? f.options.slice() : undefined,
      meta: f.meta ? { ...f.meta } : undefined,
    };
  });

  return { fields: normalizedFields, meta: schema.meta ? { ...schema.meta } : undefined };
}