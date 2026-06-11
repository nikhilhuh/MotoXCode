import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.config";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;       // Crew _id
  username: string;
  role: string;
}

export interface GooglePayload {
  sub: string;       // Google user ID
  email: string;
  name?: string;
  picture?: string;
}

// ─── Google Client (singleton) ───────────────────────────────────────────────

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// ─── Password Utilities ───────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Verify a plain-text password against a stored hash.
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── JWT Utilities ────────────────────────────────────────────────────────────

/**
 * Issue a stateless JWT access token signed with the application secret.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

/**
 * Verify and decode a JWT access token.
 * Throws if invalid or expired.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

// ─── Google OAuth Verification ────────────────────────────────────────────────

/**
 * Shape of the Google tokeninfo endpoint response used in the access-token
 * fallback path.
 */
interface GoogleTokenInfoResponse {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  error_description?: string;
}

/**
 * Verify a Google credential and return a normalised GooglePayload.
 *
 * Primary path (id_token — 3-segment JWT):
 *   Verifies the token cryptographically using `googleClient.verifyIdToken()`.
 *   This is the only path triggered by the `GoogleLogin` component.
 *
 * Robustness fallback (access_token — starts with "ya29."):
 *   If an opaque OAuth2 access_token reaches this service (e.g. from a
 *   legacy client build still in the browser cache), it is exchanged via
 *   Google's public tokeninfo endpoint instead of crashing with
 *   "Wrong number of segments in token".
 */
export async function verifyGoogleToken(credential: string): Promise<GooglePayload> {
  // ── Robustness guard: access_token fallback ───────────────────────────────
  if (credential.startsWith("ya29.")) {
    const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(credential)}`;
    const res = await fetch(url);
    const data = (await res.json()) as GoogleTokenInfoResponse;

    if (!res.ok || data.error_description || !data.email || !data.sub) {
      throw new Error(
        data.error_description ??
          "Google access token validation failed. Please sign in again."
      );
    }

    return {
      sub: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  }

  // ── Primary path: id_token (3-segment JWT) ────────────────────────────────
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Google token payload");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

// ─── OTP Generator ────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure 6-digit numeric OTP string.
 * Uses crypto.getRandomValues for a uniform distribution.
 */
export function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Modulo 900000 gives 0–899999, adding 100000 guarantees 6 digits
  const otp = (array[0]! % 900000) + 100000;
  return String(otp);
}
