import axios from "axios";

// Allow overriding the API base via env (useful for different hosts/ports)
export const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authHeader = (token: string | null | undefined) =>
  token ? { Authorization: `Bearer ${token}` } : {};
