import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import RideCard from '../../ui/RideCard'
import { rides } from '../../../data/rides'

type RideFilter = 'all' | 'upcoming' | 'past'

export default function RidesGrid() {
  const [filter, setFilter] = useState<RideFilter>('all')
  const contentRef = useRef<HTMLDivElement>(null)

  const filtered = rides.filter((r) => {
    if (filter === 'upcoming') return !r.past
    if (filter === 'past') return r.past
    return true
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ride-card-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
    }, contentRef)
    return () => ctx.revert()
  }, [filter])

  return (
    <section className="py-20 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-12">
          {(['all', 'upcoming', 'past'] as RideFilter[]).map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`font-accent font-semibold text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all duration-200 border ${
                filter === f 
                  ? 'bg-accent border-accent text-white' 
                  : 'bg-surface border-border text-secondary hover:border-accent/50 hover:text-primary'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((ride) => (
            <div key={ride.id} className="ride-card-anim">
              <RideCard ride={ride} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-accent text-base text-secondary">
              No rides in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
