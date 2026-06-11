export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IMailProvider {
  send(options: MailOptions): Promise<void>;
}
