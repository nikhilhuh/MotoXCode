import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function RidesHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-item',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative flex items-end overflow-hidden bg-[var(--color-bg)] pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
        <div className="hero-item mb-5">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-accent text-accent bg-accent/10">On the Road</span>
        </div>
        <h1 className="hero-item font-heading font-black mb-4 text-[clamp(2.5rem,6vw,5rem)] text-primary leading-tight">
          Every Ride,<br /><span className="text-accent">A Chapter</span>
        </h1>
        <p className="hero-item font-body text-lg max-w-lg text-secondary">
          From coastal highway blasts to high-altitude expeditions — every MotoXCode ride has a story.
        </p>
      </div>
    </section>
  )
}
