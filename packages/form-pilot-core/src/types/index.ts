// The core types intentionally avoid any UI or framework specifics to remain stable over time

export type FieldId = string;

export type FormFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "object"
  | "unknown";

export interface ValidationRule {
  // Rules model intent; actual evaluation is delegated to adapters for real forms
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
  options?: Array<{ value: unknown; label?: string; disabled?: boolean }>;
  meta?: Record<string, unknown>;
}

export interface FormSchema {
  // Stable, serializable description of the form
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
  // Allow partial updates to be surfaced by adapters when necessary
  strict?: boolean;
}

// Adapters are the only bridge to concrete form implementations
export interface FormAdapter<I = unknown> {
  // Detects whether the adapter can operate the given instance by capabilities
  isMatch(instance: I): boolean;

  // Produces a raw schema from the instance; normalization happens in core
  extractSchema(instance: I): FormSchema;

  // Reads and writes values using the underlying form APIs
  getValues(instance: I): Record<string, unknown>;
  setValues(instance: I, values: Record<string, unknown>, options?: SetValuesOptions): void;

  // Runs validation; issues are mapped to core model
  validate(instance: I, fieldIds?: FieldId[]): ValidationResult;

  // Triggers submission; side effects are externalized via result
  submit(instance: I): Promise<SubmitResult>;
}

export interface FormLifecycleHooks<I = unknown> {
  beforeSet?: (payload: { instance: I; next: Record<string, unknown> }) => void | Promise<void>;
  afterSet?: (payload: { instance: I; values: Record<string, unknown> }) => void | Promise<void>;
  beforeValidate?: (payload: { instance: I; fieldIds?: FieldId[] }) => void | Promise<void>;
  beforeSubmit?: (payload: { instance: I }) => void | Promise<void>;
}

export interface FormRuntime<I = unknown> {
  // Minimal shared runtime for consistent operations across adapters
  instance: I;
  adapter: FormAdapter<I>;
  schema: FormSchema;
  hooks?: FormLifecycleHooks<I>;
}