export async function requireSubmitConfirm(formId, cfg) {
    if (!cfg?.submitRequiresConfirm)
        return true;
    if (cfg.confirm) {
        const res = await cfg.confirm(formId);
        return Boolean(res);
    }
    return false;
}
//# sourceMappingURL=confirm.js.map