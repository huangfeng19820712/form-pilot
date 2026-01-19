import type { ToolResult, FieldGuardConfig } from "../types/index.js";
import type { AiFormHandle } from "@huangfeng19820712/vue";
import { filterAllowedValues } from "../guard/permission.js";
import { AuditLogger } from "../utils/logger.js";

export async function setFormValues(
  formId: string,
  values: Record<string, unknown>,
  getHandle: () => AiFormHandle | undefined,
  logger: AuditLogger,
  actor?: string,
  guard?: FieldGuardConfig
): Promise<ToolResult> {
  try {
    const handle = getHandle();
    if (!handle) return { success: false, error: "Form not registered" };
    const { allowed, blockedFields } = filterAllowedValues(values, guard);
    logger.log({ timestamp: Date.now(), actor, formId, action: "setFormValues", fields: Object.keys(values), values });
    if (Object.keys(allowed).length === 0) {
      return { success: false, error: blockedFields.length ? `No allowed fields: ${blockedFields.join(",")}` : "No values provided" };
    }
    await handle.setValues(allowed);
    return { success: true, data: { blockedFields } };
  } catch (e: any) {
    return { success: false, error: String(e?.message ?? e) };
  }
}