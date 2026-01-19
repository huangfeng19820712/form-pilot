// Extraction is delegated to the adapter to avoid leaking UI specifics into core
export function extractSchema(adapter, instance) {
    const schema = adapter.extractSchema(instance);
    return schema;
}
//# sourceMappingURL=extract.js.map