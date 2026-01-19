import type { FormPilotGlobalConfig } from "./types.js";
export declare function setGlobalConfig<I>(config: FormPilotGlobalConfig<I>): void;
export declare function getGlobalConfig<I>(): FormPilotGlobalConfig<I> | undefined;
export declare function toInstance<I>(formRef: any): I | undefined;
export declare function isRuntimeReady(instance: unknown): boolean;
