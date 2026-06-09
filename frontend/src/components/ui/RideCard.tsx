import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Ride } from '../../types/ride'
import JoinFormModal from './JoinFormModal'

interface RideCardProps {
  ride: Ride
}

const routeTypeClass: Record<Ride['routeType'], string> = {
  'Intra-city': 'text-[#4ade80]',
  'Inter-city': 'text-[#facc15]',
  'Inter-state': 'text-[#f87171]',
}

export default function RideCard({ ride }: RideCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isJoinOpen, setIsJoinOpen] = useState<boolean>(false)

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

  const formattedDate = new Date(ride.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative overflow-hidden rounded-2xl group w-full transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.4)] aspect-[4/5] block text-left p-0 border-none appearance-none bg-transparent"
      >
      {/* Background Image */}
      <img
        src={ride.image}
        alt={ride.title}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-[#0F0F0F]/10 opacity-90"
      />

      {/* Badges */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
        <span
          className={`inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md ${routeTypeClass[ride.routeType]}`}
        >
          {ride.routeType}
        </span>
        
          <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-secondary">
            {ride.past ? "Past" : "Upcoming"}
          </span>
        
      </div>

      {/* Content aligned to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end">
        <p className="font-accent text-sm mb-2 font-medium tracking-wide text-accent flex items-center gap-2">
          {ride.location.from} 
          <span className="opacity-50">→</span> 
          {ride.location.to}
        </p>
        <h3 className="font-heading font-black text-2xl md:text-3xl mb-1 leading-tight transition-colors duration-300 text-primary group-hover:text-white">
          {ride.title}
        </h3>
        
        <p className="font-heading font-black text-xl text-accent mb-4">
          {ride.membersJoined || 0} <span className="text-xs font-accent tracking-[0.15em] text-secondary uppercase font-semibold">Riders</span>
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm font-accent text-secondary">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
            </svg>
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.5-9.5h-1v5l4.3 2.5.7-1.2-4-2.3V4.5z"/>
            </svg>
            {ride.duration ?? '–'}
          </span>
          <span className="font-semibold text-white">{ride.distance}</span>
        </div>
      </div>
    </button>

    {/* Modal using React Portal for true viewport centering */}
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
          {/* === FIXED IMAGE HEADER with overlay === */}
          <div className="relative h-52 sm:h-64 flex-shrink-0">
            <img src={ride.image} alt={ride.title} className="size-full object-cover" />
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Close button — pinned to image */}
            <button 
              type="button"
              aria-label="Close ride details"
              className="absolute top-4 right-4 z-20 size-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-[var(--color-accent)] transition-colors cursor-pointer" 
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
              <span className={`inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-current ${routeTypeClass[ride.routeType]}`}>
                {ride.routeType}
              </span>
              {ride.past && (
                <span className="inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/70">
                  Past Ride
                </span>
              )}
            </div>

            {/* Title & location — bottom-left; CTA — bottom-right */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-4 z-20 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="font-[var(--font-accent)] text-[var(--color-accent)] text-xs font-semibold tracking-wide flex items-center gap-1.5 mb-1">
                  {ride.location.from} <span className="opacity-50">→</span> {ride.location.to}
                </p>
                <h2 className="font-[var(--font-heading)] font-black text-2xl sm:text-3xl text-white leading-tight">{ride.title}</h2>
              </div>

              {/* CTA overlay */}
              {!ride.past ? (
                <button
                  type="button"
                  className="btn-primary flex-shrink-0 px-4 py-2 text-[0.65rem] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsJoinOpen(true)
                  }}
                >
                  Join This Ride
                </button>
              ) : (
                <span className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/60 font-[var(--font-accent)] text-[0.6rem] font-semibold tracking-widest uppercase">
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* === SCROLLABLE CONTENT BELOW === */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col gap-6">

            {/* Members hero stat */}
            <div>
              <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Signed Up</span>
              <span className="font-[var(--font-heading)] text-5xl font-black text-[var(--color-accent)] leading-none">
                {ride.membersJoined || 0} <span className="text-xl text-[var(--color-primary)] font-[var(--font-body)] font-medium">riders</span>
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[var(--color-border)]/30 py-5">
              <div>
                <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Date</span>
                <span className="font-[var(--font-body)] text-primary font-medium text-sm">{formattedDate}</span>
              </div>
              
              <div>
                <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Meetup Time</span>
                <span className="font-[var(--font-body)] text-primary font-medium text-sm">{ride.meetupTime || 'N/A'}</span>
              </div>

              <div>
                <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Distance</span>
                <span className="font-[var(--font-body)] text-primary font-medium text-sm">{ride.distance || 'N/A'}</span>
              </div>

              <div>
                <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Duration</span>
                <span className="font-[var(--font-body)] text-primary font-medium text-sm">{ride.duration || 'N/A'}</span>
              </div>

              {/* Meetup location — always full width */}
              <div className="col-span-2">
                <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Meetup Location</span>
                <span className="font-[var(--font-body)] text-primary font-medium text-sm">{ride.meetupLocation || 'N/A'}</span>
              </div>
            </div>

            {/* Description */}
            <p className="font-[var(--font-body)] text-secondary leading-relaxed text-sm">
              {ride.description || 'No description provided.'}
            </p>

          </div>
        </div>
      </div>,
      document.body
    )}

    <JoinFormModal
      isOpen={isJoinOpen}
      onClose={() => setIsJoinOpen(false)}
      target={{
        _id: ride._id,
        title: ride.title,
        date: formattedDate,
        time: ride.meetupTime,
        location: ride.meetupLocation || `${ride.location.from} to ${ride.location.to}`,
        type: 'ride',
      }}
    />
    </>
  )
}
