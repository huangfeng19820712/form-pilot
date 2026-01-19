export async function submit(runtime) {
    if (runtime.hooks?.beforeSubmit) {
        await runtime.hooks.beforeSubmit({ instance: runtime.instance });
    }
    const adapter = runtime.adapter;
    return adapter.submit(runtime.instance);
}
//# sourceMappingURL=submit.js.map