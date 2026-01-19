import type { AiFormHandle, UseAiFormOptions, FormPilotPluginOptions } from "./shared/types.js";
export declare function useAiForm<I = unknown>(formRef: any, options?: UseAiFormOptions<I>): AiFormHandle;
export declare const FormPilotPlugin: {
    install: (Vue: any, options?: FormPilotPluginOptions<any>) => void;
} | import("vue-demi").Plugin;
export type { UseAiFormOptions, AiFormHandle, FormPilotPluginOptions };
