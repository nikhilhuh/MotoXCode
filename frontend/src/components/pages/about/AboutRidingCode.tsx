import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const code = [
  {
    rule: "Gear Up Always",
    detail: "Every ride, every time. ATGATT is not a suggestion.",
  },
  {
    rule: "Ride Your Own Ride",
    detail:
      "No peer pressure on pace. No judgement on ability. Everyone finishes together.",
  },
  {
    rule: "Leave No Rider Behind",
    detail: "If someone needs help on the road, we stop. Period.",
  },
  {
    rule: "Respect the Road",
    detail: "Communities, villages, wildlife — we move through with care.",
  },
  {
    rule: "Earn Your Stripes",
    detail: "Trust in this community is built through rides, not talk.",
  },
];

export default function AboutRidingCode() {
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".code-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: codeRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, codeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={codeRef}
      className="py-32 bg-gradient-to-b from-section to-[#0F0F0F]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full border border-none text-accent bg-accent/10 mb-6">
            Our Creed
          </span>
          <h2 className="font-heading font-black mb-6 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
            The Riding Code
          </h2>
          <p className="font-body text-xl text-secondary">
            Five principles. Non-negotiable.
          </p>
        </div>
        <div className="flex flex-col gap-12 max-w-4xl mx-auto">
          {code.map((item, i) => (
            <div
              key={item.rule}
              className="code-item flex flex-col sm:flex-row items-start gap-8 sm:gap-12 p-8 rounded-2xl transition-colors duration-300 hover:bg-white/5"
            >
              <div className="font-heading font-black text-6xl opacity-30 shrink-0 text-accent leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl lg:text-3xl mb-3 text-primary">
                  {item.rule}
                </h3>
                <p className="font-body text-lg leading-relaxed text-secondary">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
