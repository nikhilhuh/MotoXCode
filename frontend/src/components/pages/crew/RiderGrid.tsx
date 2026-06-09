import { Member } from '@/types/member';
import RiderCard from '../../ui/RiderCard';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RiderGridProps {
  riders: Member[];
}

export default function RiderGrid({ riders }: RiderGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rider-row",
        { opacity: 0, x: -20, filter: "blur(5px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (riders.length === 0) return null;

  return (
    <section ref={containerRef} className="py-12 lg:py-24 bg-[var(--color-bg)] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <h2 className="font-heading font-black text-3xl md:text-5xl text-[var(--color-primary)] mb-12 text-center uppercase tracking-wider">
          Our Riders <span className="text-[var(--color-accent)]">Roster</span>
        </h2>
        
        <div className="flex flex-col gap-4">
          {riders.map((member) => (
            <RiderCard key={member.username} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
