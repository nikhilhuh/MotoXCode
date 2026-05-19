import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Membership } from "@/types/membership";

gsap.registerPlugin(ScrollTrigger);

const experienceLevels = [
  "< 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

export default function JoinForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Membership>({
    name: "",
    email: "",
    phone: "",
    location: "",
    bike: "",
    experience: "",
    why: "",
    ridden: "",
    agree: false,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="join-form"
      className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]"
    >
      {/* Decorative premium ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div
          className="max-w-3xl mx-auto anim-item bg-transparent lg:bg-[var(--color-bg)]/40 lg:border lg:border-[var(--color-border)]/50 lg:backdrop-blur-2xl lg:p-6 lg:rounded-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between"
          ref={formRef}
        >
          <div className="hidden lg:block absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-2xl pointer-events-none z-0"></div>

          {submitted ? (
            <div className="text-center py-20 rounded-xl bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30 backdrop-blur-md relative z-10 w-full h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-[0_0_20px_rgba(248,250,252,0.15)]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-heading font-black text-3xl mb-3 text-[var(--color-primary)] tracking-wide uppercase">
                Application Received
              </h2>
              <p className="font-body text-sm text-[var(--color-text-secondary)]">
                Thank you, {formData.name}. We review every application personally.
                You'll hear from us within 7 days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="membership-form" className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="membership-name"
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="membership-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="membership-email"
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="membership-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="membership-phone"
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Phone
                  </label>
                  <input
                    id="membership-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="membership-location"
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    City / Location *
                  </label>
                  <input
                    id="membership-location"
                    name="location"
                    type="text"
                    required
                    autoComplete="address-level2"
                    className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                    placeholder="Your city"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="membership-bike"
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Your Bike *
                  </label>
                  <input
                    id="membership-bike"
                    name="bike"
                    type="text"
                    required
                    autoComplete="off"
                    className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                    placeholder="Make, model, year"
                    value={formData.bike}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="membership-experience"
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Riding Experience *
                  </label>
                  <div className="relative">
                    <select
                      id="membership-experience"
                      name="experience"
                      required
                      autoComplete="off"
                      className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] appearance-none cursor-pointer"
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option value="" disabled className="bg-[var(--color-surface)]">
                        Select experience
                      </option>
                      {experienceLevels.map((l) => (
                        <option
                          key={l}
                          value={l}
                          className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                        >
                          {l}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-secondary)]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M1 3.5l4 4 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="membership-ridden"
                  className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                >
                  Where have you ridden? (top routes / trips)
                </label>
                <textarea
                  id="membership-ridden"
                  name="ridden"
                  autoComplete="off"
                  className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] resize-none"
                  rows={3}
                  placeholder="E.g. Leh-Ladakh, Coorg, Rajasthan circuit..."
                  value={formData.ridden}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="membership-why"
                  className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                >
                  Why MotoXCode? *
                </label>
                <textarea
                  id="membership-why"
                  name="why"
                  required
                  autoComplete="off"
                  className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] resize-none"
                  rows={4}
                  placeholder="Tell us why you want to ride with us..."
                  value={formData.why}
                  onChange={handleChange}
                />
              </div>
              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  id="membership-agree"
                  name="agree"
                  type="checkbox"
                  required
                  className="mt-1 flex-shrink-0 accent-[var(--color-primary)] w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-surface)]"
                  checked={formData.agree}
                  onChange={handleChange}
                />
                <span className="font-[var(--font-body)] text-xs lg:text-sm text-[var(--color-text-secondary)] select-none">
                  I agree to uphold the MotoXCode riding code and understand that
                  membership is subject to review.
                </span>
              </label>

              <button
                type="submit"
                id="membership-submit"
                className="btn-primary w-full py-4 text-sm font-semibold tracking-[0.06em] uppercase cursor-pointer"
              >
                Submit Application
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
          )}

          {/* Assistance note */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]/20 text-center relative z-10">
            <p className="font-[var(--font-body)] text-xs lg:text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
              Need assistance with your application? Please use our{" "}
              <a
                href="/contact"
                className="text-[var(--color-primary)] hover:underline font-semibold"
              >
                Contact Form
              </a>{" "}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
