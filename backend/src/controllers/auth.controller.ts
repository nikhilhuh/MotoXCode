import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { AppError } from "../middlewares/error.middleware";
import { Member } from "../models";
import { VerificationToken } from "../models/VerificationToken";
import {
  hashPassword,
  comparePassword,
  signToken,
  verifyGoogleToken,
  generateOTP,
} from "../services/auth.service";
import { MailService } from "../services/mail/mail.service";
import { env } from "../config/env.config";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// ─── Zod Validation Schemas ──────────────────────────────────────────────────

const RegisterSchema = z.object({
  username: z.string().min(3).max(30).trim().toLowerCase(),
  email: z.string().email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) => PASSWORD_REGEX.test(val),
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

const LoginPasswordSchema = z.object({
  identifier: z.string().min(1, "Username or email is required").trim(),
  password: z.string().min(1, "Password is required"),
});

const OTPRequestSchema = z.object({
  email: z.string().email("A valid email is required").trim().toLowerCase(),
});

const OTPVerifySchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

const GoogleAuthSchema = z.object({
  id_token: z.string().min(1, "Google ID token is required"),
  isSignUp: z.boolean(),
});

const LinkGoogleSchema = z.object({
  id_token: z.string().min(1, "Google ID token is required"),
});

// ─── Registration Flow Schemas ────────────────────────────────────────────────

const RegisterSendOTPSchema = z.object({
  email: z.string().email("A valid email is required").trim().toLowerCase(),
});

const RegisterVerifyOTPSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const RegisterCompleteSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  verifiedToken: z.string().min(1, "Verification token is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username may only contain lowercase letters, numbers, and underscores",
    )
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) => PASSWORD_REGEX.test(val),
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

// ─── Registration Verification Token Helpers ──────────────────────────────────

/** The claim shape embedded in registration verification JWTs. */
interface RegistrationVerifyClaim {
  purpose: "registration";
  email: string;
}

/**
 * Issue a short-lived JWT whose sole purpose is to act as a server-signed
 * proof that the given email passed OTP verification.
 * The frontend holds this in component state and submits it at Step 3.
 */
function signRegistrationVerifyToken(email: string): string {
  const payload: RegistrationVerifyClaim = { purpose: "registration", email };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "10m" });
}

/**
 * Decode and validate a registration verification JWT.
 * Throws AppError on tamper, expiry, or wrong purpose.
 */
function verifyRegistrationToken(token: string, expectedEmail: string): void {
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new AppError(
      "Verification token is invalid or has expired. Please restart registration.",
      401,
    );
  }

  const claim = decoded as Partial<RegistrationVerifyClaim>;
  if (claim.purpose !== "registration" || claim.email !== expectedEmail) {
    throw new AppError(
      "Verification token does not match this email. Please restart registration.",
      401,
    );
  }
}

// ─── Shared Safe User Serializer ─────────────────────────────────────────────

/**
 * Serializes a Member document into a public-safe DTO.
 * Extracts minimal fields necessary for frontend session tracking.
 */
