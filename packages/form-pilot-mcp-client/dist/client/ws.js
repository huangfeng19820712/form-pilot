export class WSClient {
    constructor(url) {
        this.url = url;
    }
    setHandler(handler) {
        this.handler = handler;
    }
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = async (event) => {
            try {
                const call = JSON.parse(event.data);
                if (!this.handler)
                    return;
                const result = await this.handler(call);
                this.ws?.send(JSON.stringify(result));
            }
            catch (e) {
                this.ws?.send(JSON.stringify({ success: false, error: "Invalid message" }));
            }
        };
    }
    close() {
        this.ws?.close();
    }
}
//# sourceMappingURL=ws.js.map