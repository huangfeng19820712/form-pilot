import type { ToolCall, ToolResult } from "../types/index.js";

type Handler = (call: ToolCall) => Promise<ToolResult>;

export class SSEClient {
  private es?: EventSource;
  private handler?: Handler;
  private send?: (data: ToolResult) => void;

  constructor(private url: string, send?: (data: ToolResult) => void) {
    this.send = send;
  }

  setHandler(handler: Handler) {
    this.handler = handler;
  }

  connect(): void {
    this.es = new EventSource(this.url);
    this.es.onmessage = async (event) => {
      try {
        const call: ToolCall = JSON.parse(event.data);
        if (!this.handler) return;
        const result = await this.handler(call);
        if (this.send) this.send(result);
      } catch (e) {
        if (this.send) this.send({ success: false, error: "Invalid message" });
      }
    };
  }

  close(): void {
    this.es?.close();
  }
}