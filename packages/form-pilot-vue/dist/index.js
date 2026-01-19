import { isVue2 } from "vue-demi";
import * as v2 from "./vue2/useAiForm.js";
import * as v3 from "./vue3/useAiForm.js";
import { FormPilotPlugin as V2Plugin } from "./vue2/install.js";
import { FormPilotPlugin as V3Plugin } from "./vue3/install.js";
export function useAiForm(formRef, options = {}) {
    return isVue2 ? v2.useAiForm(formRef, options) : v3.useAiForm(formRef, options);
}
export const FormPilotPlugin = isVue2 ? V2Plugin : V3Plugin;
//# sourceMappingURL=index.js.map