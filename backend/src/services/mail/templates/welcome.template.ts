import { ITemplatePayload } from "./interfaces";

export function generateWelcomeTemplate(data: { name: string }): ITemplatePayload {
  const { name } = data;
  return {
    subject: "Welcome to MotoXCode!",
    text: `Hello ${name}, welcome to MotoXCode!`,
    html: `<p>Hello ${name}, welcome to <strong>MotoXCode</strong>!</p>`,
  };
}
