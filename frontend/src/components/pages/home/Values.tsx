import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Value } from "@/types/value";

gsap.registerPlugin(ScrollTrigger);

interface ValuesProps {
  valuesData: Value[];
}

export default function Values({ valuesData }: ValuesProps) {
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        [".section-heading", ".section-subheading"],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Value Items Animation
      gsap.fromTo(
        ".value-item",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 60%",
            once: true,
          },
        },
      );
    }, valuesRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={valuesRef}
      className="py-12 lg:py-22 bg-gradient-to-b from-[var(--color-section)] via-[var(--color-bg)] to-[var(--color-surface)] relative overflow-hidden"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="mb-12 lg:mb-22 text-center max-w-4xl mx-auto">
          <h2 className="section-heading">THE MOTOXCODE WAY</h2>
          <p className="section-subheading">
            We don't just share a passion for motorcycles. We share a code.
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:gap-20">
          {valuesData.map((v, idx) => (
            <div
              key={v._id}
              className={`value-item flex flex-col lg:flex-row items-center gap-8 lg:gap-16 group ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text Content */}
              <div className="flex-1 max-w-2xl flex flex-col items-start text-left relative">
                <span className="relative z-10 inline-flex items-center gap-2 text-[clamp(0.65rem,1.5vw,0.85rem)] font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full text-[var(--color-primary)] bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 backdrop-blur-md mb-8 group-hover:border-[var(--color-primary)]/30 transition-all duration-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-70"></span>
                  {v.tag}
                </span>

                <div className="relative mb-6">
                  <span className="absolute -top-10 lg:-top-20 -left-2 lg:-left-4 font-[var(--font-heading)] font-black text-[clamp(5rem,15vw,12rem)] leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--color-accent)] opacity-40 select-none pointer-events-none group-hover:opacity-80 group-hover:[-webkit-text-stroke:2px_var(--color-primary)] transition-all duration-700">
                    {idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}
                  </span>
                  <h3 className="relative z-10 font-[var(--font-heading)] font-bold text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--color-primary)] leading-[1.05] tracking-tight">
                    {v.title}
                  </h3>
                </div>

                <p className="relative z-10 font-[var(--font-body)] text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-[var(--color-text-primary)]/80 pl-4 border-l-2 border-[var(--color-border)]/50 group-hover:border-[var(--color-accent)]/80 transition-colors duration-500">
                  {v.description}
                </p>
              </div>

              {/* Image */}
              <div className="w-full lg:flex-1">
                <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden aspect-[21/9] sm:aspect-[16/9] lg:aspect-[16/10] bg-[var(--color-surface)]/20 border border-[var(--color-border)]/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out aspect-1"
                  />
                  {/* Premium overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/90 via-[var(--color-bg)]/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
