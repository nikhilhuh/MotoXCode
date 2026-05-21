import axios from "axios";

/**
 * Centralized Axios client instance for all API communication.
 *
 * - Base URL is sourced from VITE_API_URL environment variable,
 *   falling back to localhost:8080/api for local development.
 * - Default JSON headers ensure consistent content negotiation.
 * - withCredentials enables seamless cookie/session delivery for auth flows.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export { apiClient };
