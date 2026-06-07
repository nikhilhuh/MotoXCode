import axios from "axios";
import { env } from "../config/env.config";

/**
 * Centralized Axios client instance for all API communication.
 *
 * - Base URL is sourced from VITE_API_URL environment variable,
 *   falling back to localhost:8080/api for local development.
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

export { apiClient };
