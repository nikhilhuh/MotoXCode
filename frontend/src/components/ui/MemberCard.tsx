import { Link } from 'react-router-dom'
import type { Member } from '../../types/member'

interface MemberCardProps {
  member: Member
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      to={`/profile/@${member.username}`}
      className="crew-item cursor-pointer relative overflow-hidden rounded-2xl group w-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] shadow-[0_10px_40px_rgba(0,0,0,0.4)] aspect-[4/5] block text-left p-0 border border-white/5 bg-[#111]"
    >
        {/* Background Image */}
        <img
          src={member.avatar || "/assets/images/placeholders/avatar.png"}
          alt={member.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Fallback gradient when image missing */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[#111] -z-10">
          <span className="font-heading font-black text-8xl text-[var(--color-border)] opacity-40">
            {member.name ? member.name.charAt(0) : "?"}
          </span>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        {/* Content — pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
          <p className="font-accent text-sm mb-1 font-medium tracking-wide text-[var(--color-accent)]">
            {member.headline}
          </p>
          <h3 className="font-heading font-black text-2xl md:text-3xl mb-2 leading-tight text-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
            {member.name}
          </h3>

          {member.years !== undefined && (
            <p className="font-heading font-black text-xl text-[var(--color-accent)]">
              {member.years}{' '}
              <span className="text-xs font-accent tracking-[0.15em] text-[var(--color-secondary)] uppercase font-semibold">
                yrs riding
              </span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm font-accent text-[var(--color-secondary)] mt-3">
            {member.location && (
              <span className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                {member.location}
              </span>
            )}
          </div>

          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 font-accent text-xs tracking-[0.2em] text-[var(--color-accent)] uppercase flex items-center gap-2 translate-y-2 group-hover:translate-y-0">
            View Profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
    </Link>
  )
}
