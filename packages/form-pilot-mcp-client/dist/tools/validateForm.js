export async function validateForm(formId, getHandle, logger, actor) {
    try {
        const handle = getHandle();
        if (!handle)
            return { success: false, error: "Form not registered" };
        const res = await handle.validate();
        logger.log({ timestamp: Date.now(), actor, formId, action: "validateForm", fields: res.issues.map(i => i.fieldId) });
        return { success: true, data: res };
    }
    catch (e) {
        return { success: false, error: String(e?.message ?? e) };
    }
}
//# sourceMappingURL=validateForm.js.map