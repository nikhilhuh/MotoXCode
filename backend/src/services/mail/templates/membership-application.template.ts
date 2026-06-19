import { ITemplatePayload } from "./interfaces";

interface MembershipApplicationData {
  name: string;
  email: string;
  phone?: string;
  location: string;
  bike: string;
  experience: string;
  why: string;
  ridden?: string;
  submittedAt?: string;
}

/**
 * Generates the HTML email sent to the inquiry receiver
 * whenever someone submits a membership / Join Us application.
 */
export function generateMembershipApplicationTemplate(
  data: MembershipApplicationData
): ITemplatePayload {
  const {
    name,
    email,
    phone,
    location,
    bike,
    experience,
    why,
    ridden,
    submittedAt,
  } = data;

  const displayDate =
    submittedAt ||
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Sanitise text fields for safe HTML rendering
  function safe(str?: string): string {
    if (!str) return "—";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");
  }

  const fieldRow = (label: string, value: string) => `
    <div class="field">
      <div class="field-label">${label}</div>
      <div class="field-value">${value}</div>
    </div>`;

  return {
    subject: `New Membership Application — ${name} (${bike})`,
    text: [
      `New membership application received on MotoXCode`,
      ``,
      `Name       : ${name}`,
      `Email      : ${email}`,
      `Phone      : ${phone || "Not provided"}`,
      `Location   : ${location}`,
      `Bike       : ${bike}`,
      `Experience : ${experience}`,
      `Submitted  : ${displayDate}`,
      ``,
      `Routes Ridden:`,
      ridden || "Not provided",
      ``,
      `Why MotoXCode:`,
      why,
    ].join("\n"),
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Membership Application — MotoXCode</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; font-family: Inter, 'Segoe UI', sans-serif; color: #f1f5f9; }
    .container { max-width: 580px; margin: 48px auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a0a00 0%, #0f172a 100%); padding: 32px 36px; border-bottom: 1px solid #1e293b; }
    .brand { font-size: 20px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: #f8fafc; }
    .brand span { color: #ff5a1f; }
    .badge { display: inline-block; margin-top: 10px; background: #ff5a1f22; color: #ff5a1f; border: 1px solid #ff5a1f44; border-radius: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; }
    .body { padding: 32px 36px 28px; }
    .section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #475569; margin-bottom: 14px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
    .field { margin-bottom: 18px; }
    .field-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .field-value { font-size: 14px; color: #e2e8f0; line-height: 1.5; }
    .field-value a { color: #ff5a1f; text-decoration: none; }
    .divider { height: 1px; background: #1e293b; margin: 24px 0; }
    .message-box { background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 18px 20px; margin-top: 8px; }
    .message-text { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin: 0; }
    .footer { padding: 20px 36px 24px; border-top: 1px solid #1e293b; text-align: center; }
    .footer-text { font-size: 11px; color: #334155; line-height: 1.6; }
    .reply-btn { display: inline-block; margin-top: 20px; background-color: #ff5a1f; color: #fff; text-decoration: none; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 28px; border-radius: 8px; }
    .status-pill { display: inline-block; background: #fbbf2422; color: #fbbf24; border: 1px solid #fbbf2444; border-radius: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 10px; margin-left: 10px; vertical-align: middle; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Moto<span>X</span>Code</div>
      <div class="badge">🏍️ New Application</div>
    </div>

    <div class="body">

      <p class="section-title">Applicant Details</p>
      <div class="grid-2">
        ${fieldRow("Name", safe(name))}
        ${fieldRow("Email", `<a href="mailto:${email}">${safe(email)}</a>`)}
        ${fieldRow("Phone", safe(phone) === "—" ? "Not provided" : safe(phone))}
        ${fieldRow("City / Location", safe(location))}
      </div>

      <div class="divider"></div>

      <p class="section-title">Riding Profile</p>
      <div class="grid-2">
        ${fieldRow("Bike", safe(bike))}
        ${fieldRow("Experience", safe(experience))}
      </div>
      ${fieldRow("Submitted", displayDate)}

      <div class="divider"></div>

      <p class="section-title">Routes & Trips Ridden</p>
      <div class="message-box">
        <p class="message-text">${safe(ridden) === "—" ? "Not provided" : safe(ridden)}</p>
      </div>

      <div class="divider"></div>

      <p class="section-title">Why MotoXCode?</p>
      <div class="message-box">
        <p class="message-text">${safe(why)}</p>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="mailto:${email}?subject=Re: Your MotoXCode Membership Application" class="reply-btn">
          Reply to ${safe(name)}
        </a>
      </div>
    </div>

    <div class="footer">
      <p class="footer-text">
        This email was automatically generated from the MotoXCode membership application form.<br />
        Do not reply to this email — use the button above to reply directly to the applicant.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}
