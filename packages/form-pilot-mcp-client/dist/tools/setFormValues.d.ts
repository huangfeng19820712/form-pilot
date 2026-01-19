import type { ToolResult, FieldGuardConfig } from "../types/index.js";
import type { AiFormHandle } from "@form-pilot/vue";
import { AuditLogger } from "../utils/logger.js";
export declare function setFormValues(formId: string, values: Record<string, unknown>, getHandle: () => AiFormHandle | undefined, logger: AuditLogger, actor?: string, guard?: FieldGuardConfig): Promise<ToolResult>;
