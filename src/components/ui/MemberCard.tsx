import type { Member } from '../../types/member'

interface MemberCardProps {
  member: Member
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 bg-transparent aspect-[4/5]">
      <div className="absolute inset-0 bg-surface opacity-50 rounded-2xl transition-opacity group-hover:opacity-80" />
      <div className="absolute inset-0 rounded-2xl border border-white/5 transition-colors group-hover:border-accent/30" />
      
      {/* Soft Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative h-full flex flex-col z-10">
        {/* Image Area */}
        <div className="relative w-full h-1/2 overflow-hidden rounded-t-2xl">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          {/* Fallback gradient */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 bg-gradient-to-br from-surface to-[#111]">
            <span className="font-heading font-black text-6xl text-border opacity-50">
              {member.name.charAt(0)}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />
          
          {/* Role badge placed on image */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-accent">
              {member.role}
            </span>
          </div>

          {/* Instagram handle */}
          {member.instagram && (
            <span className="absolute top-4 right-4 font-accent text-xs bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-white/70">
              {member.instagram}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col flex-grow bg-gradient-to-b from-[#0F0F0F] to-[#161616]">
          <h3 className="font-heading font-black text-xl md:text-2xl mb-1 text-white group-hover:text-accent transition-colors">
            {member.name}
          </h3>
          <p className="font-accent text-sm mb-4 font-medium text-accent">
            {member.bike}
          </p>
          <p className="font-body text-sm leading-relaxed line-clamp-3 mb-4 text-secondary">
            {member.bio}
          </p>
          {member.location && (
            <p className="font-accent text-xs mt-auto flex items-center gap-1.5 pt-4 border-t border-white/5 text-secondary">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
              {member.location}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
