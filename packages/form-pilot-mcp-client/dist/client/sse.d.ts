import type { ToolCall, ToolResult } from "../types/index.js";
type Handler = (call: ToolCall) => Promise<ToolResult>;
export declare class SSEClient {
    private url;
    private es?;
    private handler?;
    private send?;
    constructor(url: string, send?: (data: ToolResult) => void);
    setHandler(handler: Handler): void;
    connect(): void;
    close(): void;
}
export {};
