import { ITemplatePayload } from "./interfaces";

export function generateCustomTemplate(data: { subject: string, html: string, text?: string }): ITemplatePayload {
  const { subject, html, text } = data;
  return {
    subject,
    text: text || "This email requires HTML to be displayed properly.",
    html,
  };
}
