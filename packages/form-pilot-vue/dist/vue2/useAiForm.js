import { isRef, watch } from "vue-demi";
import { getGlobalConfig, toInstance } from "../shared/utils.js";
import { finalizeHandle } from "../shared/bridge.js";
export function useAiForm(formRef, options = {}) {
    let handle = finalizeHandle(toInstance(formRef), options, getGlobalConfig()?.adapters);
    if (isRef(formRef)) {
        watch(formRef, (val) => {
            handle = finalizeHandle(toInstance(val), options, getGlobalConfig()?.adapters);
        });
    }
    return {
        getSchema: () => handle.getSchema(),
        setValues: (values) => handle.setValues(values),
        getValues: () => handle.getValues(),
        validate: () => handle.validate(),
        submit: () => handle.submit(),
    };
}
//# sourceMappingURL=useAiForm.js.map