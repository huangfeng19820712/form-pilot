import { setGlobalConfig } from "../shared/utils.js";
export const FormPilotPlugin = {
    install(Vue, options) {
        if (options?.adapters && options.adapters.length) {
            setGlobalConfig({ adapters: options.adapters, hooks: options.hooks });
        }
    },
};
//# sourceMappingURL=install.js.map