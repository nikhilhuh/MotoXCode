import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '80+', label: 'Rides Completed' },
  { value: '1.2L km', label: 'Collective Miles' },
  { value: '12', label: 'States Covered' },
]

export default function Stats() {
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-item') ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={statsRef} className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <div className="font-heading font-black mb-2 text-[clamp(2.5rem,5vw,4rem)] text-primary leading-none">
                {stat.value}
              </div>
              <div className="font-accent text-sm font-semibold tracking-widest text-secondary uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
