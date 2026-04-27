import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RideCard from '../components/ui/RideCard'
import { rides } from '../data/rides'

gsap.registerPlugin(ScrollTrigger)

type Filter = 'all' | 'upcoming' | 'past'

export default function Rides() {
  const [filter, setFilter] = useState<Filter>('all')
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const filtered = rides.filter((r) => {
    if (filter === 'upcoming') return !r.past
    if (filter === 'past') return r.past
    return true
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.querySelectorAll('.ride-card-anim') ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [filter])

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden bg-bg pt-28 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-5"><span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-accent text-accent bg-accent/10">On the Road</span></div>
          <h1 className="hero-item font-heading font-black mb-4 text-[clamp(2.5rem,6vw,5rem)] text-primary leading-tight">
            Every Ride,<br /><span className="text-accent">A Chapter</span>
          </h1>
          <p className="hero-item font-body text-lg max-w-lg text-secondary">
            From coastal highway blasts to high-altitude expeditions — every MotoXCode ride has a story.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-12">
            {(['all', 'upcoming', 'past'] as Filter[]).map((f) => (
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
    </>
  )
}
