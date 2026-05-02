import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    number: '01',
    title: 'The Code of the Road',
    body: 'Every rider carries a responsibility — to themselves, to their machine, and to every other soul on the asphalt. We don\'t just ride fast. We ride right.',
    tag: 'Safety First',
    image: '/assets/images/gallery/img-1.jpg'
  },
  {
    number: '02',
    title: 'Brotherhood Over Horsepower',
    body: 'It doesn\'t matter what you ride. What matters is how you show up — for a fellow rider stranded on a highway, for a friend who needs a shoulder, for the community that built this.',
    tag: 'Community',
    image: '/assets/images/gallery/img-8.jpg'
  },
  {
    number: '03',
    title: 'The Long Road as Teacher',
    body: 'Every long ride strips away the noise. What remains is clarity. We ride not to escape life — but to meet it head-on, at speed, in the open air.',
    tag: 'Philosophy',
    image: '/assets/images/gallery/img-5.jpg'
  },
]

export default function Values() {
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        valuesRef.current?.querySelectorAll('.value-item') ?? [],
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 75%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={valuesRef} className="py-32 bg-gradient-to-b from-[#0F0F0F] to-section relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="mb-24 text-center max-w-3xl mx-auto">
          <h2 className="font-heading font-black mb-6 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
            The MotoXCode Way
          </h2>
          <p className="font-body text-xl text-secondary leading-relaxed">
            We don't just share a passion for motorcycles. We share a code.
          </p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {values.map((v, i) => (
            <div
              key={v.number}
              className={`value-item flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                i % 2 !== 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className="flex-1 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full bg-accent/10 text-accent mb-6">
                  {v.tag}
                </span>
                <div className="flex items-end gap-4 mb-6">
                  <span className="font-heading font-black text-6xl text-border leading-none">
                    {v.number}
                  </span>
                  <h3 className="font-heading font-bold text-4xl lg:text-5xl text-primary">
                    {v.title}
                  </h3>
                </div>
                <p className="font-body text-lg lg:text-xl leading-relaxed text-secondary">
                  {v.body}
                </p>
              </div>
              
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
