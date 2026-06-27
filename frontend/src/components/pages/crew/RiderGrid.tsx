import { Member } from "@/types/member";
import RiderCard from "../../ui/RiderCard";
import { motion } from "framer-motion";

interface RiderGridProps {
  riders: Member[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const, // power2.out
    },
  },
};

export default function RiderGrid({ riders }: RiderGridProps) {
  if (riders.length === 0) return null;

  return (
    <section className="py-12 lg:py-24 bg-[var(--color-bg)] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <h2 className="font-heading font-black text-3xl md:text-5xl text-[var(--color-primary)] mb-12 text-center uppercase tracking-wider">
          Our Riders <span className="text-[var(--color-accent)]">Roster</span>
        </h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="flex flex-col gap-4"
        >
          {riders.map((member) => (
            <motion.div variants={itemVariants} key={member.username}>
              <RiderCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
