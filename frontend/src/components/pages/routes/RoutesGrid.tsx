import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RouteCard from '../../ui/RouteCard'
import { routes } from '../../../data/routes'

gsap.registerPlugin(ScrollTrigger)

export default function RoutesGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.route-card',
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
  )
}
