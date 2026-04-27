import type { Ride } from '../../types/ride'

interface RideCardProps {
  ride: Ride
  variant?: 'default' | 'compact'
}

const difficultyClass: Record<Ride['difficulty'], string> = {
  Easy: 'text-[#4ade80]',
  Medium: 'text-[#facc15]',
  Hard: 'text-[#f87171]',
}

export default function RideCard({ ride, variant = 'default' }: RideCardProps) {
  const formattedDate = new Date(ride.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      className={`relative overflow-hidden rounded-2xl group flex-shrink-0 transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.4)] aspect-[4/5] ${
        variant === 'compact' ? 'w-[340px]' : 'w-[380px]'
      }`}
    >
      {/* Background Image */}
      <img
        src={ride.image}
        alt={ride.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-[#0F0F0F]/10 opacity-90"
      />

      {/* Badges */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
        <span
          className={`inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md ${difficultyClass[ride.difficulty]}`}
        >
          {ride.difficulty}
        </span>
        {ride.past && (
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-secondary">
            Past Ride
          </span>
        )}
      </div>

      {/* Content aligned to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end">
        <p className="font-accent text-sm mb-2 font-medium tracking-wide text-accent">
          {ride.location}
        </p>
        <h3 className="font-heading font-black text-2xl md:text-3xl mb-4 leading-tight transition-colors duration-300 text-primary group-hover:text-white">
          {ride.title}
        </h3>

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
    </div>
  )
}
