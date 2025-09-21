import axios from "axios";

// Allow overriding the API base via env (useful for different hosts/ports)
export const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || "https://manga-wellness-backend-rsijjqxv6a-uc.a.run.app/api/v1";

console.log("🔗 API Base URL:", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("🚨 API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("🚨 API Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const authHeader = (token: string | null | undefined) =>
  token ? { Authorization: `Bearer ${token}` } : {};
