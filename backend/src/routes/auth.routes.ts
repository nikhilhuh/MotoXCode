import { Router } from "express";
import {
  register,
  loginPassword,
  otpRequest,
  otpVerify,
  googleAuth,
  registerSendOTP,
  registerVerifyOTP,
  checkUsername,
  registerComplete,
  linkGoogleAccount,
  unlinkGoogleAccount,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

// Auth Router
const authRouter = Router();

/**
 * POST /api/auth/register
 * Register a new Crew member with username + email + password (single-step, legacy).
 */
authRouter.post("/register", register);

/**
 * POST /api/auth/login-password
 * Authenticate using username or email + password. Returns JWT.
 */
authRouter.post("/login-password", loginPassword);

/**
 * POST /api/auth/otp-request
 * Generate a 6-digit OTP and email it to the registered address.
 */
authRouter.post("/otp-request", otpRequest);

/**
 * POST /api/auth/otp-verify
 * Cross-reference the submitted OTP and issue a JWT on success.
 */
authRouter.post("/otp-verify", otpVerify);

/**
 * POST /api/auth/google
 * Accept a Google ID token, provision or retrieve the account, and return a JWT.
 */
authRouter.post("/google", googleAuth);

/**
 * POST /api/auth/link-google
 * Link a Google ID token to the active session account.
 */
authRouter.post("/link-google", requireAuth as any, linkGoogleAccount as any);

/**
 * POST /api/auth/unlink-google
 * Unlink a Google ID token from the active session account.
 */
authRouter.post("/unlink-google", requireAuth as any, unlinkGoogleAccount as any);

// Multi-Step Registration Routes
/**
 * POST /api/auth/register/send-otp
 * Step 1: Validate email, ensure uniqueness, generate OTP, and email it.
 */
authRouter.post("/register/send-otp", registerSendOTP);

/**
 * POST /api/auth/register/verify-otp
 * Step 2: Cross-reference OTP and return a short-lived registration verification JWT.
 */
authRouter.post("/register/verify-otp", registerVerifyOTP);

/**
 * GET /api/auth/check-username?username=xyz
 * Non-blocking username availability probe. Returns { available: boolean }.
 */
authRouter.get("/check-username", checkUsername);

/**
 * POST /api/auth/register/complete
 * Step 3: Verify the registration JWT, hash password, create Crew record, return auth JWT.
 */
authRouter.post("/register/complete", registerComplete);

export { authRouter };
