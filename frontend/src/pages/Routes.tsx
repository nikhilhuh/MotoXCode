import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RouteCard from '../components/ui/RouteCard'
import { routes } from '../data/routes'

gsap.registerPlugin(ScrollTrigger)

export default function Routes() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        gridRef.current?.querySelectorAll('.route-card') ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden bg-[var(--color-bg)] pt-28 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_80%,rgba(255,107,0,0.07)_0%,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-5"><span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-accent text-accent bg-accent/10">Curated Routes</span></div>
          <h1 className="hero-item font-heading font-black mb-4 text-[clamp(2.5rem,6vw,5rem)] text-primary leading-tight">
            Roads Worth<br /><span className="text-accent">Riding</span>
          </h1>
          <p className="hero-item font-body text-lg max-w-lg text-secondary">
            Hand-picked, rider-tested routes across India. Each one mapped by people who've done it — and want you to do it better.
          </p>
        </div>
      </section>

      {/* Route Grid */}
      <section className="py-20 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-section)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {routes.map((route) => (
              <div key={route.id} className="route-card">
                <RouteCard route={route} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit a route */}
      <section className="py-20 bg-gradient-to-b from-[var(--color-section)] via-[var(--color-bg)] to-black border-t border-[var(--color-border)]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full text-center">
          <h2 className="font-heading font-bold mb-4 text-[clamp(1.5rem,3vw,2.25rem)] text-primary">
            Know a route we should add?
          </h2>
          <p className="font-body text-base mb-8 max-w-md mx-auto text-secondary">
            Members can submit their own discovered routes. The best ones become MotoXCode official runs.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)]">
            Submit a Route
          </a>
        </div>
      </section>
    </>
  )
}
