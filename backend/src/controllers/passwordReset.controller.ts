import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import crypto from "crypto";
import { AppError } from "../middlewares/error.middleware";
import { Member } from "../models";
import { PasswordResetToken } from "../models/PasswordResetToken";
import { sendPasswordResetEmail } from "../services/mail.service";
import { hashPassword } from "../services/auth.service";
import { env } from "../config/env.config";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const ForgotPasswordSchema = z.object({
  email: z.string().email("A valid email is required").trim().toLowerCase(),
});

const VerifyResetTokenSchema = z.object({
  email: z.string().email("A valid email is required").trim().toLowerCase(),
  token: z.string().min(1, "Token is required"),
});

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const ResetPasswordSchema = z.object({
  email: z.string().email("A valid email is required").trim().toLowerCase(),
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) => PASSWORD_REGEX.test(val),
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/forgot-password
 */
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = ForgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email } = parsed.data;
    const user = await Member.findOne({ email });

    if (!user) {
      throw new AppError("No account found with this email address.", 404);
    }

    // Generate a raw secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);

    // Save hashed token
    await PasswordResetToken.create({
      email,
      token: hashedToken,
    });

    // Construct reset link to frontend
    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    // Send email (fire and forget)
    sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/verify-reset-token
 */
export async function verifyResetToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = VerifyResetTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email, token } = parsed.data;
    const hashedToken = hashToken(token);

    const tokenRecord = await PasswordResetToken.findOne({
      email,
      token: hashedToken,
    });
    if (!tokenRecord) {
      throw new AppError(
        "The password reset token is invalid or has expired.",
        400,
      );
    }

    res.status(200).json({ success: true, message: "Token is valid." });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/reset-password
 */
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = ResetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { email, token, newPassword } = parsed.data;
    const hashedToken = hashToken(token);

    const tokenRecord = await PasswordResetToken.findOne({
      email,
      token: hashedToken,
    });
    if (!tokenRecord) {
      throw new AppError(
        "The password reset token is invalid or has expired.",
        400,
      );
    }

    const user = await Member.findOne({ email });
    if (!user) {
      throw new AppError("Account not found.", 404);
    }

    // Hash the new password
    const newHashedPassword = await hashPassword(newPassword);

    // Mutate the user row
    user.password = newHashedPassword;
    await user.save();

    // Invalidate the token
    await PasswordResetToken.deleteMany({ email });

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
}