function serializeUser(member: InstanceType<typeof Member>) {
  return {
    _id: member._id,
    username: member.username,
    email: member.email,
    role: member.role,
    avatar: member.avatar,
    googleConnected: member.googleConnected,
  };
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Create a new Member account with hashed password.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { username, email, password } = parsed.data;

    const existing = await Member.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new AppError(
        existing.username === username
          ? "Username is already taken"
          : "An account with that email already exists",
        409,
      );
    }

    const hashed = await hashPassword(password);
    const member = await Member.create({ username, email, password: hashed });
    const token = signToken({
      sub: String(member._id),
      username: member.username,
      role: member.role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: serializeUser(member),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login-password
 * Authenticate with username/email + password, issue JWT.
 */
export async function loginPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = LoginPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { identifier, password } = parsed.data;
    const isEmail = identifier.includes("@");

    // Explicitly re-select password (excluded by default on schema)
    const member = await Member.findOne(
      isEmail
        ? { email: identifier.toLowerCase() }
        : { username: identifier.toLowerCase() },
    ).select("+password");

    if (!member || !member.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(password, member.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = signToken({
      sub: String(member._id),
      username: member.username,
      role: member.role,
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token,
      user: serializeUser(member),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/otp-request
 * Generate a 6-digit OTP, cache it (hashed) in MongoDB, and email it.
 */
export async function otpRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = OTPRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email } = parsed.data;

    // Verify the account exists
    const member = await Member.findOne({ email });
    if (!member) {
      throw new AppError("Account not found. Please register first.", 404);
    }

    const otp = generateOTP();
    const hashedOtp = await hashPassword(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upsert: replace any existing token for this email
    await VerificationToken.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt },
      { upsert: true, new: true },
    );

    // Fire-and-forget email (non-blocking)
    MailService.send({
      template: "otp",
      to: email,
      data: { otp },
    });

    res
      .status(200)
      .json({ success: true, message: "OTP sent to your email address." });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/otp-verify
 * Cross-reference OTP, mark account as verified, issue JWT.
 */
export async function otpVerify(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = OTPVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email, otp } = parsed.data;

    const tokenRecord = await VerificationToken.findOne({ email });
    if (!tokenRecord) {
      throw new AppError(
        "OTP has expired or was never requested. Please request a new one.",
        400,
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      await tokenRecord.deleteOne();
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }

    const isMatch = await comparePassword(otp, tokenRecord.otp);
    if (!isMatch) {
      throw new AppError(
        "Invalid OTP. Please check your email and try again.",
        401,
      );
    }

    // Cleanup the used token immediately
    await tokenRecord.deleteOne();

    const member = await Member.findOneAndUpdate(
      { email },
      { $set: { updatedAt: new Date() } },
      { new: true },
    );

    if (!member) {
      throw new AppError("Account not found.", 404);
    }

    const token = signToken({
      sub: String(member._id),
      username: member.username,
      role: member.role,
    });

    res.status(200).json({
      success: true,
      message: "Email verified. Signed in successfully.",
      token,
      user: serializeUser(member),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/google
 * Verify Google ID token, provision or retrieve account, issue JWT.
 */
export async function googleAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = GoogleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { id_token, isSignUp } = parsed.data;
    const googlePayload = await verifyGoogleToken(id_token);

    // Run Pre-Flight Database Evaluation Passes
    const existingUser = await Member.findOne({
      email: googlePayload.email,
    });

    if (isSignUp === false) {
      // IF the request context marks an explicit Sign-In process pass
      if (!existingUser) {
        throw new AppError(
          "No account found matching this Google profile. Please navigate to the sign-up screen to create a new profile.",
          400,
        );
      }

      // If 'existingUser' is found, verify if their 'googleConnected' property matches. If null, update it dynamically.
      if (!existingUser.googleConnected) {
        existingUser.googleConnected = true;
        await existingUser.save();
      }

      const token = signToken({
        sub: String(existingUser._id),
        username: existingUser.username,
        role: existingUser.role,
      });

      res.status(200).json({
        success: true,
        message: "Signed in with Google successfully.",
        token,
        user: serializeUser(existingUser),
      });
      return;
    } else {
      // IF the request context marks an explicit Sign-Up process pass
      if (existingUser) {
        throw new AppError(
          "This email is already registered. Please proceed to the sign-in screen instead.",
          400,
        );
      }

      // If 'existingUser' returns completely null, safely instantiate and provision a brand new data record
      let baseStr = googlePayload.name || googlePayload.email.split("@")[0]!;
      let baseUsername = baseStr.replace(/[^a-z0-9]/gi, "").toLowerCase();

      // Enforce min length of 3 just in case
      if (baseUsername.length < 3) {
        baseUsername = baseUsername.padEnd(3, "0");
      }

      let username = baseUsername.slice(0, 30);
      let isUnique = false;

      while (!isUnique) {
        const exists = await Member.findOne({ username }).select("_id").lean();
        if (!exists) {
          isUnique = true;
        } else {
          // Append a random numeric suffix between 10 and 999
          const suffix = Math.floor(Math.random() * 990) + 10;
          const suffixStr = String(suffix);
          const maxBaseLength = 30 - suffixStr.length;
          const truncatedBase = baseUsername.slice(0, maxBaseLength);
          username = `${truncatedBase}${suffixStr}`;
        }
      }

      const member = await Member.create({
        username,
        email: googlePayload.email,
        name: googlePayload.name,
        avatar: googlePayload.picture,
        googleConnected: true,
      });

      // Fire-and-forget welcome email — non-blocking
      void MailService.send({
        template: "welcome",
        to: member.email,
        data: { username: member.username, email: member.email },
      });

      const token = signToken({
        sub: String(member._id),
        username: member.username,
        role: member.role,
      });

      res.status(201).json({
        success: true,
        message: "Account created successfully. Welcome to MotoXCode!",
        token,
        user: serializeUser(member),
      });
      return;
    }
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/link-google
 * Link a verified Google profile to the currently authenticated session user.
 */
export async function linkGoogleAccount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = LinkGoogleSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    if (!req.user) {
      throw new AppError("Unauthorized session context.", 401);
    }

    const { id_token } = parsed.data;
    const googlePayload = await verifyGoogleToken(id_token);

    // Check if the Google email is already used by ANOTHER user
    const existingOtherUser = await Member.findOne({
      email: googlePayload.email,
      _id: { $ne: req.user._id },
    })
      .select("_id")
      .lean();

    if (existingOtherUser) {
      throw new AppError(
        "This Google account is already linked to another user.",
        409,
      );
    }

    // Perform a targeted atomic mutation updating the active session row
    const updatedUser = await Member.findByIdAndUpdate(
      req.user._id,
      { googleConnected: true, email: googlePayload.email },
      { new: true },
    );

    if (!updatedUser) {
      throw new AppError("User account not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Google account successfully linked.",
      user: serializeUser(updatedUser),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/unlink-google
 * Unlink the Google account from the currently authenticated session user.
 */
export async function unlinkGoogleAccount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized session context.", 401);
    }

    const updatedUser = await Member.findByIdAndUpdate(
      req.user._id,
      { $set: { googleConnected: false } },
      { new: true },
    );

    if (!updatedUser) {
      throw new AppError("User account not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Google account successfully unlinked.",
      user: serializeUser(updatedUser),
    });
  } catch (err) {
    next(err);
  }
}

// ─── Multi-Step Registration Controllers ──────────────────────────────────────

/**
 * POST /api/auth/register/send-otp
 * Step 1: Validate email, ensure it is not already registered,
 * generate a 6-digit OTP, persist it in VerificationToken (TTL 5 min),
 * and fire an OTP email via MailService.
 */
export async function registerSendOTP(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = RegisterSendOTPSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email } = parsed.data;

    // Reject emails already registered to prevent account squatting
    const existing = await Member.findOne({ email }).select("_id").lean();
    if (existing) {
      throw new AppError(
        "An account with that email already exists. Please sign in instead.",
        409,
      );
    }

    const otp = generateOTP();
    const hashedOtp = await hashPassword(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upsert: replace any prior registration OTP for this email
    await VerificationToken.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt },
      { upsert: true, new: true },
    );

    // Fire-and-forget — never blocks the response thread
    MailService.send({
      template: "otp",
      to: email,
      data: { otp },
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address. It is valid for 5 minutes.",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/register/verify-otp
 * Step 2: Cross-reference the submitted OTP against the stored record.
 * On success, delete the record and return a short-lived registration
 * verification JWT. The frontend must present this token at Step 3.
 */
export async function registerVerifyOTP(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = RegisterVerifyOTPSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email, otp } = parsed.data;

    const tokenRecord = await VerificationToken.findOne({ email });
    if (!tokenRecord) {
      throw new AppError(
        "OTP has expired or was never requested. Please request a new one.",
        400,
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      await tokenRecord.deleteOne();
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }

    const isMatch = await comparePassword(otp, tokenRecord.otp);
    if (!isMatch) {
      throw new AppError(
        "Invalid OTP. Please check your email and try again.",
        401,
      );
    }

    // Consume the token immediately — single-use
    await tokenRecord.deleteOne();

    // Issue a registration-purpose proof token (10-minute window)
    const verifiedToken = signRegistrationVerifyToken(email);

    res.status(200).json({
      success: true,
      message:
        "Email verified. Please complete your profile to finish registration.",
      verifiedToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/check-username?username=xyz
 * Lightweight, non-blocking availability probe for the username field.
 * Returns { available: true } or { available: false }.
 */
export async function checkUsername(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = (req.query["username"] as string | undefined)
      ?.toLowerCase()
      .trim();

    if (!username || username.length < 3 || username.length > 30) {
      res.status(200).json({ available: false });
      return;
    }

    // Minimal projection — only load the _id field for max performance
    const exists = await Member.findOne({ username }).select("_id").lean();

    res.status(200).json({ available: !exists });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/register/complete
 * Step 3: Validate the full registration payload, verify the registration JWT,
 * check for username/email conflicts, hash the password, persist the Member
 * document, and return a full auth JWT with a 201 Created response.
 */
export async function registerComplete(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = RegisterCompleteSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email, verifiedToken, username, password } = parsed.data;

    // Guard: the registration verification JWT must be valid and match the email
    verifyRegistrationToken(verifiedToken, email);

    // Guard: prevent duplicate email or username
    const existing = await Member.findOne({ $or: [{ email }, { username }] })
      .select("email")
      .lean();
    if (existing) {
      throw new AppError(
        (existing as { email?: string }).email === email
          ? "An account with that email already exists. Please sign in instead."
          : "That username is already taken. Please choose another.",
        409,
      );
    }

    // Hash with consistent SALT_ROUNDS (12 rounds, as defined in auth.service)
    const hashed = await hashPassword(password);

    const member = await Member.create({
      username,
      email,
      password: hashed,
      role: "rider",
    });

    // Fire-and-forget welcome email — non-blocking
    void MailService.send({
      template: "welcome",
      to: member.email,
      data: { username: member.username, email: member.email },
    });

    const token = signToken({
      sub: String(member._id),
      username: member.username,
      role: member.role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully. Welcome to MotoXCode!",
      token,
      user: serializeUser(member),
    });
  } catch (err) {
    next(err);
  }
}
