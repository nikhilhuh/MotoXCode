import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaMapPin,
  FaEnvelope,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaGlobe,
} from "react-icons/fa6";
import { ContactInfoItem } from "@/types/contactInfo";
import { ContactFormData } from "@/types/contactForm";
import { intakeService } from "@/services";

gsap.registerPlugin(ScrollTrigger);

interface ContactFormProps {
  contactInfo: ContactInfoItem[];
}

const ContactIcon = ({ type, label }: { type?: string; label?: string }) => {
  const normType = (type || label || "").toLowerCase().trim();

  // 1. Matches for Base / Location
  if (
    normType.includes("base") ||
    normType.includes("location") ||
    normType.includes("address") ||
    normType.includes("map")
  ) {
    return <FaMapPin className="size-5 text-[var(--color-primary)]" />;
  }
  // 2. Matches for Email
  if (normType.includes("email") || normType.includes("mail")) {
    return <FaEnvelope className="size-5 text-[var(--color-primary)]" />;
  }
  // 3. Matches for Instagram
  if (normType.includes("instagram") || normType.includes("ig")) {
    return <FaInstagram className="size-5 text-[var(--color-primary)]" />;
  }
  // 4. Matches for WhatsApp
  if (normType.includes("whatsapp") || normType.includes("wa")) {
    return <FaWhatsapp className="size-5 text-[var(--color-primary)]" />;
  }
  // 5. Matches for Phone / Mobile / Call
  if (
    normType.includes("phone") ||
    normType.includes("tel") ||
    normType.includes("mobile") ||
    normType.includes("call") ||
    normType.includes("contact")
  ) {
    return <FaPhone className="size-5 text-[var(--color-primary)]" />;
  }
  // 6. Matches for Website / Web / Link / Globe
  if (
    normType.includes("web") ||
    normType.includes("website") ||
    normType.includes("globe") ||
    normType.includes("link")
  ) {
    return <FaGlobe className="size-5 text-[var(--color-primary)]" />;
  }

  // 7. Fallback character badge (very premium and clean)
  const initial = label ? label.charAt(0).toUpperCase() : "?";
  return (
    <span className="font-[var(--font-mono)] text-sm font-bold text-[var(--color-primary)]">
      {initial}
    </span>
  );
};

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm({ contactInfo }: ContactFormProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, contentRef);
    return () => ctx.revert();
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = e.target;
    const baseName = target.name.split('-').pop() as keyof ContactFormData;
    setFormData((prev) => ({ ...prev, [baseName]: target.value }));
    // Reset all errors in the form when user makes any change
    setErrors({});
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await intakeService.submitContactForm(formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert("Failed to send message. Please try again later.");
    }
  }

  return (
    <section
      id="contact-content"
      className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black border-t border-[var(--color-border)]/20"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch"
        >
          {/* Info Card */}
          <div className="lg:col-span-2 anim-item bg-transparent lg:bg-[var(--color-bg)]/40 lg:border lg:border-[var(--color-border)]/50 lg:backdrop-blur-2xl lg:p-6 lg:rounded-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between">
            <div className="hidden lg:block absolute -top-10 -right-10 size-32 bg-[var(--color-primary)]/5 rounded-full blur-2xl pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6 border-b border-[var(--color-border)]/20 lg:border-0 pb-8">
              <div>
                <div className="mb-8 text-center lg:text-left">
                  <h3 className="font-[var(--font-heading)] font-black text-2xl md:text-3xl lg:text-4xl text-[var(--color-primary)] tracking-wide uppercase mb-1">
                    Contact Info
                  </h3>
                  <p className="font-[var(--font-body)] text-xs lg:text-sm text-[var(--color-text-secondary)]">
                    Reach out directly through any of our channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-6">
                  {contactInfo &&
                    contactInfo.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 group"
                      >
                        <div className="size-12 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)]/30 z-10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                          <ContactIcon type={item.type} label={item.label} />
                        </div>
                        <div>
                          <div className="font-[var(--font-sub)] text-[0.65rem] font-bold uppercase tracking-widest mb-0.5 text-[var(--color-text-secondary)]">
                            {item.label}
                          </div>
                          <div className="font-[var(--font-body)] text-sm text-[var(--color-text-primary)]">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-3 anim-item bg-transparent lg:bg-[var(--color-bg)]/40 lg:border lg:border-[var(--color-border)]/50 lg:backdrop-blur-2xl lg:p-6 lg:rounded-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between">
            <div className="hidden lg:block absolute -bottom-10 -left-10 size-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none z-0"></div>

            {submitted ? (
              <div className="text-center py-16 relative z-10 size-full flex flex-col items-center justify-center">
                <div className="size-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-[0_0_20px_rgba(248,250,252,0.15)] animate-pulse">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="font-[var(--font-heading)] font-black text-4xl mb-2 text-[var(--color-primary)] tracking-wide uppercase">
                  Message Sent
                </h2>
                <p className="font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                  Thanks, {formData.name}. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-8 text-center lg:text-left">
                    <h3 className="font-[var(--font-heading)] font-black text-2xl md:text-3xl lg:text-4xl text-[var(--color-primary)] tracking-wide uppercase mb-1">
                      Send a Message
                    </h3>
                    <p className="font-[var(--font-body)] text-xs lg:text-sm lg:text-base text-[var(--color-text-secondary)]">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </p>
                  </div>

                  <form
                    id="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                        >
                          Name *
                        </label>
                        <input
                          id="contact-name"
                          name="contact-name"
                          type="text"
                          autoComplete="name"
                          aria-label="Name"
                          className={`w-full bg-[var(--color-surface)]/50 border ${errors.name ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && (
                          <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.name}</span>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                        >
                          Email *
                        </label>
                        <input
                          id="contact-email"
                          name="contact-email"
                          type="email"
                          autoComplete="email"
                          aria-label="Email"
                          className={`w-full bg-[var(--color-surface)]/50 border ${errors.email ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.email}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        name="contact-subject"
                        type="text"
                        autoComplete="off"
                        aria-label="Subject"
                        className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="contact-message"
                        rows={5}
                        autoComplete="off"
                        aria-label="Message"
                        className={`w-full bg-[var(--color-surface)]/50 border ${errors.message ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] resize-none`}
                        placeholder="Tell us everything..."
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                      {errors.message && (
                        <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.message}</span>
                      )}
                    </div>
                    <button
                      type="submit"
                      id="contact-submit"
                      className="btn-primary w-full py-4 text-sm font-semibold tracking-[0.06em] uppercase cursor-pointer"
                    >
                      Send Message
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* note */}
        <div className="pt-4 md:pt-6 lg:pt-8 text-center">
          <p className="font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
            We typically respond within 48 hours. For ride inquiries, please
            check the{" "}
            <a
              href="/rides"
              className="text-[var(--color-primary)] hover:underline font-semibold"
            >
              Rides
            </a>{" "}&{" "} 
            <a
              href="/events"
              className="text-[var(--color-primary)] hover:underline font-semibold"
            >
              Events
            </a>{" "}
            pages first.
          </p>
        </div>
      </div>
    </section>
  );
}
