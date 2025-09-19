import { API_DEFAULTS } from "@/constants/constants";
import { TEnv } from "@/types/types";

type EnvOverrides = Partial<TEnv>;

let runtimeOverrides: EnvOverrides = {};

const getGlobalOverrides = (): EnvOverrides => {
  if (typeof globalThis === "undefined") {
    return {};
  }

  const globalConfig = (globalThis as Record<string, unknown>)
    .__CHATBOT_WIDGET_CONFIG__;

  if (
    globalConfig &&
    typeof globalConfig === "object" &&
    "env" in globalConfig &&
    typeof (globalConfig as { env?: unknown }).env === "object"
  ) {
    return (globalConfig as { env?: EnvOverrides }).env ?? {};
  }

  return {};
};

const buildEnv = (): TEnv => {
  const defaults: TEnv = {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || API_DEFAULTS.BACKEND_URL,
  };

  return {
    ...defaults,
    ...getGlobalOverrides(),
    ...runtimeOverrides,
  } as TEnv;
};

export const setRuntimeEnv = (overrides: EnvOverrides) => {
  runtimeOverrides = { ...runtimeOverrides, ...overrides };
};

export const getEnv = (): TEnv => buildEnv();

const env = new Proxy<TEnv>({} as TEnv, {
  get: (_target, prop: keyof TEnv) => buildEnv()[prop],
}) as TEnv;

export default env;
