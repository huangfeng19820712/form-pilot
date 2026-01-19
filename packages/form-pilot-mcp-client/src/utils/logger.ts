import type { AuditEntry } from "../types/index.js";

export class AuditLogger {
  private entries: AuditEntry[] = [];
  private forward?: (entry: AuditEntry) => void;

  constructor(forward?: (entry: AuditEntry) => void) {
    this.forward = forward;
  }

  log(entry: AuditEntry): void {
    this.entries.push(entry);
    if (this.forward) this.forward(entry);
  }

  getEntries(): AuditEntry[] {
    return this.entries.slice();
  }
}