import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MemberCard from '../../ui/MemberCard'
import { crew } from '../../../data/crew'

gsap.registerPlugin(ScrollTrigger)

export default function CrewGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.crew-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%', once: true },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
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
  )
}
