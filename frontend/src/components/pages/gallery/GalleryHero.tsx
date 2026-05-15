import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function GalleryHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-item',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative flex items-end overflow-hidden bg-[var(--color-bg)] pt-40 pb-24 min-h-[60vh]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-section)] to-[var(--color-bg)]" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
      {/* Glow blobs */}
      <div className="absolute top-[20%] right-[10%] w-[35%] h-[50%] rounded-full bg-[var(--color-primary)]/4 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[40%] rounded-full bg-[var(--color-accent)]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
        <div className="hero-item mb-8">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full border border-[var(--color-border)]/60 text-[var(--color-accent)] bg-[var(--color-accent)]/10">
            Visual Archive
          </span>
        </div>
        <h1 className="hero-item font-heading font-black mb-6 text-[clamp(4rem,8vw,7rem)] text-[var(--color-primary)] leading-none uppercase">
          Through<br />
          <span className="text-[var(--color-accent)]">the Lens</span>
        </h1>
        <p className="hero-item font-body text-xl lg:text-2xl max-w-2xl leading-relaxed text-[var(--color-text-secondary)]">
          A visual record of the roads we've conquered, the moments we've shared, and the machines that carried us there.
        </p>
      </div>
    </section>
  )
}
