import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MemberCard from '../components/ui/MemberCard'
import { crew } from '../data/crew'

gsap.registerPlugin(ScrollTrigger)

export default function Crew() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        gridRef.current?.querySelectorAll('.crew-card') ?? [],
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
      {/* Page Hero */}
      <section className="relative flex items-end overflow-hidden bg-bg pt-40 pb-24 min-h-[55vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(255,107,0,0.1)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-8">
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full border border-none text-accent bg-accent/10">The Roster</span>
          </div>
          <h1 className="hero-item font-heading font-black mb-6 text-[clamp(3.5rem,8vw,7rem)] text-primary leading-tight">
            People Who<br />
            <span className="text-accent">Make It Move</span>
          </h1>
          <p className="hero-item font-body text-xl lg:text-2xl max-w-2xl leading-relaxed text-secondary">
            Behind every great ride is an even greater team. Meet the core crew of MotoXCode.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {crew.map((member) => (
              <div key={member.id} className="crew-card">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-32 relative overflow-hidden bg-section border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.05)_0%,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full max-w-3xl text-center relative z-10">
          <h2 className="font-heading font-black mb-6 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
            Think you belong here?
          </h2>
          <p className="font-body text-xl mb-12 max-w-xl mx-auto leading-relaxed text-secondary">
            We're always looking for riders who bring more than horsepower to the table.
          </p>
          <Link to="/join" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-10 py-4 rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)] justify-center">
            Apply to Join
          </Link>
        </div>
      </section>
    </>
  )
}
