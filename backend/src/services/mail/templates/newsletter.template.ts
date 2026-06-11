import { ITemplatePayload } from "./interfaces";

export function generateNewsletterTemplate(data: { title: string, content: string }): ITemplatePayload {
  const { title, content } = data;
  return {
    subject: `MotoXCode Newsletter: ${title}`,
    text: `Newsletter: ${title}\n\n${content}`,
    html: `<h2>${title}</h2><p>${content}</p>`,
  };
}
