import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/env";
import { authStorage } from "../utils/authStorage";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored JWT to every outgoing request.
// authStorage.getToken() reads from localStorage, so the token survives
// page refreshes without any additional action from the React layer.
axiosClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// On 401, clear the stored session and redirect to login.
// This handles expired tokens without requiring the React auth state to be
// involved — the next page load will pick up the empty localStorage correctly.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();

      if (!window.location.pathname.includes("/login")) {
        toast.error("Session expired. Please log in again.");
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
