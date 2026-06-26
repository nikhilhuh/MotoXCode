import { ProviderFactory } from "./provider.factory";
import { IMailProvider } from "./interfaces";
import { TemplateRegistry } from "./templates";

export interface GenericMailOptions {
  template: string;
  to: string;
  data?: any;
}

/**
 * MailService acts as a facade for the email infrastructure.
 * It uses the ProviderFactory to select the appropriate email provider based on the environment.
 * It relies on the TemplateRegistry to dynamically generate email content.
 */
class MailServiceFacade {
  private provider: IMailProvider;

  constructor() {
    this.provider = ProviderFactory.createProvider();
  }

  /**
   * Send an email using a registered template.
   * Fire-and-forget — handles graceful error logging to prevent crashes.
   */
  async send(options: GenericMailOptions): Promise<void> {
    try {
      const generator = TemplateRegistry.get(options.template);
      const payload = generator(options.data || {});

      console.log(`[MAIL] Template: ${options.template}`);

      await this.provider.send({
        to: options.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });

      console.log(`[MAIL] Sent Successfully to ${options.to}`);
    } catch (err) {
      console.error("[MAIL] Sending Failed: ", err);
    }
  }
}

export const MailService = new MailServiceFacade();
