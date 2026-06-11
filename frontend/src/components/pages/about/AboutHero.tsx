import { useRef } from "react";
import { motion } from "framer-motion";

interface AboutHeroProps {
  AboutHeroBg: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

export default function AboutHero({ AboutHeroBg }: AboutHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ position: "relative" }}
    >
      <div
        className="absolute inset-0 size-full bg-cover bg-center"
        style={{ backgroundImage: `url(${AboutHeroBg})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 40%, rgba(2,6,23,0.4) 60%, rgba(2,6,23,1) 100%)",
        }}
      />

      <motion.div 
        className="relative z-10 w-full" 
        style={{ position: "relative" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center px-4 py-10 md:px-6 md:py-12 lg:px-12 lg:py-20">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] md:text-xs lg:text-sm font-bold tracking-[0.05em] uppercase px-4 md:px-6 py-2.5 rounded-full text-[var(--color-bg)] bg-[var(--color-primary)] shadow-[0_8px_32px_rgba(248,250,252,0.2)]">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="
              font-[var(--font-heading)]
              font-black
              leading-[0.9]
              tracking-tighter
              mb-4 sm:mb-6
              text-[clamp(3.5rem,10vw,8rem)]
              text-center
              text-[var(--color-primary)]
              drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]
              uppercase
            "
          >
            Built on Asphalt,<br />
            <span className="text-[var(--color-accent)]">Bonded by Grit</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="font-[var(--font-body)] font-medium max-w-2xl mx-auto text-sm md:text-base lg:text-xl text-[var(--color-text-primary)] opacity-90 leading-relaxed mb-10">
            MotoXCode was never supposed to be this big. It started as an
            obsession. It became a movement.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[16rem] sm:max-w-none mx-auto">
            <a
              href="#philosophy"
              className="btn-primary w-full sm:w-auto px-8 py-4 text-sm lg:text-base"
            >
              The Philosophy
            </a>
            <a
              href="#riding-code"
              className="btn-secondary w-full sm:w-auto px-8 py-4 text-sm lg:text-base"
            >
              The Code
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[var(--color-text-primary)] opacity-60"
      >
        <span className="font-[var(--font-body)] text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-[var(--color-text-primary)] to-transparent" />
      </motion.div>
    </section>
  );
}
