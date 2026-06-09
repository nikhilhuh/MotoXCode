import type { Profile as ProfileType } from "../../../types/profile";

export interface ProfileStatsProps {
  profile: ProfileType;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  const formatUrl = (url?: string) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="flex flex-col gap-12 md:gap-8">
      <div className="md:bg-gradient-to-b md:from-white/[0.04] md:to-transparent md:border md:border-white/[0.05] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:rounded-[2rem] md:p-10 flex flex-col gap-10 md:backdrop-blur-sm transition-all duration-500 md:hover:border-white/[0.08]">
        
        <div className="group">
          <span className="block font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-4 pb-3 border-b border-white/10 md:font-accent md:text-[10px] md:tracking-[0.25em] md:text-white/40 md:mb-3 md:pb-0 md:border-none md:group-hover:text-[var(--color-accent)] transition-colors">Location</span>
          {profile.location ? (
            <span className="font-body text-white/90 font-medium text-xl flex items-center gap-4">
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
              </div>
              {profile.location}
            </span>
          ) : (
            <span className="font-body text-white/30 font-medium text-lg italic">
              Not specified
            </span>
          )}
        </div>

        <div className="group">
          <span className="block font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-4 pb-3 border-b border-white/10 md:font-accent md:text-[10px] md:tracking-[0.25em] md:text-white/40 md:mb-3 md:pb-0 md:border-none md:group-hover:text-[var(--color-accent)] transition-colors">Experience</span>
          {profile.years !== undefined && profile.years !== null ? (
            <span className="font-heading text-6xl md:text-6xl font-black text-[var(--color-accent)] leading-none flex items-baseline gap-3 drop-shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]">
              {profile.years} <span className="text-sm text-white/40 font-accent font-bold uppercase tracking-[0.3em]">Years</span>
            </span>
          ) : (
            <span className="font-body text-white/30 font-medium text-lg italic">
              Not specified
            </span>
          )}
        </div>

        {/* Socials */}
        <div className="md:pt-8 md:border-t md:border-white/10 flex flex-col gap-6">
           <span className="block font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-2 pb-3 border-b border-white/10 md:font-accent md:text-[10px] md:tracking-[0.25em] md:text-white/40 md:mb-0 md:pb-0 md:border-none">Connect</span>
           <div className="flex flex-wrap gap-4">
             {profile.instagram && (
               <a href={formatUrl(profile.instagram)} target="_blank" rel="noreferrer" className="flex items-center justify-center size-14 rounded-2xl bg-[#E1306C]/10 border border-[#E1306C]/30 hover:bg-[#E1306C] hover:border-[#E1306C] group hover:-translate-y-1 transition-all duration-300 shadow-lg">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="#E1306C" className="group-hover:fill-white transition-colors"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
               </a>
             )}
             {profile.youtube && (
               <a href={formatUrl(profile.youtube)} target="_blank" rel="noreferrer" className="flex items-center justify-center size-14 rounded-2xl bg-[#FF0000]/10 border border-[#FF0000]/30 hover:bg-[#FF0000] hover:border-[#FF0000] group hover:-translate-y-1 transition-all duration-300 shadow-lg">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" className="group-hover:fill-white transition-colors"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
               </a>
             )}
             {profile.facebook && (
               <a href={formatUrl(profile.facebook)} target="_blank" rel="noreferrer" className="flex items-center justify-center size-14 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/30 hover:bg-[#1877F2] hover:border-[#1877F2] group hover:-translate-y-1 transition-all duration-300 shadow-lg">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" className="group-hover:fill-white transition-colors"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </a>
             )}
             {!profile.instagram && !profile.youtube && !profile.facebook && (
               <span className="text-sm font-body text-[var(--color-secondary)]/40 italic">No links provided</span>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
