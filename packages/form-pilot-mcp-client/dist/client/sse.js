export class SSEClient {
    constructor(url, send) {
        this.url = url;
        this.send = send;
    }
    setHandler(handler) {
        this.handler = handler;
    }
    connect() {
        this.es = new EventSource(this.url);
        this.es.onmessage = async (event) => {
            try {
                const call = JSON.parse(event.data);
                if (!this.handler)
                    return;
                const result = await this.handler(call);
                if (this.send)
                    this.send(result);
            }
            catch (e) {
                if (this.send)
                    this.send({ success: false, error: "Invalid message" });
            }
        };
    }
    close() {
        this.es?.close();
    }
}
//# sourceMappingURL=sse.js.map