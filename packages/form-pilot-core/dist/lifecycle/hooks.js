export function createHooks(hooks) {
    // Hooks are optional and composable; undefined handlers are harmless
    return {
        beforeSet: hooks?.beforeSet,
        afterSet: hooks?.afterSet,
        beforeValidate: hooks?.beforeValidate,
        beforeSubmit: hooks?.beforeSubmit,
    };
}
//# sourceMappingURL=hooks.js.map