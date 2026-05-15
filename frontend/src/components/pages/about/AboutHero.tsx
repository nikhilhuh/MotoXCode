import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex items-end overflow-hidden bg-bg pt-40 pb-24 min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(217,95,0,0.1)_0%,transparent_70%)]" />
      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10"
        ref={heroRef}
      >
        <div className="hero-item mb-8">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full border border-none text-accent bg-accent/10">
            Our Story
          </span>
        </div>
        <h1 className="hero-item font-heading font-black mb-8 text-[clamp(4rem,8vw,7rem)] text-primary leading-none">
          Built on Asphalt,
          <br />
          <span className="text-accent">Bonded by Grit</span>
        </h1>
        <p className="hero-item font-body text-xl lg:text-2xl max-w-2xl leading-relaxed text-secondary">
          MotoXCode was never supposed to be this big. It started as an
          obsession. It became a movement.
        </p>
      </div>
    </section>
  );
}
