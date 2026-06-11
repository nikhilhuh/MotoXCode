import { ITemplatePayload } from "./interfaces";

export function generateOTPTemplate(data: { otp: string }): ITemplatePayload {
  const { otp } = data;
  return {
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
    `.trim()
  };
}
