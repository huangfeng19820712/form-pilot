export async function validate(runtime, options = {}) {
    if (runtime.hooks?.beforeValidate) {
        await runtime.hooks.beforeValidate({ instance: runtime.instance, fieldIds: options.fieldIds });
    }
    const adapter = runtime.adapter;
    return adapter.validate(runtime.instance, options.fieldIds);
}
//# sourceMappingURL=validate.js.map