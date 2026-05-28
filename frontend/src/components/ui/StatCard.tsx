import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatCardProps {
  target: number;
  suffix: string;
  label: string;
  image: string;
  isFloat?: boolean;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({ target, suffix, label, image, isFloat, index }) => {
  const [value, setValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      // Animate number count-up
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          setValue(isFloat ? Number(obj.val.toFixed(1)) : Math.floor(obj.val));
        }
      });
    });

    return () => ctx.revert();
  }, [target, isFloat, index]);

  return (
    <div 
      ref={cardRef} 
      className="stat-card relative flex flex-col overflow-hidden rounded-[2rem] bg-[var(--color-surface)]/20 backdrop-blur-xl border border-[var(--color-border)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-[var(--color-surface)]/40 hover:border-[var(--color-accent)]/50 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-500 group"
    >
      <div className="w-full overflow-hidden relative border-b border-[var(--color-border)]/50">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] to-transparent z-10 opacity-60 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-40"></div>
        <img src={image} alt={label} className="size-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out aspect-1" />
      </div>

      <div className="flex flex-col items-center sm:items-start p-6 lg:p-8 relative z-20">
        <div className="font-[var(--font-heading)] font-black text-[clamp(3rem,5vw,4rem)] text-[var(--color-primary)] mb-1 leading-none tracking-tight drop-shadow-md">
          {value}{suffix}
        </div>
        <div className="font-[var(--font-sub)] text-xs lg:text-sm font-bold tracking-[0.15em] text-[var(--color-accent)] uppercase">
          {label}
        </div>
      </div>
    </div>
  );
};