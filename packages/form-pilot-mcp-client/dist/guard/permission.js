export function filterAllowedValues(values, guard) {
    if (!guard?.allowedFields || guard.allowedFields.length === 0) {
        return { allowed: { ...values }, blockedFields: [] };
    }
    const allowed = {};
    const blocked = [];
    for (const [key, val] of Object.entries(values)) {
        if (guard.allowedFields.includes(key)) {
            if (!guard.canWrite || guard.canWrite(key, val)) {
                allowed[key] = val;
            }
            else {
                blocked.push(key);
            }
        }
        else {
            blocked.push(key);
        }
    }
    return { allowed, blockedFields: blocked };
}
//# sourceMappingURL=permission.js.map