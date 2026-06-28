const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export const BACKEND_BASE_URL = rawApiBaseUrl.endsWith("/api") ? rawApiBaseUrl.slice(0, -4) : rawApiBaseUrl;
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;
