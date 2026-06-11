export interface ITemplatePayload {
  subject: string;
  text: string;
  html: string;
}

export type TemplateGenerator<T = any> = (data: T) => ITemplatePayload;
