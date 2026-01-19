import type { AiFormHandle } from "@huangfeng19820712/form-pilot-vue";

export type ToolName = "getFormSchema" | "setFormValues" | "validateForm" | "submitForm";

export interface ToolCall {
  tool: ToolName;
  params: Record<string, unknown>;
  actor?: string;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuditEntry {
  timestamp: number;
  actor?: string;
  formId: string;
  action: ToolName;
  fields?: string[];
  values?: Record<string, unknown>;
}

export interface FieldGuardConfig {
  allowedFields?: string[];
  canWrite?: (fieldId: string, value: unknown) => boolean;
}

export interface ClientGuardConfig {
  submitRequiresConfirm?: boolean;
  confirm?: (formId: string) => Promise<boolean> | boolean;
}

export interface MCPClientOptions {
  actor?: string;
  guards?: Record<string, FieldGuardConfig>;
  clientGuard?: ClientGuardConfig;
  onAudit?: (entry: AuditEntry) => void;
}

export interface FormRegistry {
  getHandle: (formId: string) => AiFormHandle | undefined;
}