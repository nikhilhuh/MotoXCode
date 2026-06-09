import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MemberCard from "../../ui/MemberCard";
import { Member } from "@/types/member";

gsap.registerPlugin(ScrollTrigger);

interface CrewGridProps {
  crew: Member[];
}
export default function CrewGrid({ crew }: CrewGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".crew-card",
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="crew-grid"
      ref={containerRef}
      className="py-12 lg:py-22 bg-[var(--color-bg)] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <h2 className="font-heading font-black text-3xl md:text-5xl text-[var(--color-primary)] mb-10 text-center uppercase tracking-wider">
          Our MVP <span className="text-[var(--color-accent)]">Roster</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {crew.map((member) => (
            <div key={member.username} className="crew-card">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
