import env from "@/config/env";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { API_HEADERS, API_ERROR_MESSAGES } from "@/constants";

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
    console.error(API_ERROR_MESSAGES.REQUEST_ERROR, error);
    return Promise.reject(error);
  }
);

// Response interceptor to standardize response format
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error(API_ERROR_MESSAGES.RESPONSE_ERROR, error?.response?.data);
    return Promise.reject(error?.response?.data);
  }
);

export { api };
