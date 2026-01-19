import type { AiFormHandle } from "@form-pilot/vue";
import { AuditLogger } from "./utils/logger.js";
import type { MCPClientOptions, ToolCall, ToolResult, ToolName, FormRegistry, FieldGuardConfig } from "./types/index.js";
import { getFormSchema } from "./tools/getFormSchema.js";
import { setFormValues } from "./tools/setFormValues.js";
import { validateForm } from "./tools/validateForm.js";
import { submitForm } from "./tools/submitForm.js";
import { WSClient } from "./client/ws.js";
import { SSEClient } from "./client/sse.js";

type HandleGetter = () => AiFormHandle | undefined;

export class MCPClient implements FormRegistry {
  private forms = new Map<string, HandleGetter>();
  private logger: AuditLogger;
  private options: MCPClientOptions;

  constructor(options: MCPClientOptions = {}) {
    this.options = options;
    this.logger = new AuditLogger(options.onAudit);
  }

  registerForm(formId: string, handleOrGetter: AiFormHandle | HandleGetter): void {
    const getter: HandleGetter = typeof handleOrGetter === "function" ? (handleOrGetter as HandleGetter) : () => handleOrGetter as AiFormHandle;
    this.forms.set(formId, getter);
  }

  unregisterForm(formId: string): void {
    this.forms.delete(formId);
  }

  getHandle(formId: string): AiFormHandle | undefined {
    const g = this.forms.get(formId);
    return g ? g() : undefined;
  }

  listFormIds(): string[] {
    return Array.from(this.forms.keys());
  }

  async dispatch(call: ToolCall): Promise<ToolResult> {
    const { tool, params, actor } = call;
    const formId = String(params.formId ?? "");
    if (!formId) return { success: false, error: "Missing formId" };
    const handleGetter = () => this.getHandle(formId);
    const fieldGuard: FieldGuardConfig | undefined = this.options.guards?.[formId];
    switch (tool as ToolName) {
      case "getFormSchema":
        return getFormSchema(formId, handleGetter, this.logger, actor ?? this.options.actor);
      case "setFormValues":
        return setFormValues(formId, (params.values as Record<string, unknown>) || {}, handleGetter, this.logger, actor ?? this.options.actor, fieldGuard);
      case "validateForm":
        return validateForm(formId, handleGetter, this.logger, actor ?? this.options.actor);
      case "submitForm":
        return submitForm(formId, handleGetter, this.logger, actor ?? this.options.actor, this.options.clientGuard);
      default:
        return { success: false, error: "Unknown tool" };
    }
  }

  connectWS(url: string): WSClient {
    const client = new WSClient(url);
    client.setHandler((call) => this.dispatch(call));
    client.connect();
    return client;
  }

  connectSSE(url: string, send?: (data: ToolResult) => void): SSEClient {
    const client = new SSEClient(url, send);
    client.setHandler((call) => this.dispatch(call));
    client.connect();
    return client;
  }
}

export type { MCPClientOptions, ToolCall, ToolResult, FieldGuardConfig };