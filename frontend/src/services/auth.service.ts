import { apiClient } from "./apiClient";
import { User } from "../types/user";
import { AxiosResponse } from "axios";

// Response Shapes
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

/** Returned by /register/verify-otp — contains the registration proof token. */
export interface RegisterVerifyResponse {
  success: boolean;
  message: string;
  verifiedToken: string;
}

// Auth Service Methods
/**
 * Authenticate with username or email + password.
 */
export async function loginWithPassword(
  identifier: string,
  password: string
): Promise<AxiosResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>("/auth/login-password", { identifier, password });
}

/**
 * Request a 6-digit OTP to be emailed to the given address (sign-in flow).
 */
export async function requestOTP(
  email: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return apiClient.post("/auth/otp-request", { email });
}

/**
 * Verify the 6-digit OTP and retrieve a JWT on success (sign-in flow).
 */
export async function verifyOTP(
  email: string,
  otp: string
): Promise<AxiosResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>("/auth/otp-verify", { email, otp });
}

/**
 * Exchange a Google ID token (from @react-oauth/google) for a system JWT.
 */
export async function loginWithGoogle(
  credential: string
): Promise<AxiosResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>("/auth/google", { credential });
}

/**
 * Unlink the Google account from the current user session.
 */
export async function unlinkGoogleAccount(): Promise<AxiosResponse<{ success: boolean; message: string; user: User }>> {
  return apiClient.post<{ success: boolean; message: string; user: User }>("/auth/unlink-google");
}

// Registration Flow Methods
/**
 * Step 1: Send a registration OTP to the given email.
 * Fails with 409 if the email is already registered.
 */
export async function registerSendOTP(
  email: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return apiClient.post("/auth/register/send-otp", { email });
}

/**
 * Step 2: Verify the registration OTP.
 * Returns a short-lived `verifiedToken` JWT that must be passed to Step 3.
 */
export async function registerVerifyOTP(
  email: string,
  otp: string
): Promise<AxiosResponse<RegisterVerifyResponse>> {
  return apiClient.post<RegisterVerifyResponse>("/auth/register/verify-otp", { email, otp });
}

/**
 * Debounce-friendly username availability probe.
 * Returns { available: boolean } — never throws on a "taken" result.
 */
export async function checkUsernameAvailability(
  username: string
): Promise<AxiosResponse<{ available: boolean }>> {
  return apiClient.get<{ available: boolean }>("/auth/check-username", {
    params: { username },
  });
}

/**
 * Step 3: Complete registration with email, verifiedToken, username, and password.
 * Returns the full auth JWT and user object on 201 Created.
 */
export async function registerComplete(payload: {
  email: string;
  verifiedToken: string;
  username: string;
  password: string;
}): Promise<AxiosResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>("/auth/register/complete", payload);
}

// Password Reset Flow Methods
export async function forgotPassword(
  email: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return apiClient.post("/forgot-password", { email });
}

export async function verifyResetToken(
  email: string,
  token: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return apiClient.post("/verify-reset-token", { email, token });
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return apiClient.post("/reset-password", { email, token, newPassword });
}
