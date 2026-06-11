import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RideCard from '../../ui/RideCard'
import { Ride, RideFilter } from '@/types/ride'

interface RidesGridProps {
  rides: Ride[];
}

export default function RidesGrid({ rides }: RidesGridProps) {
  const [filter, setFilter] = useState<RideFilter>('all')

  const filtered = rides.filter((r) => {
    if (filter === 'upcoming') return !r.past
    if (filter === 'past') return r.past
    return true
  })

  return (
    <section id="rides-grid" className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]">
      {/* Decorative premium ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] size-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        {/* Section header — centered */}
        <div className="mb-10 lg:mb-16 text-center max-w-4xl mx-auto">
          <h2 className="section-heading">Our Ride Chronicles</h2>
          <p className="section-subheading">
            Ride Journal
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-10 lg:mb-16 relative z-10">
          <div className="inline-flex p-1 rounded-full bg-[var(--color-surface)]/30 backdrop-blur-xl border border-[var(--color-border)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {(['all', 'upcoming', 'past'] as RideFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                id={`filter-${f}`}
                onClick={() => setFilter(f)}
                className={`relative font-accent font-bold text-xs uppercase tracking-[0.12em] px-6 py-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                  filter === f 
                    ? 'text-[var(--color-bg)] z-10' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] z-10'
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="active-ride-tab"
                    className="absolute inset-0 bg-[var(--color-primary)] rounded-full -z-10 shadow-[0_4px_12px_rgba(248,250,252,0.2)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((ride) => (
              <motion.div 
                key={ride._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <RideCard ride={ride} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-accent text-base text-[var(--color-text-secondary)]">
              No rides in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
