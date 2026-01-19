export async function getFormSchema(formId, getHandle, logger, actor) {
    try {
        const handle = getHandle();
        if (!handle)
            return { success: false, error: "Form not registered" };
        const schema = handle.getSchema();
        logger.log({ timestamp: Date.now(), actor, formId, action: "getFormSchema" });
        return { success: true, data: schema };
    }
    catch (e) {
        return { success: false, error: String(e?.message ?? e) };
    }
}
//# sourceMappingURL=getFormSchema.js.map