import { isVue2, isVue3, unref } from "vue-demi";
import type { FormPilotGlobalConfig } from "./types.js";

const globalStore: { config?: FormPilotGlobalConfig<any> } = {};

export function setGlobalConfig<I>(config: FormPilotGlobalConfig<I>): void {
  globalStore.config = config as FormPilotGlobalConfig<any>;
}

export function getGlobalConfig<I>(): FormPilotGlobalConfig<I> | undefined {
  return globalStore.config as FormPilotGlobalConfig<I> | undefined;
}

export function toInstance<I>(formRef: any): I | undefined {
  if (formRef == null) return undefined;
  const maybe = isVue3 ? unref(formRef) : formRef;
  // Treat any object passed in as the form instance; avoid DOM access
  return maybe as I;
}

export function isRuntimeReady(instance: unknown): boolean {
  return instance != null;
}