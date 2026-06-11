import nodemailer from "nodemailer";
import { env } from "../../../config/env.config";
import { IMailProvider, MailOptions } from "../interfaces";

export class NodemailerProvider implements IMailProvider {
  private transport: nodemailer.Transporter;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for port 465, false for 587
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    console.log("[MAIL] Provider: Nodemailer");
  }

  async send(options: MailOptions): Promise<void> {
    await this.transport.sendMail({
      from: `"MotoXCode" <${env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
