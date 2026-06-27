import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const, // power2.out
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const, // power3.out
    },
  },
};

export default function SignInCTA() {
  return (
    <section className="relative bg-gradient-to-b from-[var(--color-bg)] to-black py-32 px-6 overflow-hidden">
      {/* Radial glow centre */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(248,250,252,0.05)_0%,transparent_80%)] pointer-events-none" />

      {/* Corner accent blobs */}
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-[var(--color-highlight)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent)]/10 blur-[140px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Glassmorphism Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)]/40 bg-[var(--color-section)]/30 backdrop-blur-xl p-10 md:p-16 lg:p-20 shadow-[0_30px_80px_rgba(0,0,0,0.6)] text-center flex flex-col items-center group">
          {/* Card inner subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.25em] uppercase px-5 py-2.5 rounded-full border border-[var(--color-highlight)]/30 text-[var(--color-highlight)] bg-[var(--color-highlight)]/10 mb-8 shadow-[0_0_20px_rgba(255,90,31,0.1)]"
          >
            <span className="size-1.5 rounded-full bg-[var(--color-highlight)] animate-pulse shadow-[0_0_10px_rgba(255,90,31,0.8)]" />
            Welcome Back
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="font-[var(--font-heading)] font-black text-[clamp(2rem,6vw,5.5rem)] text-[var(--color-primary)] leading-[0.95] tracking-tight uppercase mb-6 drop-shadow-lg"
          >
            Return to the <br className="hidden sm:block" />{" "}
            <span className="text-[var(--color-accent)]">Brotherhood</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="font-body text-lg lg:text-xl mb-12 max-w-xl leading-relaxed text-[var(--color-text-secondary)]"
          >
            Your garage awaits. Access your dashboard, connect with the crew,
            and track your next milestones on the open road.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto z-20"
          >
            <Link
              to="/signin"
              className="btn-primary px-12 py-5 text-sm w-full sm:w-auto group/btn"
            >
              Ignite Engine
              <svg
                className="transform transition-transform duration-300 group-hover/btn:translate-x-1"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
