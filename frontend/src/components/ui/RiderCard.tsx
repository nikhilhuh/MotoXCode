import { Link } from "react-router-dom";
import { Member } from "@/types/member";

interface RiderCardProps {
  member: Member;
}

export default function RiderCard({ member }: RiderCardProps) {
  return (
    <Link
      to={`/profile/@${member.username}`}
      className="rider-row group relative flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-[var(--color-accent)]/50 hover:bg-white/[0.05] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:-translate-y-1.5 hover:scale-[1.01] overflow-hidden"
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-transparent pointer-events-none" />

      {/* Left side: Avatar + Identity */}
      <div className="flex items-center gap-4 md:gap-5 z-10 flex-1 min-w-0 pr-4">
        <div className="relative shrink-0">
          <img
            src={member.avatar || "/assets/images/placeholders/avatar.png"}
            alt={member.name}
            className="size-14 md:size-16 rounded-full object-cover border border-white/10 group-hover:border-[var(--color-accent)]/50 transition-all duration-500 group-hover:scale-110"
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1 group-hover:translate-x-1 transition-transform duration-500">
          <h3 className="font-heading font-black text-lg md:text-xl text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 truncate">
            {member.name || member.username}
          </h3>
          <span className="font-accent text-xs md:text-sm text-[var(--color-secondary)] mb-0.5 truncate">
            @{member.username}
          </span>
          {member.headline && (
            <span className="font-accent text-xs text-white/50 truncate">
              {member.headline}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Stats & CTA */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 z-10 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
        <div className="flex items-center gap-6 md:gap-8 shrink-0">
          {member.years !== undefined && (
            <div className="flex flex-col md:items-end w-12 md:w-16 shrink-0 text-left md:text-right">
              <span className="font-heading font-black text-base md:text-lg text-[var(--color-accent)] truncate w-full">
                {member.years}
              </span>
              <span className="font-accent text-[9px] md:text-[10px] uppercase tracking-wider text-white/40 truncate w-full">
                Years
              </span>
            </div>
          )}

          {member.location && (
            <div className="flex flex-col md:items-end w-24 md:w-32 shrink-0 text-left md:text-right">
              <span className="font-heading font-black text-base md:text-lg text-white/90 truncate w-full">
                {member.location}
              </span>
              <span className="font-accent text-[9px] md:text-[10px] uppercase tracking-wider text-white/40 truncate w-full">
                Location
              </span>
            </div>
          )}
        </div>

        {/* Circular CTA Button */}
        <div className="shrink-0 size-8 md:size-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:text-black transition-all duration-300 text-white/50 group-hover:shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.5)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="group-hover:translate-x-0.5 transition-transform duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
