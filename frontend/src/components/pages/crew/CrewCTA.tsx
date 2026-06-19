import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const, // power3.out
    },
  },
};

export default function CrewCTA() {
  const { userDetails, isInitialized } = useUser();
  return (
    <section
      id="join"
      className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black border-t border-[var(--color-border)]/20"
    >
      {/* Decorative Blur Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_60%,rgba(248,250,252,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-[var(--color-primary)]/5 blur-[140px] pointer-events-none" />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="max-w-4xl mx-auto px-6 lg:px-12 w-full text-center relative z-10 flex flex-col items-center"
      >
        <motion.span variants={itemVariants} className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-[var(--color-border)]/60 text-[var(--color-primary)] bg-[var(--color-primary)]/5 mb-10">
          <span className="size-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          The Pack is Growing
        </motion.span>

        <motion.h2 variants={itemVariants} className="font-heading font-black mb-6 text-[clamp(3.5rem,8vw,7rem)] text-[var(--color-primary)] leading-[0.92] tracking-tight uppercase">
          Think you belong<br />
          <span className="text-[var(--color-accent)]">in this roster?</span>
        </motion.h2>

        <motion.p variants={itemVariants} className="font-body text-lg lg:text-xl mb-14 max-w-xl leading-relaxed text-[var(--color-text-secondary)]">
          We’re always looking for riders who bring more than just horsepower to the table. 
          Integrity, skill, and grit define the pack.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
          {!isInitialized ? null : userDetails ? (
            <Link
              to={`/profile/@${userDetails.username}`}
              className="btn-primary px-10 py-4 text-sm"
            >
              View My Profile
            </Link>
          ) : (
            <Link
              to="/join"
              className="btn-primary px-10 py-4 text-sm"
            >
              Apply for Membership
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </Link>
          )}
          {(!isInitialized || !userDetails) && (
            <Link
              to="/contact"
              className="btn-secondary px-10 py-4 text-sm"
            >
              Contact the Crew
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
