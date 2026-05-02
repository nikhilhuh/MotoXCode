import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ctaRef} className="py-40 relative overflow-hidden bg-section border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.08)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full text-center relative z-10 flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full border border-accent text-accent bg-accent/10 mb-8">Ready?</span>
        <h2 className="font-heading font-black mb-8 mx-auto max-w-4xl text-[clamp(3rem,7vw,6rem)] text-primary leading-tight">
          The road doesn't wait for the ready.
        </h2>
        <p className="font-body text-xl lg:text-2xl mb-12 mx-auto max-w-2xl leading-relaxed text-secondary">
          Apply to join MotoXCode and ride with people who treat the road as sacred.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <Link to="/join" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-base tracking-[0.06em] uppercase px-10 py-4 rounded transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_40px_rgba(255,107,0,0.3)] hover:shadow-[0_12px_45px_rgba(255,107,0,0.4)]">
            Apply for Membership
          </Link>
        </div>
      </div>
    </section>
  )
}
