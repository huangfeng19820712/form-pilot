import { defineAdapter } from "@form-pilot/core";
export const PlainAdapter = defineAdapter({
    id: "plain",
    capabilities: ["schema", "values", "validate", "submit"],
    create: () => ({
        isMatch: (instance) => typeof instance === "object" && instance != null,
        extractSchema: (instance) => {
            if (instance && typeof instance.__schema === "object" && Array.isArray(instance.__schema.fields)) {
                return { fields: instance.__schema.fields, meta: instance.__schema.meta };
            }
            const keys = Object.keys(instance || {}).filter((k) => !k.startsWith("__"));
            const fields = keys.map((k) => {
                const v = instance[k];
                let type = Array.isArray(v) ? "array" : typeof v === "number" ? "number" : typeof v === "boolean" ? "boolean" : typeof v === "object" && v ? "object" : typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? "date" : "string";
                const base = { id: k, type, label: k.charAt(0).toUpperCase() + k.slice(1), required: ["name", "email", "role", "dob"].includes(k) };
                if (k === "role") {
                    base.options = [
                        { value: "admin", label: "Admin" },
                        { value: "user", label: "User" },
                        { value: "auditor", label: "Auditor" },
                    ];
                }
                else if (k === "tags") {
                    base.options = [
                        { value: "alpha", label: "Alpha" },
                        { value: "beta", label: "Beta" },
                        { value: "gamma", label: "Gamma" },
                        { value: "delta", label: "Delta" },
                    ];
                    base.meta = { widget: "transfer" };
                }
                else if (k === "interests") {
                    base.options = [
                        { value: "music", label: "Music" },
                        { value: "sports", label: "Sports" },
                        { value: "tech", label: "Tech" },
                    ];
                    base.meta = { widget: "checkbox-group" };
                }
                else if (k === "volume") {
                    base.meta = { min: 0, max: 100, step: 1, widget: "slider" };
                }
                else if (k === "rating") {
                    base.meta = { min: 1, max: 5, step: 1, widget: "rate" };
                }
                else if (k === "color") {
                    base.meta = { widget: "color" };
                }
                return base;
            });
            return { fields };
        },
        getValues: (instance) => {
            const out = {};
            for (const k of Object.keys(instance || {})) {
                if (!k.startsWith("__"))
                    out[k] = instance[k];
            }
            return out;
        },
        setValues: (instance, values) => {
            Object.assign(instance, values);
        },
        validate: (instance) => {
            const issues = [];
            const requiredList = Array.isArray(instance?.__required) ? instance.__required : ["name", "email", "role", "dob"].filter((k) => k in instance);
            for (const k of requiredList) {
                if (!instance[k])
                    issues.push({ fieldId: k, message: "required" });
            }
            return { valid: issues.length === 0, issues };
        },
        submit: async (instance) => ({ ok: true, data: { ...instance } }),
    }),
});
export default PlainAdapter;
//# sourceMappingURL=index.js.map