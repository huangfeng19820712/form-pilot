export async function setValues(runtime, values, options) {
    if (runtime.hooks?.beforeSet) {
        await runtime.hooks.beforeSet({ instance: runtime.instance, next: values });
    }
    const adapter = runtime.adapter;
    adapter.setValues(runtime.instance, values, options);
    if (runtime.hooks?.afterSet) {
        await runtime.hooks.afterSet({ instance: runtime.instance, values });
    }
}
//# sourceMappingURL=setValues.js.map