import { motion } from "framer-motion";
import type { Profile as ProfileType } from "../../../types/profile";

interface DisciplinaryRecordProps {
  profile: ProfileType | null;
}

export default function DisciplinaryRecord({ profile }: DisciplinaryRecordProps) {
  const count = profile?.strikes ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-auto mt-8"
    >
      {/* Mobile: flat. md+: matches ProfileStats/ProfileGarage card exactly */}
      <div
        className={`transition-all duration-500
          md:bg-gradient-to-b md:from-white/[0.04] md:to-transparent
          md:border md:border-white/[0.05]
          md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
          md:rounded-[2rem] md:p-10 md:backdrop-blur-sm
          md:hover:border-white/[0.08]
        `}
      >
        {/* Section heading — responsive typography */}
        <span className="block font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-4 pb-3 border-b border-white/10 md:font-accent md:text-xs lg:text-sm md:tracking-[0.25em] md:text-white/40 md:pb-0 md:border-none md:mb-3">
          Disciplinary Record
        </span>

        {/* Strike count — scales up massively on large screens */}
        <div className="flex items-end justify-between gap-4">
          <span
            className={`font-heading text-6xl sm:text-7xl lg:text-8xl font-black leading-none drop-shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)] flex items-baseline gap-3
              ${count === 0 ? "text-[var(--color-accent)]" : count === 1 ? "text-amber-400" : "text-red-400"}
            `}
          >
            {count}
            <span className="text-sm sm:text-base lg:text-lg font-accent font-bold uppercase tracking-[0.3em] text-white/40">
              {count === 1 ? "Strike" : "Strikes"}
            </span>
          </span>

          {/* Pip dots */}
          <div className="flex items-center gap-2 pb-2">
            {[0, 1, 2].map((pip) => (
              <div
                key={pip}
                className={`w-3 h-3 rounded-full border transition-all duration-300
                  ${
                    pip < count
                      ? pip === 0
                        ? "bg-amber-400 border-amber-400"
                        : "bg-red-400 border-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]"
                      : "bg-transparent border-white/20"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
