import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { FaMapPin } from "react-icons/fa6";
import { Timeline } from "@/types/timeline";

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

const pinVariants = {
  hidden: { scale: 0, opacity: 0, filter: "blur(4px)" },
  visible: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: [0.175, 0.885, 0.32, 1.275] as const, // Equivalent to back.out(1.7)
      filter: { ease: "easeOut" }, // Prevent negative blur overshoot
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      delay: 0.1, // delay after pin
      ease: [0.22, 1, 0.36, 1] as const, // Equivalent to power3.out
    },
  },
};

export default function AboutJourney({ timeline }: AboutJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  // Dynamic height based on number of items (approx 300px per item)
  const dynamicHeight = Math.max(800, timeline.length * 300);

  return (
    <section
      ref={containerRef}
      className="py-12 lg:py-22 bg-[var(--color-bg)] relative overflow-hidden"
      style={{ position: "relative" }}
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
            className="absolute inset-0 size-full pointer-events-none"
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
            <motion.path
              style={{ pathLength: scrollYProgress }}
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
              <motion.div
                key={item._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-100px" }}
                className="absolute w-full"
                style={{ top: `${y}%`, left: 0, height: 0 }}
              >
                {/* Pin Wrapper */}
                <div
                  className="absolute z-20 flex items-center justify-center"
                  style={{ left: `${x}%`, transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    variants={pinVariants}
                    className="size-12 bg-slate-950 rounded-full flex items-center justify-center border border-white/20 shadow-2xl"
                  >
                    <FaMapPin className="size-5 text-white" />
                    <div className="absolute -inset-1.5 rounded-full border border-white/10 animate-pulse pointer-events-none" />
                  </motion.div>
                </div>

                {/* Card Wrapper */}
                <div
                  className={`absolute w-[calc(100vw-80px)] lg:w-[400px] xl:w-[420px] z-30 transition-all duration-300 ${
                    side === "right"
                      ? "pl-12 lg:pl-14"
                      : "pr-12 lg:pr-14 text-right"
                  }`}
                  style={{
                    top: "0",
                    left: `${x}%`,
                    transform:
                      side === "right"
                        ? "translate(0%, -50%)"
                        : "translate(-100%, -50%)",
                  }}
                >
                  <motion.div variants={cardVariants}>
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
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Experience */}
        <div className="lg:hidden relative">
          {/* Vertical Gradient Line */}
          <div className="absolute left-1 top-2 bottom-2 w-[3px] bg-gradient-to-b from-red-500 via-blue-500 to-amber-500 opacity-30 rounded-full" />

          <div className="space-y-8">
            {timeline.map((item) => (
              <motion.div
                key={item.year}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-50px" }}
                className="relative flex items-start pl-12 pr-2"
              >
                {/* Pin */}
                <motion.div variants={pinVariants} className="absolute top-0 left-[5.5px] -ml-5 z-20 pt-1">
                  <div className="size-10 bg-[var(--color-bg)]/95 rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                    <FaMapPin className="size-4 text-white" />
                  </div>
                </motion.div>
                {/* Card */}
                <motion.div variants={cardVariants} className="flex-1 z-30">
                  <div className="bg-[var(--color-bg)]/95 border border-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
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
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
