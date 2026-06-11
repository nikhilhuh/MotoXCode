import { motion } from "framer-motion";
import MemberCard from "../../ui/MemberCard";
import { Member } from "@/types/member";

interface CrewGridProps {
  crew: Member[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const, // power3.out
    },
  },
};

export default function CrewGrid({ crew }: CrewGridProps) {

  return (
    <section
      id="crew-grid"
      className="py-12 lg:py-22 bg-[var(--color-bg)] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <h2 className="font-heading font-black text-3xl md:text-5xl text-[var(--color-primary)] mb-10 text-center uppercase tracking-wider">
          Our MVP <span className="text-[var(--color-accent)]">Roster</span>
        </h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {crew.map((member) => (
            <motion.div variants={itemVariants} key={member.username}>
              <MemberCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
