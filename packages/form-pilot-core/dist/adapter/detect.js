export function detectAdapter(instance, adapters) {
    for (const d of adapters) {
        const adapter = d.create();
        if (adapter.isMatch(instance)) {
            return adapter;
        }
    }
    throw new Error("No compatible form adapter found for the given instance");
}
//# sourceMappingURL=detect.js.map