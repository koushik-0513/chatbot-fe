import env from "@/config/env";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Custom Axios instance with common configurations
const api: AxiosInstance = axios.create({
  baseURL: env.backendUrl,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to add common headers
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor to standardize response format
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("[API Response error]", error?.response?.data);
    return Promise.reject(error?.response?.data);
  }
);

export { api };
