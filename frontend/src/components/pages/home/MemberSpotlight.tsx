import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MemberCard from '../../ui/MemberCard'
import { Member } from '@/types/member'

gsap.registerPlugin(ScrollTrigger)

interface MemberSpotlightProps {
  mvpCrew: Member[];
}

export default function MemberSpotlight({mvpCrew}: MemberSpotlightProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface)]">
      {/* Decorative ambient lighting */}
      <div className="absolute -top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] -right-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0" />

      {/* Section header — centered */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
        <h2 className="section-heading">Meet the Crew</h2>
        <p className="section-subheading text-center">
          The people who make this community what it is.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mvpCrew.map((member) => (
            <MemberCard key={member.username} member={member} />
          ))}
        </div>
      </div>

      {/* Full Roster — centered below grid */}
      <div className="flex justify-center pt-4 pb-4 relative z-10">
        <Link to="/crew" className="btn-outline px-8 py-3 text-sm">
          Full Roster
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
