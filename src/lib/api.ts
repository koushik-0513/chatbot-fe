import env from "@/config/env";
import { API_HEADERS } from "@/constants/constants";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Custom Axios instance with common configurations
const api: AxiosInstance = axios.create({
  baseURL: env.backendUrl,
  headers: {
    "Content-Type": API_HEADERS.CONTENT_TYPE,
    [API_HEADERS.NGROK_SKIP_WARNING]: "true",
  },
});

// Request interceptor to add common headers
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to standardize response format
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error?.response?.data);
  }
);

export { api };
