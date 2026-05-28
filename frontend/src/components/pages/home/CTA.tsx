import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Stat } from '@/types/stat'

gsap.registerPlugin(ScrollTrigger)

interface CTAProps {
  statsData: Stat[];
}
export default function CTA({ statsData }: CTAProps) {
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-item',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%', once: true },
        }
      )
    }, ctaRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ctaRef}
      className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black border-t border-[var(--color-border)]/20"
    >
      {/* Radial glow centre */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_60%,rgba(248,250,252,0.06)_0%,transparent_70%)] pointer-events-none" />
      {/* Corner accent blobs */}
      <div className="absolute -top-[15%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[var(--color-primary)]/4 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[60%] rounded-full bg-[var(--color-accent)]/4 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full text-center relative z-10 flex flex-col items-center">
        {/* Eyebrow */}
        <span className="cta-item inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-[var(--color-border)]/60 text-[var(--color-accent)] bg-[var(--color-accent)]/10 mb-10">
          <span className="size-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          Ready to Ride?
        </span>

        {/* Headline */}
        <h2 className="cta-item font-heading font-black mb-6 text-[clamp(3.5rem,8vw,7rem)] text-[var(--color-primary)] leading-[0.92] tracking-tight uppercase">
          The road doesn't<br />
          <span className="text-[var(--color-accent)]">wait for the ready.</span>
        </h2>

        {/* Body */}
        <p className="cta-item font-body text-lg lg:text-xl mb-14 max-w-xl leading-relaxed text-[var(--color-text-secondary)]">
          Apply to join MotoXCode and ride with people who treat the road as sacred. No posers. Just riders.
        </p>

        {/* Buttons */}
        <div className="cta-item flex flex-wrap gap-4 justify-center">
          <Link to="/join" className="btn-primary px-10 py-4 text-sm">
            Apply for Membership
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
            </svg>
          </Link>
          <Link to="/rides" className="btn-secondary px-10 py-4 text-sm">
            Browse Upcoming Rides
          </Link>
        </div>

        {/* Social proof / stat row */}
        <div className="cta-item mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
          {statsData.map((stat) => (
            <div key={stat._id} className="flex flex-col items-center gap-1">
              <span className="font-heading font-black text-3xl text-[var(--color-primary)] leading-none">{stat.target}{stat.suffix}</span>
              <span className="font-accent text-[0.65rem] tracking-[0.18em] text-[var(--color-text-secondary)] uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
