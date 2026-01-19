import { createFormRuntime } from "@fhuang/form-pilot-core";
import { setValues as coreSetValues } from "@fhuang/form-pilot-core";
import { getValues as coreGetValues } from "@fhuang/form-pilot-core";
import { validate as coreValidate } from "@fhuang/form-pilot-core";
import { submit as coreSubmit } from "@fhuang/form-pilot-core";
function noOpHandle() {
    return {
        getSchema: () => ({ fields: [] }),
        setValues: async () => { },
        getValues: () => ({}),
        validate: async () => ({ valid: true, issues: [] }),
        submit: async () => ({ ok: false, error: "Form not mounted" }),
    };
}
export function createHandle(runtime) {
    if (!runtime)
        return noOpHandle();
    return {
        getSchema: () => runtime.schema,
        setValues: async (values) => {
            await coreSetValues(runtime, values);
        },
        getValues: () => coreGetValues(runtime),
        validate: async () => coreValidate(runtime),
        submit: async () => coreSubmit(runtime),
    };
}
export function buildRuntime(instance, adapters, hooks) {
    return createFormRuntime(instance, { adapters, hooks });
}
export function mergeAdapters(optsAdapters, globalAdapters) {
    if (optsAdapters && optsAdapters.length)
        return optsAdapters;
    return globalAdapters ?? [];
}
export function finalizeHandle(instance, options, globalAdapters) {
    if (!instance)
        return noOpHandle();
    const adapters = mergeAdapters(options.adapters, globalAdapters);
    const runtime = buildRuntime(instance, adapters, options.hooks);
    return createHandle(runtime);
}
//# sourceMappingURL=bridge.js.map