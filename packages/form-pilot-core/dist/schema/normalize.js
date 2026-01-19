function defaultFieldIdStrategy(field, index) {
    // Ensures stable identifiers even when UI libraries omit them
    return field.id || `field_${index}`;
}
export function normalizeSchema(schema, options = {}) {
    const fieldIdStrategy = options.fieldIdStrategy ?? defaultFieldIdStrategy;
    const defaultType = options.defaultType ?? "unknown";
    const normalizedFields = schema.fields.map((f, idx) => {
        const id = fieldIdStrategy(f, idx);
        return {
            id,
            type: f.type ?? defaultType,
            label: f.label,
            required: Boolean(f.required),
            rules: Array.isArray(f.rules) ? f.rules.slice() : undefined,
            options: Array.isArray(f.options) ? f.options.slice() : undefined,
            meta: f.meta ? { ...f.meta } : undefined,
        };
    });
    return { fields: normalizedFields, meta: schema.meta ? { ...schema.meta } : undefined };
}
//# sourceMappingURL=normalize.js.map