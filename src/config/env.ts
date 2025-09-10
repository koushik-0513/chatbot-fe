type TEnv = {
  backendUrl: string;
};

const env: TEnv = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
};

export default env;
