import { watch, isRef } from "vue-demi";
import type { AiFormHandle, UseAiFormOptions } from "../shared/types.js";
import { getGlobalConfig, toInstance } from "../shared/utils.js";
import { finalizeHandle } from "../shared/bridge.js";

export function useAiForm<I = unknown>(formRef: any, options: UseAiFormOptions<I> = {}): AiFormHandle {
  let handle: AiFormHandle = finalizeHandle(toInstance<I>(formRef), options, getGlobalConfig<I>()?.adapters);

  if (isRef(formRef)) {
    watch(formRef, (val) => {
      handle = finalizeHandle(toInstance<I>(val), options, getGlobalConfig<I>()?.adapters);
    });
  }

  return {
    getSchema: () => handle.getSchema(),
    setValues: (values) => handle.setValues(values),
    getValues: () => handle.getValues(),
    validate: () => handle.validate(),
    submit: () => handle.submit(),
  };
}