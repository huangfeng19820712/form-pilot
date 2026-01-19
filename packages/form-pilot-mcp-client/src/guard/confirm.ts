import type { ClientGuardConfig } from "../types/index.js";

export async function requireSubmitConfirm(formId: string, cfg?: ClientGuardConfig): Promise<boolean> {
  if (!cfg?.submitRequiresConfirm) return true;
  if (cfg.confirm) {
    const res = await cfg.confirm(formId);
    return Boolean(res);
  }
  return false;
}