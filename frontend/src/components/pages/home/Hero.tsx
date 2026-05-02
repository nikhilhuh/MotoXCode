import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 })
      heroTl.fromTo(
        heroTextRef.current?.querySelectorAll('.hero-anim') ?? [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-20 px-6"
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/images/home/hero.png")' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,1) 100%)'
        }}
      />

      <div className="relative z-10 w-full" ref={heroTextRef}>
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center justify-center backdrop-blur-[2px] py-12 px-4 rounded-[2rem]">
          <div className="hero-anim mb-6">
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full text-[var(--color-text-primary)] bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
              Premium Riding Community
            </span>
          </div>

          <h1 className="hero-anim font-[var(--font-heading)] font-black leading-none tracking-tighter mb-6 text-6xl md:text-8xl lg:text-9xl text-[var(--color-primary)] drop-shadow-[0_0_20px_rgba(148,163,184,0.4)]">
            MOTOXCODE
          </h1>

          <p className="hero-anim font-[var(--font-sub)] font-medium tracking-[0.4em] uppercase mb-12 text-lg md:text-2xl text-[var(--color-accent)]">
            Born to Ride. Built to Belong.
          </p>

          <div className="hero-anim flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link 
              to="/join" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black font-[var(--font-body)] font-semibold text-sm tracking-[0.06em] uppercase px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(248,250,252,0.2)] hover:shadow-[0_12px_40px_rgba(248,250,252,0.4)]"
            >
              Join the Movement
            </Link>
            <Link 
              to="/rides" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--color-border)] text-[var(--color-text-primary)] font-[var(--font-body)] font-semibold text-sm tracking-[0.06em] uppercase px-8 py-4 rounded-full transition-all duration-300 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-[var(--color-accent)] hover:scale-105"
            >
              View Rides
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 hero-anim text-[var(--color-text-primary)] opacity-60">
        <span className="font-[var(--font-body)] text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-[var(--color-text-primary)] to-transparent" />
      </div>
    </section>
  )
}
