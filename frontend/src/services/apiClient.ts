import axios from "axios";
import { env } from "../config/env.config";

/**
 * Centralized Axios client instance for all API communication.
 *
 * - Base URL is sourced from VITE_API_URL environment variable.
 * - Default JSON headers ensure consistent content negotiation.
 * - withCredentials enables seamless cookie/session delivery for auth flows.
 */
const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Inject the JWT token into every request if available
apiClient.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("userDetails");
  if (storedUser) {
    try {
      const userDetails = JSON.parse(storedUser);
      if (userDetails.token) {
        config.headers.Authorization = `Bearer ${userDetails.token}`;
      }
    } catch (e) {
      console.error("Failed to parse userDetails for token injection", e);
    }
  }
  return config;
});

export { apiClient };
