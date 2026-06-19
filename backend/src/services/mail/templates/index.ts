import { TemplateGenerator } from "./interfaces";
import { generateOTPTemplate } from "./otp.template";
import { generatePasswordResetTemplate } from "./password-reset.template";
import { generateWelcomeTemplate } from "./welcome.template";
import { generateContactInquiryTemplate } from "./contact-inquiry.template";
import { generateMembershipApplicationTemplate } from "./membership-application.template";

class Registry {
  private templates: Map<string, TemplateGenerator> = new Map();

  constructor() {
    this.register("otp", generateOTPTemplate);
    this.register("password-reset", generatePasswordResetTemplate);
    this.register("welcome", generateWelcomeTemplate);
    this.register("contact-inquiry", generateContactInquiryTemplate);
    this.register("membership-application", generateMembershipApplicationTemplate);
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
