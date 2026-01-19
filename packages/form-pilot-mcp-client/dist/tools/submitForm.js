import { requireSubmitConfirm } from "../guard/confirm.js";
export async function submitForm(formId, getHandle, logger, actor, clientGuard) {
    try {
        const handle = getHandle();
        if (!handle)
            return { success: false, error: "Form not registered" };
        const ok = await requireSubmitConfirm(formId, clientGuard);
        if (!ok)
            return { success: false, error: "Submit not confirmed" };
        const res = await handle.submit();
        logger.log({ timestamp: Date.now(), actor, formId, action: "submitForm" });
        return { success: res.ok, data: res.ok ? res.data : undefined, error: res.ok ? undefined : String(res.error ?? "Submit failed") };
    }
    catch (e) {
        return { success: false, error: String(e?.message ?? e) };
    }
}
//# sourceMappingURL=submitForm.js.map