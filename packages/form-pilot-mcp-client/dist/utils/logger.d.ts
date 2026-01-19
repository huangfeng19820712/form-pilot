import type { AuditEntry } from "../types/index.js";
export declare class AuditLogger {
    private entries;
    private forward?;
    constructor(forward?: (entry: AuditEntry) => void);
    log(entry: AuditEntry): void;
    getEntries(): AuditEntry[];
}
