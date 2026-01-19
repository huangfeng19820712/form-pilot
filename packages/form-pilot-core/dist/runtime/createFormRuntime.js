import { detectAdapter } from "../adapter/detect.js";
import { extractSchema } from "../schema/extract.js";
import { normalizeSchema } from "../schema/normalize.js";
import { createContext } from "./context.js";
export function createFormRuntime(instance, options) {
    const adapter = detectAdapter(instance, options.adapters);
    const rawSchema = extractSchema(adapter, instance);
    const schema = normalizeSchema(rawSchema);
    return createContext(instance, adapter, schema, options.hooks);
}
//# sourceMappingURL=createFormRuntime.js.map