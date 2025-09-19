import { TEnv } from "@/types/types";

const env: TEnv = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "",
};

export default env;