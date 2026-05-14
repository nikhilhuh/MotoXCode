import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Event {
  id: string
  date: string
  title: string
  location: string
  type: 'Ride' | 'Meetup' | 'Workshop' | 'Social'
  time: string
  spots: number
  spotsLeft: number
}

const events: Event[] = [
  {
    id: 'evt-001',
    date: '2026-05-10',
    title: 'Ghats of Fire — Group Ride',
    location: 'Western Ghats, Maharashtra',
    type: 'Ride',
    time: '05:30 AM departure',
    spots: 20,
    spotsLeft: 7,
  },
  {
    id: 'evt-002',
    date: '2026-05-17',
    title: 'Gear Check & Safety Workshop',
    location: 'Pune, Maharashtra',
    type: 'Workshop',
    time: '10:00 AM – 1:00 PM',
    spots: 30,
    spotsLeft: 15,
  },
  {
    id: 'evt-003',
    date: '2026-05-24',
    title: 'Desert Thunder — Rajasthan Ride',
    location: 'Jaisalmer, Rajasthan',
    type: 'Ride',
    time: '06:00 AM departure',
    spots: 25,
    spotsLeft: 12,
  },
  {
    id: 'evt-004',
    date: '2026-06-01',
    title: 'Community Meetup & New Member Welcome',
    location: 'Mumbai, Maharashtra',
    type: 'Meetup',
    time: '07:00 PM',
    spots: 60,
    spotsLeft: 34,
  },
  {
    id: 'evt-005',
    date: '2026-06-14',
    title: 'Himalayan Vigil Expedition',
    location: 'Spiti Valley, Himachal Pradesh',
    type: 'Ride',
    time: '05:00 AM departure (Day 1)',
    spots: 15,
    spotsLeft: 3,
  },
]

const typeColors: Record<Event['type'], string> = {
  Ride: 'var(--color-accent)',
  Meetup: '#60a5fa',
  Workshop: '#a78bfa',
  Social: '#4ade80',
}

export default function Events() {
  const heroRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        listRef.current?.querySelectorAll('.event-item') ?? [],
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 75%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return {
      day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      weekday: d.toLocaleDateString('en-IN', { weekday: 'long' }),
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden bg-bg pt-28 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-5"><span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-accent text-accent bg-accent/10">Upcoming</span></div>
          <h1 className="hero-item font-heading font-black mb-4 text-[clamp(2.5rem,6vw,5rem)] text-primary leading-tight">
            What's<br /><span className="text-accent">Coming Up</span>
          </h1>
          <p className="hero-item font-body text-lg max-w-lg text-secondary">
            From epic rides to community meetups to safety workshops — something's always happening in the MotoXCode world.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div ref={listRef} className="space-y-0">
            {events.map((event) => {
              const { day, month, weekday } = formatDate(event.date)
              const fillPercent = ((event.spots - event.spotsLeft) / event.spots) * 100
              const isAlmostFull = event.spotsLeft <= 5

              return (
                <div key={event.id} className="event-item group flex flex-col md:flex-row items-start md:items-center gap-6 py-8 transition-colors duration-200 border-b border-border">
                  {/* Date box */}
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="font-heading font-black text-3xl leading-none" style={{ color: typeColors[event.type] }}>
                      {day}
                    </div>
                    <div className="font-accent text-xs font-semibold uppercase tracking-wider mt-1 text-secondary">
                      {month}
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="hidden md:block w-px self-stretch bg-border" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border bg-transparent" style={{ color: typeColors[event.type], borderColor: typeColors[event.type] + '40' }}>
                        {event.type}
                      </span>
                      {isAlmostFull && (
                        <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-red-500/50 text-red-500 bg-red-500/10">Almost Full</span>
                      )}
                    </div>
                    <h2 className="font-heading font-bold text-xl mb-1 group-hover:text-accent transition-colors duration-200 text-primary">
                      {event.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 font-accent text-xs text-secondary">
                      <span className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                        </svg>
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                        {weekday}, {event.time}
                      </span>
                    </div>
                    {/* Spots progress */}
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-accent text-xs text-secondary">
                          {event.spotsLeft} spots left of {event.spots}
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden bg-border">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${fillPercent}%`, background: isAlmostFull ? '#f87171' : 'var(--color-accent)' }} />
                      </div>
                    </div>
                  </div>

                  {/* RSVP */}
                  <div className="flex-shrink-0">
                    <a href="/join" className="btn-primary px-5 py-2.5 text-xs">
                      RSVP
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
