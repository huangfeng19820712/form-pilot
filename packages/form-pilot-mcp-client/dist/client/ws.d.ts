import type { ToolCall, ToolResult } from "../types/index.js";
type Handler = (call: ToolCall) => Promise<ToolResult>;
export declare class WSClient {
    private url;
    private ws?;
    private handler?;
    constructor(url: string);
    setHandler(handler: Handler): void;
    connect(): void;
    close(): void;
}
export {};
