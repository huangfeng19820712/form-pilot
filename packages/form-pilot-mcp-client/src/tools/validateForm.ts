import type { ToolResult } from "../types/index.js";
import type { AiFormHandle } from "@huangfeng19820712/form-pilot-vue";
import { AuditLogger } from "../utils/logger.js";

export async function validateForm(formId: string, getHandle: () => AiFormHandle | undefined, logger: AuditLogger, actor?: string): Promise<ToolResult> {
  try {
    const handle = getHandle();
    if (!handle) return { success: false, error: "Form not registered" };
    const res = await handle.validate();
    logger.log({ timestamp: Date.now(), actor, formId, action: "validateForm", fields: res.issues.map(i => i.fieldId) });
    return { success: true, data: res };
  } catch (e: any) {
    return { success: false, error: String(e?.message ?? e) };
  }
}