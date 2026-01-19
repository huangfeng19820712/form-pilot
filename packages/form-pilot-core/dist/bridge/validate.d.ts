import type { FormRuntime, ValidationResult } from "../types/index.js";
import type { ValidateOptions } from "./types.js";
export declare function validate<I>(runtime: FormRuntime<I>, options?: ValidateOptions): Promise<ValidationResult>;
