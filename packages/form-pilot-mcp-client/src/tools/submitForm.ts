import type { ToolResult, ClientGuardConfig } from "../types/index.js";
import type { AiFormHandle } from "@huangfeng19820712/form-pilot-vue";
import { AuditLogger } from "../utils/logger.js";
import { requireSubmitConfirm } from "../guard/confirm.js";

export async function submitForm(
  formId: string,
  getHandle: () => AiFormHandle | undefined,
  logger: AuditLogger,
  actor?: string,
  clientGuard?: ClientGuardConfig
): Promise<ToolResult> {
  try {
    const handle = getHandle();
    if (!handle) return { success: false, error: "Form not registered" };
    const ok = await requireSubmitConfirm(formId, clientGuard);
    if (!ok) return { success: false, error: "Submit not confirmed" };
    const res = await handle.submit();
    logger.log({ timestamp: Date.now(), actor, formId, action: "submitForm" });
    return { success: res.ok, data: res.ok ? res.data : undefined, error: res.ok ? undefined : String(res.error ?? "Submit failed") };
  } catch (e: any) {
    return { success: false, error: String(e?.message ?? e) };
  }
}