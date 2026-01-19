import type { FormSchema, FormFieldSchema, FormFieldType } from "../types/index.js";
export interface NormalizationOptions {
    fieldIdStrategy?: (field: FormFieldSchema, index: number) => string;
    defaultType?: FormFieldType;
}
export interface SchemaWithIndex extends FormSchema {
}
