import { filterAllowedValues } from "../guard/permission.js";
export async function setFormValues(formId, values, getHandle, logger, actor, guard) {
    try {
        const handle = getHandle();
        if (!handle)
            return { success: false, error: "Form not registered" };
        const { allowed, blockedFields } = filterAllowedValues(values, guard);
        logger.log({ timestamp: Date.now(), actor, formId, action: "setFormValues", fields: Object.keys(values), values });
        if (Object.keys(allowed).length === 0) {
            return { success: false, error: blockedFields.length ? `No allowed fields: ${blockedFields.join(",")}` : "No values provided" };
        }
        await handle.setValues(allowed);
        return { success: true, data: { blockedFields } };
    }
    catch (e) {
        return { success: false, error: String(e?.message ?? e) };
    }
}
//# sourceMappingURL=setFormValues.js.map