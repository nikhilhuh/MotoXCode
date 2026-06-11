import { ITemplatePayload } from "./interfaces";

export function generateAccountVerificationTemplate(data: { verificationLink: string }): ITemplatePayload {
  const { verificationLink } = data;
  return {
    subject: "Verify your MotoXCode Account",
    text: `Please verify your account by clicking the link: ${verificationLink}`,
    html: `<p>Please verify your account by clicking the link: <a href="${verificationLink}">Verify Account</a></p>`,
  };
}
