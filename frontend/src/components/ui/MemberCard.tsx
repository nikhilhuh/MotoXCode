import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Member } from '../../types/member'

interface MemberCardProps {
  member: Member
}

export default function MemberCard({ member }: MemberCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* ── CARD ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="crew-item cursor-pointer relative overflow-hidden rounded-2xl group w-full transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.4)] aspect-[4/5] block text-left p-0 border-none appearance-none bg-transparent"
      >
        {/* Background Image */}
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Fallback gradient when image missing */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[#111] -z-10">
          <span className="font-heading font-black text-8xl text-[var(--color-border)] opacity-40">
            {member.name.charAt(0)}
          </span>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-[#0F0F0F]/10 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Content — pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end">
          <p className="font-accent text-sm mb-1 font-medium tracking-wide text-[var(--color-accent)]">
            {member.bike}
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
        </div>
      </button>

      {/* ── MODAL ── */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
        >
          <div
            className="relative bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* === IMAGE HEADER === */}
            <div className="relative h-52 sm:h-64 flex-shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="size-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              {/* Fallback */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[#111] -z-10">
                <span className="font-heading font-black text-[8rem] text-[var(--color-border)] opacity-30">
                  {member.name.charAt(0)}
                </span>
              </div>
              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Close button */}
              <button
                type="button"
                aria-label="Close member details"
                className="absolute top-4 right-4 z-20 size-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Role badge */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                <span className="inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-[var(--color-accent)]/50 text-[var(--color-accent)]">
                  {member.role}
                </span>
              </div>

              {/* Name & bike — bottom of image */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-4 z-20 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-accent text-[var(--color-accent)] text-xs font-semibold tracking-wide mb-1">
                    {member.bike}
                  </p>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight">
                    {member.name}
                  </h2>
                </div>
                {member.instagram && (
                  <span className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/70 font-accent text-[0.65rem] font-semibold tracking-widest">
                    {member.instagram}
                  </span>
                )}
              </div>
            </div>

            {/* === SCROLLABLE CONTENT === */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col gap-6">

              {/* Years riding hero stat */}
              {member.years !== undefined && (
                <div>
                  <span className="block font-accent text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-secondary)] mb-1">
                    Years Riding
                  </span>
                  <span className="font-heading text-5xl font-black text-[var(--color-accent)] leading-none">
                    {member.years}{' '}
                    <span className="text-xl text-[var(--color-primary)] font-body font-medium">yrs</span>
                  </span>
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[var(--color-border)]/30 py-5">
                <div>
                  <span className="block font-accent text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-secondary)] mb-1">
                    Role
                  </span>
                  <span className="font-body text-[var(--color-primary)] font-medium text-sm">
                    {member.role}
                  </span>
                </div>

                <div>
                  <span className="block font-accent text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-secondary)] mb-1">
                    Bike
                  </span>
                  <span className="font-body text-[var(--color-primary)] font-medium text-sm">
                    {member.bike}
                  </span>
                </div>

                {member.location && (
                  <div className="col-span-2">
                    <span className="block font-accent text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-secondary)] mb-1">
                      Based In
                    </span>
                    <span className="font-body text-[var(--color-primary)] font-medium text-sm flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                      </svg>
                      {member.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="font-body text-[var(--color-secondary)] leading-relaxed text-sm">
                {member.bio}
              </p>

              {/* Contact */}
              <div className="border-t border-[var(--color-border)]/30 pt-5 flex flex-col gap-3">
                <span className="font-accent text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-secondary)]">
                  Contact
                </span>

                {/* WhatsApp row */}
                <div className="flex items-center gap-3">
                  {/* WhatsApp icon */}
                  <span className="flex-shrink-0 size-8 flex items-center justify-center rounded-full bg-[#25D366]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  {member.whatsapp ? (
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-[var(--color-primary)] hover:text-[#25D366] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {member.whatsapp}
                    </a>
                  ) : (
                    <span className="font-body text-sm text-[var(--color-secondary)]/50">N/A</span>
                  )}
                </div>

                {/* Instagram row */}
                <div className="flex items-center gap-3">
                  {/* Instagram icon */}
                  <span className="flex-shrink-0 size-8 flex items-center justify-center rounded-full bg-[#E1306C]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#ig-grad)">
                      <defs>
                        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433" />
                          <stop offset="25%" stopColor="#e6683c" />
                          <stop offset="50%" stopColor="#dc2743" />
                          <stop offset="75%" stopColor="#cc2366" />
                          <stop offset="100%" stopColor="#bc1888" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </span>
                  {member.instagram ? (
                    <a
                      href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-[var(--color-primary)] hover:text-[#E1306C] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {member.instagram}
                    </a>
                  ) : (
                    <span className="font-body text-sm text-[var(--color-secondary)]/50">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
