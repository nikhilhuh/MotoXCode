import type { Profile as ProfileType } from "../../../types/profile";

export interface ProfileGarageProps {
  profile: ProfileType;
}

export default function ProfileGarage({ profile }: ProfileGarageProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-12 md:gap-8">
      <div className="md:bg-gradient-to-b md:from-white/[0.04] md:to-transparent md:border md:border-white/[0.05] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:p-10 md:rounded-[2rem] md:backdrop-blur-sm">
        <h3 className="font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-6 pb-3 border-b border-white/10 md:font-accent md:text-xs md:tracking-[0.2em] md:text-[var(--color-secondary)] md:pb-0 md:border-none md:flex md:items-center md:gap-4">
          <span className="hidden md:block w-8 h-[1px] bg-[var(--color-accent)]/50"></span>
          About the Rider
        </h3>
        {profile.bio ? (
          <p className="font-body text-base md:text-lg leading-relaxed text-white/80 whitespace-pre-wrap">
            {profile.bio}
          </p>
        ) : (
          <p className="font-body text-base md:text-lg leading-relaxed text-white/30 italic">
            No bio provided yet.
          </p>
        )}
      </div>

      <div className="md:bg-gradient-to-b md:from-white/[0.04] md:to-transparent md:border md:border-white/[0.05] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:p-10 md:rounded-[2rem] md:backdrop-blur-sm">
        <h3 className="font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-6 pb-3 border-b border-white/10 md:font-accent md:text-xs md:tracking-[0.2em] md:text-[var(--color-secondary)] md:pb-0 md:border-none md:flex md:items-center md:gap-4 md:mb-8">
          <span className="hidden md:block w-8 h-[1px] bg-[var(--color-accent)]/50"></span>
          The Garage
        </h3>
        <div className="flex flex-col">
          {profile.bike && profile.bike.length > 0 ? (
            profile.bike.map((bikeStr, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 md:gap-6 md:px-6 md:bg-gradient-to-r md:from-white/[0.05] md:to-transparent md:border-l-4 md:border-y-0 md:border-r-0 md:border-[var(--color-accent)] md:rounded-r-2xl relative overflow-hidden md:backdrop-blur-sm md:mb-3"
              >
                {/* Subtle background texture/pattern on desktop */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block"></div>

                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] md:w-10 md:h-10 md:bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                  <svg
                    className="hidden md:block"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="hidden md:block font-accent text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">
                    Machine {idx + 1}
                  </span>
                  <span className="font-heading font-black tracking-widest text-lg md:text-xl text-white uppercase drop-shadow-md">
                    {bikeStr}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="font-body text-base md:text-lg leading-relaxed text-white/30 italic">
              Garage is currently empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
