import { ITemplatePayload } from "./interfaces";

interface WelcomeData {
  username: string;
  email: string;
}

/**
 * Generates the welcome email sent to every new member
 * immediately after their account is successfully created.
 * Sent for both email/password sign-ups and Google sign-ups.
 */
export function generateWelcomeTemplate(data: WelcomeData): ITemplatePayload {
  const { username, email } = data;

  return {
    subject: `Welcome to MotoXCode, ${username}! 🏍️`,
    text: [
      `Hey ${username},`,
      ``,
      `Welcome to MotoXCode — where riders connect, ride, and grow together.`,
      ``,
      `Your account is all set. Here's what you can do next:`,
      `  • Browse upcoming rides and events`,
      `  • Apply for crew membership`,
      `  • Connect with fellow riders`,
      ``,
      `If you have any questions, just reply to this email or reach us through the Contact page.`,
      ``,
      `Ride safe,`,
      `The MotoXCode Team`,
    ].join("\n"),
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to MotoXCode</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; font-family: Inter, 'Segoe UI', sans-serif; color: #f1f5f9; }
    .container { max-width: 560px; margin: 48px auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a0a00 0%, #0f172a 60%); padding: 40px 36px 32px; border-bottom: 1px solid #1e293b; text-align: center; }
    .brand { font-size: 24px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #f8fafc; }
    .brand span { color: #ff5a1f; }
    .tagline { margin-top: 6px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #475569; }
    .hero-badge { display: inline-block; margin-top: 20px; background: #ff5a1f22; color: #ff5a1f; border: 1px solid #ff5a1f55; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 16px; }
    .body { padding: 36px 36px 28px; }
    .greeting { font-size: 22px; font-weight: 800; color: #f8fafc; margin-bottom: 12px; }
    .greeting span { color: #ff5a1f; }
    .intro { font-size: 14px; color: #94a3b8; line-height: 1.7; margin-bottom: 28px; }
    .divider { height: 1px; background: #1e293b; margin: 24px 0; }
    .section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #475569; margin-bottom: 16px; }
    .feature-list { list-style: none; padding: 0; margin: 0; }
    .feature-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
    .feature-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff5a1f; flex-shrink: 0; margin-top: 7px; }
    .feature-text { font-size: 13px; color: #cbd5e1; line-height: 1.6; }
    .feature-text strong { color: #f8fafc; font-weight: 600; }
    .cta-wrap { text-align: center; margin: 32px 0 8px; }
    .cta-btn { display: inline-block; background: #ff5a1f; color: #fff; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; padding: 14px 32px; border-radius: 10px; }
    .footer { padding: 20px 36px 24px; border-top: 1px solid #1e293b; }
    .footer-text { font-size: 11px; color: #334155; line-height: 1.7; text-align: center; }
    .footer-text a { color: #475569; text-decoration: none; }
    .account-pill { display: inline-block; background: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 3px 10px; font-family: monospace; font-size: 12px; color: #64748b; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <div class="brand">Moto<span>X</span>Code</div>
      <div class="tagline">Ride Together. Grow Together.</div>
      <div class="hero-badge">🏍️ New Member</div>
    </div>

    <!-- Body -->
    <div class="body">
      <div class="greeting">Hey, <span>${username}</span>!</div>
      <p class="intro">
        You're officially part of the MotoXCode family. Whether you're here to join crew rides, connect with fellow riders, or just explore the community — you're in the right place.
      </p>

      <p class="section-title">What's next for you</p>
      <ul class="feature-list">
        <li>
          <div class="feature-dot"></div>
          <div class="feature-text"><strong>Browse Rides & Events</strong> — Find upcoming group rides and events near you.</div>
        </li>
        <li>
          <div class="feature-dot"></div>
          <div class="feature-text"><strong>Apply for Crew Membership</strong> — Take the next step and become an official crew member.</div>
        </li>
        <li>
          <div class="feature-dot"></div>
          <div class="feature-text"><strong>Complete Your Profile</strong> — Add your bike, avatar, and riding story.</div>
        </li>
        <li>
          <div class="feature-dot"></div>
          <div class="feature-text"><strong>Connect</strong> — Reach out to the crew through the Contact page anytime.</div>
        </li>
      </ul>

      <div class="divider"></div>

      <div class="cta-wrap">
        <a href="https://motoxcode.com/rides" class="cta-btn">Explore Rides</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        This welcome email was sent to<br />
        <span class="account-pill">${email}</span><br /><br />
        If you didn't create this account, please <a href="mailto:${email}">contact us</a> immediately.<br />
        © MotoXCode — All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
    `.trim(),
  };
}
