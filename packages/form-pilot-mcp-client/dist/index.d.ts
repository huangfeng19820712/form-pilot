import type { AiFormHandle } from "@form-pilot/vue";
import type { MCPClientOptions, ToolCall, ToolResult, FormRegistry, FieldGuardConfig } from "./types/index.js";
import { WSClient } from "./client/ws.js";
import { SSEClient } from "./client/sse.js";
type HandleGetter = () => AiFormHandle | undefined;
export declare class MCPClient implements FormRegistry {
    private forms;
    private logger;
    private options;
    constructor(options?: MCPClientOptions);
    registerForm(formId: string, handleOrGetter: AiFormHandle | HandleGetter): void;
    unregisterForm(formId: string): void;
    getHandle(formId: string): AiFormHandle | undefined;
    listFormIds(): string[];
    dispatch(call: ToolCall): Promise<ToolResult>;
    connectWS(url: string): WSClient;
    connectSSE(url: string, send?: (data: ToolResult) => void): SSEClient;
}
export type { MCPClientOptions, ToolCall, ToolResult, FieldGuardConfig };
