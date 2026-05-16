import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaMapPin } from "react-icons/fa6";
import { Timeline } from "@/types/timeline";

gsap.registerPlugin(ScrollTrigger);

// Helper to generate dynamic coordinates and side
const getStepProps = (index: number, total: number) => {
  const yBase = 5;
  const yEnd = 95;
  const y = yBase + (index / (total - 1)) * (yEnd - yBase);

  // Zigzag x pattern
  const xPattern = [50, 25, 75, 30, 70, 50];
  const x = xPattern[index % xPattern.length];

  // INVERSE ALIGNMENT: If pin is on left (x <= 50), card should be on right side
  const side = x <= 50 ? "right" : "left";

  return { x, y, side };
};

interface AboutJourneyProps {
  timeline: Timeline[];
}

export default function AboutJourney({ timeline }: AboutJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Dynamic height based on number of items (approx 300px per item)
  const dynamicHeight = Math.max(800, timeline.length * 300);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Path Drawing Animation (Desktop Only)
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 95%",
            scrub: 0.1,
          },
        });
      }

      // 2. Step Animations
      const steps = gsap.utils.toArray(".journey-step");
      steps.forEach((step: any) => {
        const pin = step.querySelector(".journey-pin");
        const card = step.querySelector(".journey-card");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          pin,
          { scale: 0, opacity: 0, filter: "blur(4px)" },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "back.out(1.7)",
          },
        ).fromTo(
          card,
          { opacity: 0, y: 20, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.1",
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [dynamicHeight]);

  return (
    <section
      ref={containerRef}
      className="py-12 lg:py-22 bg-[var(--color-bg)] relative overflow-hidden"
    >
      {/* Topographic Map Mesh - High Visibility */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'url("/assets/images/about/topographic.png")',
          backgroundSize: "600px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        {/* Section header — centered with adjusted padding for canvas clearance */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
          <h2 className="section-heading">Community Journey</h2>
          <p className="section-subheading">Our Story</p>
        </div>

        {/* Desktop Experience - Dynamic Height */}
        <div
          className="hidden lg:block relative w-full"
          style={{ height: `${dynamicHeight}px` }}
        >
          {/* Map Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient
                id="journeyGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d={timeline.reduce((acc, _, i) => {
                const { x, y } = getStepProps(i, timeline.length);
                if (i === 0) return `M ${x} ${y}`;
                const prev = getStepProps(i - 1, timeline.length);
                const midY = (prev.y + y) / 2;
                return `${acc} C ${prev.x} ${midY}, ${x} ${midY}, ${x} ${y}`;
              }, "")}
              stroke="url(#journeyGradient)"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]"
            />
          </svg>

          {/* Absolute Desktop Items */}
          {timeline.map((item, index) => {
            const { x, y, side } = getStepProps(index, timeline.length);
            return (
              <div
                key={item.year}
                className="journey-step absolute w-full"
                style={{ top: `${y}%`, left: 0, height: 0 }}
              >
                {/* Pin */}
                <div
                  className="journey-pin absolute z-20 flex items-center justify-center"
                  style={{ left: `${x}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                    <FaMapPin className="w-5 h-5 text-white" />
                    <div className="absolute -inset-1.5 rounded-full border border-white/10 animate-pulse pointer-events-none" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`journey-card absolute w-[calc(100vw-80px)] lg:w-[400px] xl:w-[420px] -translate-y-1/2 z-30 transition-all duration-300 ${
                    side === "right"
                      ? "pl-12 lg:pl-14"
                      : "pr-12 lg:pr-14 text-right"
                  }`}
                  style={{
                    left: `${x}%`,
                    transform:
                      side === "right"
                        ? "translate(0%, -50%)"
                        : "translate(-100%, -50%)",
                  }}
                >
                  <div className="bg-slate-950/98 border border-white/10 backdrop-blur-2xl p-6 lg:p-8 rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] hover:border-white/20 transition-all duration-500 group">
                    <div
                      className={`flex flex-col gap-1 mb-3 ${side === "left" ? "items-end" : "items-start"}`}
                    >
                      <span className="font-heading font-black text-4xl lg:text-5xl tracking-tight text-[var(--color-text-primary)] leading-none group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {item.year}
                      </span>
                      <span className="font-mono text-[0.6rem] lg:text-[0.65rem] font-bold tracking-[0.3em] text-[var(--color-accent)] uppercase">
                        {item.location}
                      </span>
                    </div>
                    <p className="font-body text-xs lg:text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
                      {item.event}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Experience */}
        <div className="lg:hidden relative">
          {/* Vertical Gradient Line */}
          <div className="absolute left-6 top-2 bottom-2 w-[3px] bg-gradient-to-b from-red-500 via-blue-500 to-amber-500 opacity-20 rounded-full" />

          <div className="space-y-16">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="journey-step relative flex items-start gap-6 pl-1 pr-2"
              >
                {/* Pin */}
                <div className="journey-pin shrink-0 z-20 pt-1">
                  <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                    <FaMapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
                {/* Card */}
                <div className="journey-card flex-1 z-30">
                  <div className="bg-slate-950/95 border border-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
                    <div className="flex flex-col gap-0.5 mb-2">
                      <span className="font-heading font-black text-3xl text-[var(--color-text-primary)] leading-none">
                        {item.year}
                      </span>
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] text-[var(--color-accent)] uppercase">
                        {item.location}
                      </span>
                    </div>
                    <p className="font-body text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
                      {item.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
