import nodemailer from "nodemailer";
import { env } from "../config/env.config";

// ─── Transport (singleton) ────────────────────────────────────────────────────

const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for port 465, false for 587
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// ─── Methods ──────────────────────────────────────────────────────────────────

/**
 * Send a clean OTP email to the given address.
 * Fire-and-forget — does NOT throw so the server thread is never blocked.
 * Errors are logged to stderr for operator visibility.
 */
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  try {
    await transport.sendMail({
      from: `"MotoXCode" <${env.SMTP_FROM}>`,
      to: email,
      subject: "Your MotoXCode OTP",
      text: `Your one-time passcode is: ${otp}\n\nValid for 5 minutes. Do not share it.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MotoXCode OTP</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; font-family: Inter, sans-serif; color: #f1f5f9; }
    .container { max-width: 480px; margin: 48px auto; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 40px 32px; }
    .brand { font-size: 22px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: #f8fafc; margin-bottom: 24px; }
    .label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
    .otp { font-size: 42px; font-weight: 900; letter-spacing: 0.3em; color: #ff5a1f; font-variant-numeric: tabular-nums; }
    .note { margin-top: 24px; font-size: 12px; color: #64748b; line-height: 1.6; }
    .divider { height: 1px; background: #1e293b; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">MotoXCode</div>
    <div class="divider"></div>
    <p class="label">One-Time Passcode</p>
    <div class="otp">${otp}</div>
    <p class="note">
      This code is valid for <strong>5 minutes</strong>.<br />
      Do not share it with anyone. If you did not request this, ignore this email.
    </p>
  </div>
</body>
</html>
      `.trim(),
    });
  } catch (err) {
    console.error("[MailService] Failed to send OTP email:", err);
  }
}

/**
 * Send a password reset email to the given address.
 * Fire-and-forget — does NOT throw so the server thread is never blocked.
 */
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  try {
    await transport.sendMail({
      from: `"MotoXCode" <${env.SMTP_FROM}>`,
      to: email,
      subject: "MotoXCode Password Reset",
      text: `You requested a password reset. Please go to the following link to reset your password: ${resetLink}\n\nThis link is valid for 15 minutes.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MotoXCode Password Reset</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; font-family: Inter, sans-serif; color: #f1f5f9; }
    .container { max-width: 480px; margin: 48px auto; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 40px 32px; }
    .brand { font-size: 22px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: #f8fafc; margin-bottom: 24px; }
    .label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
    .note { margin-top: 24px; font-size: 14px; color: #cbd5e1; line-height: 1.6; }
    .divider { height: 1px; background: #1e293b; margin: 24px 0; }
    .btn { display: inline-block; background-color: #f8fafc; color: #020617; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 9999px; margin-top: 24px; letter-spacing: 0.05em; text-transform: uppercase; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">MotoXCode</div>
    <div class="divider"></div>
    <p class="label">Password Reset</p>
    <p class="note">You recently requested to reset your password for your MotoXCode account.</p>
    <a href="${resetLink}" class="btn">Reset Password</a>
    <p class="note" style="margin-top: 32px; font-size: 12px; color: #64748b;">
      This link is valid for <strong>15 minutes</strong>.<br />
      If you did not request a password reset, please ignore this email or reply to let us know.
    </p>
  </div>
</body>
</html>
      `.trim(),
    });
  } catch (err) {
    console.error("[MailService] Failed to send password reset email:", err);
  }
}
