import type { ToolCall, ToolResult } from "../types/index.js";

type Handler = (call: ToolCall) => Promise<ToolResult>;

export class WSClient {
  private ws?: WebSocket;
  private handler?: Handler;

  constructor(private url: string) {}

  setHandler(handler: Handler) {
    this.handler = handler;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = async (event) => {
      try {
        const call: ToolCall = JSON.parse(event.data);
        if (!this.handler) return;
        const result = await this.handler(call);
        this.ws?.send(JSON.stringify(result));
      } catch (e) {
        this.ws?.send(JSON.stringify({ success: false, error: "Invalid message" } satisfies ToolResult));
      }
    };
  }

  close(): void {
    this.ws?.close();
  }
}