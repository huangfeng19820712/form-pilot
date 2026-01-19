import type { ToolResult } from "../types/index.js";
import type { AiFormHandle } from "@huangfeng19820712/form-pilot-vue";
import { AuditLogger } from "../utils/logger.js";

export async function getFormSchema(formId: string, getHandle: () => AiFormHandle | undefined, logger: AuditLogger, actor?: string): Promise<ToolResult> {
  try {
    const handle = getHandle();
    if (!handle) return { success: false, error: "Form not registered" };
    const schema = handle.getSchema();
    logger.log({ timestamp: Date.now(), actor, formId, action: "getFormSchema" });
    return { success: true, data: schema };
  } catch (e: any) {
    return { success: false, error: String(e?.message ?? e) };
  }
}