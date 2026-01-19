export type FieldId = string;
export type FormFieldType = "string" | "number" | "boolean" | "date" | "array" | "object" | "unknown";
export interface ValidationRule {
    kind: string;
    message?: string;
    params?: Record<string, unknown>;
}
export interface FormFieldSchema {
    id: FieldId;
    type: FormFieldType;
    label?: string;
    required: boolean;
    rules?: ValidationRule[];
    options?: Array<{
        value: unknown;
        label?: string;
        disabled?: boolean;
    }>;
    meta?: Record<string, unknown>;
}
export interface FormSchema {
    fields: FormFieldSchema[];
    meta?: Record<string, unknown>;
}
export interface ValidationIssue {
    fieldId: FieldId;
    rule?: ValidationRule;
    message: string;
}
export interface ValidationResult {
    valid: boolean;
    issues: ValidationIssue[];
}
export interface SubmitResult {
    ok: boolean;
    data?: unknown;
    error?: unknown;
}
export interface SetValuesOptions {
    strict?: boolean;
}
export interface FormAdapter<I = unknown> {
    isMatch(instance: I): boolean;
    extractSchema(instance: I): FormSchema;
    getValues(instance: I): Record<string, unknown>;
    setValues(instance: I, values: Record<string, unknown>, options?: SetValuesOptions): void;
    validate(instance: I, fieldIds?: FieldId[]): ValidationResult;
    submit(instance: I): Promise<SubmitResult>;
}
export interface FormLifecycleHooks<I = unknown> {
    beforeSet?: (payload: {
        instance: I;
        next: Record<string, unknown>;
    }) => void | Promise<void>;
    afterSet?: (payload: {
        instance: I;
        values: Record<string, unknown>;
    }) => void | Promise<void>;
    beforeValidate?: (payload: {
        instance: I;
        fieldIds?: FieldId[];
    }) => void | Promise<void>;
    beforeSubmit?: (payload: {
        instance: I;
    }) => void | Promise<void>;
}
export interface FormRuntime<I = unknown> {
    instance: I;
    adapter: FormAdapter<I>;
    schema: FormSchema;
    hooks?: FormLifecycleHooks<I>;
}
