export class AuditLogger {
    constructor(forward) {
        this.entries = [];
        this.forward = forward;
    }
    log(entry) {
        this.entries.push(entry);
        if (this.forward)
            this.forward(entry);
    }
    getEntries() {
        return this.entries.slice();
    }
}
//# sourceMappingURL=logger.js.map