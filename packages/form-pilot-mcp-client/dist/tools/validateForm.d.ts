import type { ToolResult } from "../types/index.js";
import type { AiFormHandle } from "@form-pilot/vue";
import { AuditLogger } from "../utils/logger.js";
export declare function validateForm(formId: string, getHandle: () => AiFormHandle | undefined, logger: AuditLogger, actor?: string): Promise<ToolResult>;
