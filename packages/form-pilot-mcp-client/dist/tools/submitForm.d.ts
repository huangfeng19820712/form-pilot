import type { ToolResult, ClientGuardConfig } from "../types/index.js";
import type { AiFormHandle } from "@fhuang/form-pilot-vue";
import { AuditLogger } from "../utils/logger.js";
export declare function submitForm(formId: string, getHandle: () => AiFormHandle | undefined, logger: AuditLogger, actor?: string, clientGuard?: ClientGuardConfig): Promise<ToolResult>;
