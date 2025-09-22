import { TEnv } from "@/types/types";

const env: TEnv = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1",
};

export default env;