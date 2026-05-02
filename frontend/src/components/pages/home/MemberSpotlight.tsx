import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MemberCard from '../../ui/MemberCard'
import { crew } from '../../../data/crew'

gsap.registerPlugin(ScrollTrigger)

export default function MemberSpotlight() {
  const crewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        crewRef.current?.querySelectorAll('.crew-item') ?? [],
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: crewRef.current, start: 'top 75%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={crewRef} className="py-32 bg-section relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F0F] opacity-50 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-heading font-black mb-4 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
              Meet the Crew
            </h2>
            <p className="font-body text-xl text-secondary">
              The people who make this community what it is.
            </p>
          </div>
          <Link to="/crew" className="inline-flex items-center gap-2 border border-border text-primary font-accent font-semibold text-sm tracking-[0.06em] uppercase px-6 py-3 rounded transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5 shrink-0 hidden sm:inline-flex">
            Full Roster
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crew.slice(0, 3).map((member) => (
            <div key={member.id} className="crew-item">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
