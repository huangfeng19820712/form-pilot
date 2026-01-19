import { isVue3, unref } from "vue-demi";
const globalStore = {};
export function setGlobalConfig(config) {
    globalStore.config = config;
}
export function getGlobalConfig() {
    return globalStore.config;
}
export function toInstance(formRef) {
    if (formRef == null)
        return undefined;
    const maybe = isVue3 ? unref(formRef) : formRef;
    // Treat any object passed in as the form instance; avoid DOM access
    return maybe;
}
export function isRuntimeReady(instance) {
    return instance != null;
}
//# sourceMappingURL=utils.js.map