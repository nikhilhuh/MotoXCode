import { Resend } from "resend";
import { env } from "../../../config/env.config";
import { IMailProvider, MailOptions } from "../interfaces";

export class ResendProvider implements IMailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY || "");
    console.log("[MAIL] Provider: Resend");
  }

  async send(options: MailOptions): Promise<void> {
    const { data, error } = await this.resend.emails.send({
      from: `MotoXCode <${env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || "",
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
