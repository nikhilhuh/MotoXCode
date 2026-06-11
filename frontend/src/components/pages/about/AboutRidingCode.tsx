import { motion } from "framer-motion";
import { RidingCode } from "@/types/ridingCode";

interface AboutRidingCodeProps {
  ridingCode: RidingCode[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1] as const, // Equivalent to power4.out
    },
  }),
};

export default function AboutRidingCode({ ridingCode }: AboutRidingCodeProps) {
  // Pool of vibrant accent colors
  const accentColors = [
    "text-red-500",
    "text-orange-500",
    "text-blue-500",
    "text-emerald-500",
    "text-amber-500",
    "text-purple-500",
    "text-cyan-500",
    "text-rose-500",
  ];

  return (
    <motion.section
      id="riding-code"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="py-12 lg:py-22 bg-gradient-to-b from-[var(--color-bg)] to-black relative overflow-hidden"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
        <h2 className="section-heading">The Riding Code</h2>
        <p className="section-subheading">Five Principles. Non-Negotiable.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ridingCode.map((item, i) => {
            const accentClass = accentColors[i % accentColors.length];
            return (
              <motion.div key={item.rule} custom={i} variants={itemVariants} className="group relative">
                {/* Premium Glassmorphic Card */}
                <div className="h-full bg-slate-950/98 border border-white/10 backdrop-blur-2xl p-8 lg:p-10 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col">
                  {/* Rule Number - Large, Transparent background */}
                  <div className="absolute -top-4 -right-4 font-heading font-black text-9xl text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors duration-500">
                    {i + 1}
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col gap-1 mb-6">
                      <span
                        className={`font-mono text-[0.65rem] font-bold tracking-[0.4em] uppercase ${accentClass}`}
                      >
                        Rule {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading font-black text-3xl lg:text-4xl tracking-tight text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {item.rule}
                      </h3>
                    </div>
                    <p className="font-body text-base leading-relaxed text-[var(--color-text-secondary)]/90 selection:bg-white/10">
                      {item.detail}
                    </p>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                </div>
              </motion.div>
            );
          })}

          {/* Special Mission Card */}
          <motion.div custom={ridingCode.length} variants={itemVariants} className="group lg:col-span-1 md:col-span-2 lg:col-start-2">
            <div className="h-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 backdrop-blur-2xl p-8 lg:p-10 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-center items-center text-center">
              <p className="font-mono text-[0.7rem] font-bold tracking-[0.4em] text-[var(--color-primary)] uppercase mb-4">
                Final Clause
              </p>
              <h3 className="font-heading font-black text-2xl tracking-tight text-white mb-2">
                Respect the Pack
              </h3>
              <p className="font-body text-sm text-white/70 italic">
                "One team, one ride, one code."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
