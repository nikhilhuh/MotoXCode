import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { year: '2019', event: 'First ride. Ladakh. 12 riders. One borrowed tent. No regrets.' },
  { year: '2020', event: 'Locked down but not out — we built the community online, planned the routes, sharpened the code.' },
  { year: '2021', event: 'First official MotoXCode group ride. 34 riders. Western Ghats. Zero incidents.' },
  { year: '2022', event: 'Hit 200 members. Launched our first safety certification program.' },
  { year: '2023', event: 'Spiti expedition. 22 riders. 7 days. The hardest thing most of us had ever done.' },
  { year: '2024', event: 'Crossed 500 active members. 80+ rides. 12 states.' },
]

const code = [
  { rule: 'Gear Up Always', detail: 'Every ride, every time. ATGATT is not a suggestion.' },
  { rule: 'Ride Your Own Ride', detail: 'No peer pressure on pace. No judgement on ability. Everyone finishes together.' },
  { rule: 'Leave No Rider Behind', detail: 'If someone needs help on the road, we stop. Period.' },
  { rule: 'Respect the Road', detail: 'Communities, villages, wildlife — we move through with care.' },
  { rule: 'Earn Your Stripes', detail: 'Trust in this community is built through rides, not talk.' },
]

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )

      gsap.fromTo(
        storyRef.current?.querySelectorAll('.timeline-item') ?? [],
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 75%', once: true },
        }
      )

      gsap.fromTo(
        codeRef.current?.querySelectorAll('.code-item') ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: codeRef.current, start: 'top 75%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Page Hero */}
      <section className="relative flex items-end overflow-hidden bg-bg pt-40 pb-24 min-h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(217,95,0,0.1)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-8">
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full border border-none text-accent bg-accent/10">Our Story</span>
          </div>
          <h1 className="hero-item font-heading font-black mb-8 text-[clamp(4rem,8vw,7rem)] text-primary leading-none">
            Built on Asphalt,<br />
            <span className="text-accent">Bonded by Grit</span>
          </h1>
          <p className="hero-item font-body text-xl lg:text-2xl max-w-2xl leading-relaxed text-secondary">
            MotoXCode was never supposed to be this big. It started as an obsession. It became a movement.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-section relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1">
              <h2 className="font-heading font-black mb-8 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
                Why We Exist
              </h2>
              <div className="space-y-6 text-secondary">
                <p className="font-body text-lg lg:text-xl leading-relaxed">
                  Most riding groups are about the bike. MotoXCode is about the rider. There's a difference — and we felt it every time we tried to find our people.
                </p>
                <p className="font-body text-lg lg:text-xl leading-relaxed">
                  We wanted a community that took safety as seriously as speed. That valued the story of a ride over the spec sheet of the machine. That made space for the beginner and the veteran in the same convoy.
                </p>
                <p className="font-body text-lg lg:text-xl leading-relaxed">
                  So we built it. And every person who rides with us adds a chapter to what it means.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 mt-12">
                <Link to="/join" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-4 rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)]">
                  Be Part of It
                </Link>
                <Link to="/crew" className="inline-flex items-center gap-2 border border-white/10 text-primary font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-4 rounded transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5">
                  Meet the Team
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <img
                  src="/assets/images/homepage/about-story.jpg"
                  alt="MotoXCode Story"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <blockquote className="font-heading font-bold text-3xl lg:text-4xl italic mb-4 text-primary leading-tight">
                    "The road is not a destination.<br />
                    It's a conversation."
                  </blockquote>
                  <p className="font-accent text-sm tracking-widest uppercase font-semibold text-accent">
                    — Arjun Mehta, Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={storyRef} className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-black mb-20 text-center text-[clamp(2.5rem,5vw,4.5rem)] text-primary">
              The Journey
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-16 md:left-[5.5rem] top-0 bottom-0 w-px hidden md:block opacity-30 bg-gradient-to-b from-transparent via-accent to-transparent" />
              <div className="space-y-0">
                {timeline.map((item) => (
                  <div key={item.year} className="timeline-item flex flex-col md:flex-row gap-6 md:gap-20 items-start py-10 border-b border-white/5">
                    <div className="flex-shrink-0 w-24 font-heading font-black text-accent text-3xl leading-none">
                      {item.year}
                    </div>
                    <p className="font-body text-xl lg:text-2xl leading-relaxed text-secondary">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Riding Code */}
      <section ref={codeRef} className="py-32 bg-gradient-to-b from-section to-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full border border-none text-accent bg-accent/10 mb-6">Our Creed</span>
            <h2 className="font-heading font-black mb-6 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
              The Riding Code
            </h2>
            <p className="font-body text-xl text-secondary">
              Five principles. Non-negotiable.
            </p>
          </div>
          <div className="flex flex-col gap-12 max-w-4xl mx-auto">
            {code.map((item, i) => (
              <div
                key={item.rule}
                className="code-item flex flex-col sm:flex-row items-start gap-8 sm:gap-12 p-8 rounded-2xl transition-colors duration-300 hover:bg-white/5"
              >
                <div className="font-heading font-black text-6xl opacity-30 shrink-0 text-accent leading-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl lg:text-3xl mb-3 text-primary">
                    {item.rule}
                  </h3>
                  <p className="font-body text-lg leading-relaxed text-secondary">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
