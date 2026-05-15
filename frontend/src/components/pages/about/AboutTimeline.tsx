import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: "2019",
    event: "First ride. Ladakh. 12 riders. One borrowed tent. No regrets.",
  },
  {
    year: "2020",
    event:
      "Locked down but not out — we built the community online, planned the routes, sharpened the code.",
  },
  {
    year: "2021",
    event:
      "First official MotoXCode group ride. 34 riders. Western Ghats. Zero incidents.",
  },
  {
    year: "2022",
    event: "Hit 200 members. Launched our first safety certification program.",
  },
  {
    year: "2023",
    event:
      "Spiti expedition. 22 riders. 7 days. The hardest thing most of us had ever done.",
  },
  { year: "2024", event: "Crossed 500 active members. 80+ rides. 12 states." },
];

export default function AboutTimeline() {
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, storyRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={storyRef} className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-black mb-20 text-center text-[clamp(2.5rem,5vw,4.5rem)] text-primary">
            The Journey
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-16 md:left-[5.5rem] top-0 bottom-0 w-px hidden md:block opacity-30 bg-gradient-to-b from-transparent via-accent to-transparent" />
            <div className="space-y-0">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="timeline-item flex flex-col md:flex-row gap-6 md:gap-20 items-start py-10 border-b border-white/5"
                >
                  <div className="flex-shrink-0 w-24 font-heading font-black text-accent text-3xl leading-none">
                    {item.year}
                  </div>
                  <p className="font-body text-xl lg:text-2xl leading-relaxed text-secondary">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
