import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ContactHeroProps {
  ContactHeroBg: string;
}

export default function ContactHero({ ContactHeroBg }: ContactHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(
        '.hero-anim',
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.15, 
          ease: 'power3.out' 
        }
      )
    }, contentRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${ContactHeroBg})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-bg) 0%, rgba(2,6,23,0.4) 40%, rgba(2,6,23,0.4) 60%, var(--color-bg) 100%)',
        }}
      />

      <div className="relative z-10 w-full" ref={contentRef}>
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center px-4 py-10 md:px-6 md:py-12 lg:px-12 lg:py-20">
          <div className="hero-anim mb-6">
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] md:text-xs lg:text-sm font-bold tracking-[0.05em] uppercase px-4 md:px-6 py-2.5 rounded-full text-[var(--color-bg)] bg-[var(--color-primary)] shadow-[0_8px_32px_rgba(248,250,252,0.2)]">
              Get in Touch
            </span>
          </div>

          <h1
            className="
              hero-anim
              font-[var(--font-heading)]
              font-black
              leading-[0.9]
              tracking-tighter
              mb-4 sm:mb-6
              text-[clamp(3.5rem,10vw,8rem)]
              text-center
              text-[var(--color-primary)]
              drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]
              uppercase
            "
          >
            Let's Talk<br />
            <span className="text-[var(--color-accent)] text-[clamp(2.7rem,9vw,7rem)]">Motorcycles</span>
          </h1>

          <p className="hero-anim font-[var(--font-body)] font-medium max-w-2xl mx-auto text-sm md:text-base lg:text-xl text-[var(--color-text-primary)] opacity-90 leading-relaxed mb-10">
            Have questions, want to collaborate, or ready to ride? Drop us a line. We're always listening.
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hero-anim text-[var(--color-text-primary)] opacity-60">
        <span className="font-[var(--font-body)] text-xs tracking-widest uppercase">
          Scroll Down
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-[var(--color-text-primary)] to-transparent" />
      </div>
    </section>
  )
}

