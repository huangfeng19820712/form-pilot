import { AuditLogger } from "./utils/logger.js";
import { getFormSchema } from "./tools/getFormSchema.js";
import { setFormValues } from "./tools/setFormValues.js";
import { validateForm } from "./tools/validateForm.js";
import { submitForm } from "./tools/submitForm.js";
import { WSClient } from "./client/ws.js";
import { SSEClient } from "./client/sse.js";
export class MCPClient {
    constructor(options = {}) {
        this.forms = new Map();
        this.options = options;
        this.logger = new AuditLogger(options.onAudit);
    }
    registerForm(formId, handleOrGetter) {
        const getter = typeof handleOrGetter === "function" ? handleOrGetter : () => handleOrGetter;
        this.forms.set(formId, getter);
    }
    unregisterForm(formId) {
        this.forms.delete(formId);
    }
    getHandle(formId) {
        const g = this.forms.get(formId);
        return g ? g() : undefined;
    }
    listFormIds() {
        return Array.from(this.forms.keys());
    }
    async dispatch(call) {
        const { tool, params, actor } = call;
        const formId = String(params.formId ?? "");
        if (!formId)
            return { success: false, error: "Missing formId" };
        const handleGetter = () => this.getHandle(formId);
        const fieldGuard = this.options.guards?.[formId];
        switch (tool) {
            case "getFormSchema":
                return getFormSchema(formId, handleGetter, this.logger, actor ?? this.options.actor);
            case "setFormValues":
                return setFormValues(formId, params.values || {}, handleGetter, this.logger, actor ?? this.options.actor, fieldGuard);
            case "validateForm":
                return validateForm(formId, handleGetter, this.logger, actor ?? this.options.actor);
            case "submitForm":
                return submitForm(formId, handleGetter, this.logger, actor ?? this.options.actor, this.options.clientGuard);
            default:
                return { success: false, error: "Unknown tool" };
        }
    }
    connectWS(url) {
        const client = new WSClient(url);
        client.setHandler((call) => this.dispatch(call));
        client.connect();
        return client;
    }
    connectSSE(url, send) {
        const client = new SSEClient(url, send);
        client.setHandler((call) => this.dispatch(call));
        client.connect();
        return client;
    }
}
//# sourceMappingURL=index.js.map