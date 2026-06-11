import { IMailProvider } from "./interfaces";
import { NodemailerProvider } from "./providers/nodemailer.provider";
import { ResendProvider } from "./providers/resend.provider";
import { env } from "../../config/env.config";

export class ProviderFactory {
  static createProvider(): IMailProvider {
    console.log(`[MAIL] Environment: ${env.NODE_ENV}`);
    if (env.NODE_ENV === "production") {
      return new ResendProvider();
    }
    return new NodemailerProvider();
  }
}
