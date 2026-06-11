import { TemplateGenerator } from "./interfaces";
import { generateOTPTemplate } from "./otp.template";
import { generatePasswordResetTemplate } from "./password-reset.template";
import { generateWelcomeTemplate } from "./welcome.template";
import { generateAccountVerificationTemplate } from "./account-verification.template";
import { generateOrderConfirmationTemplate } from "./order-confirmation.template";
import { generateInvoiceTemplate } from "./invoice.template";
import { generateNewsletterTemplate } from "./newsletter.template";
import { generateCustomTemplate } from "./custom.template";

class Registry {
  private templates: Map<string, TemplateGenerator> = new Map();

  constructor() {
    this.register("otp", generateOTPTemplate);
    this.register("password-reset", generatePasswordResetTemplate);
    this.register("welcome", generateWelcomeTemplate);
    this.register("account-verification", generateAccountVerificationTemplate);
    this.register("order-confirmation", generateOrderConfirmationTemplate);
    this.register("invoice", generateInvoiceTemplate);
    this.register("newsletter", generateNewsletterTemplate);
    this.register("custom", generateCustomTemplate);
  }

  register(name: string, generator: TemplateGenerator) {
    this.templates.set(name, generator);
  }

  get(name: string): TemplateGenerator {
    const generator = this.templates.get(name);
    if (!generator) {
      throw new Error(`[MAIL] Template not found: ${name}`);
    }
    return generator;
  }
}

export const TemplateRegistry = new Registry();
