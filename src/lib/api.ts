import axios from "axios";

// Allow overriding the API base via env (useful for different hosts/ports)
// Use the environment variable or fallback to production backend URL
const isDevelopment = import.meta.env.DEV;
const envApiUrl = (import.meta as any).env.VITE_API_BASE_URL;

export const API_BASE_URL = envApiUrl
  ? envApiUrl
  : isDevelopment
  ? "http://localhost:8000/api/v1"  // Local development fallback
  : "https://manga-wellness-backend-rsijjqxv6a-el.a.run.app/api/v1"; // Production backend URL

if (isDevelopment) {
  // Development logging removed
}

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
    if (isDevelopment) {
      // Development logging removed
    }
    return config;
  },
  (error) => {
    if (isDevelopment) {
      // API Request Error logging removed
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      // Development logging removed
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      // API Response Error logging removed
    }
    return Promise.reject(error);
  }
);

export const authHeader = (token: string | null | undefined) =>
  token ? { Authorization: `Bearer ${token}` } : {};
