import { Stat } from "@/types/stat";
import { StatCard } from "@/components/ui/StatCard";

interface StatsProps {
  statsData: Stat[];
}

export default function Stats({ statsData }: StatsProps) {
  return (
    <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-black via-[var(--color-bg)] to-[var(--color-section)] border-b border-[var(--color-border)]/50">
      <div className="absolute inset-0 bg-[var(--color-section)]/10 backdrop-blur-sm z-0"></div>

      {/* Decorative ambient lighting */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[60%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="px-6 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, i) => (
            <StatCard key={stat._id} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
