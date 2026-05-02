import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RideCard from '../../ui/RideCard'
import { rides } from '../../../data/rides'

gsap.registerPlugin(ScrollTrigger)

export default function UpcomingRides() {
  const ridesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ridesRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ridesRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  const upcomingRides = rides.filter((r) => !r.past)

  return (
    <section ref={ridesRef} className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading font-black mb-4 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
              Upcoming Rides
            </h2>
            <p className="font-body text-xl text-secondary">
              Find your next adventure. The best roads are meant to be shared.
            </p>
          </div>
          <Link
            to="/rides"
            className="inline-flex items-center gap-2 border border-border text-primary font-accent font-semibold text-sm tracking-[0.06em] uppercase px-6 py-3 rounded transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5 shrink-0 hidden sm:inline-flex"
          >
            View All Rides
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Horizontal scroll */}
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden px-6 md:px-12 lg:px-20">
        <div className="flex gap-8 pb-12" style={{ minWidth: 'max-content' }}>
          {upcomingRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  )
}
