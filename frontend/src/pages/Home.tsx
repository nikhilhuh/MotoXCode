import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RideCard from '../components/ui/RideCard'
import MemberCard from '../components/ui/MemberCard'
import { rides } from '../data/rides'
import { crew } from '../data/crew'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '80+', label: 'Rides Completed' },
  { value: '1.2L km', label: 'Collective Miles' },
  { value: '12', label: 'States Covered' },
]

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

const galleryImages = [
  { src: '/assets/images/gallery/img-1.jpg', title: 'Mountain Pass Celebration' },
  { src: '/assets/images/gallery/img-2.jpg', title: 'Coastal Convoy' },
  { src: '/assets/images/gallery/img-7.jpg', title: 'Rain Reflections' },
  { src: '/assets/images/gallery/img-4.jpg', title: 'Desert Run' },
  { src: '/assets/images/gallery/img-5.jpg', title: 'Himalayan Scale' },
  { src: '/assets/images/gallery/img-6.jpg', title: 'Golden Hour Viewpoint' },
  { src: '/assets/images/gallery/img-8.jpg', title: 'Campfire Stories' },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const ridesRef = useRef<HTMLDivElement>(null)
  const crewRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 })
      heroTl
        .fromTo(
          heroTextRef.current?.querySelectorAll('.hero-anim') ?? [],
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
        )

      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-item') ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%', once: true },
        }
      )

      gsap.fromTo(
        valuesRef.current?.querySelectorAll('.value-item') ?? [],
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 75%', once: true },
        }
      )

      gsap.fromTo(
        ridesRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ridesRef.current, start: 'top 80%', once: true },
        }
      )

      gsap.fromTo(
        crewRef.current?.querySelectorAll('.crew-item') ?? [],
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: crewRef.current, start: 'top 75%', once: true },
        }
      )

      gsap.fromTo(
        galleryRef.current?.querySelectorAll('.gallery-item') ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: galleryRef.current, start: 'top 80%', once: true },
        }
      )

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', once: true },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const upcomingRides = rides.filter((r) => !r.past)

  return (
    <>
      {/* ============================================================
          HERO — Fullscreen
      ============================================================ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/assets/videos/hero/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #0F0F0F 0%, rgba(15,15,15,0.6) 50%, rgba(15,15,15,0.3) 100%)',
          }}
        />

        <div className="relative z-10 section-container w-full" ref={heroTextRef}>
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="hero-anim mb-8">
              <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full text-accent bg-accent/10 backdrop-blur-md">
                Premium Riding Community
              </span>
            </div>

            <h1 className="hero-anim font-heading font-black leading-none tracking-tight mb-8 text-[clamp(4rem,12vw,10rem)] text-primary">
              MOTO
              <span className="text-accent">X</span>
              CODE
            </h1>

            <p className="hero-anim font-accent font-semibold tracking-[0.3em] uppercase mb-14 text-[clamp(0.875rem,2vw,1.25rem)] text-secondary">
              Born to Ride.&nbsp;&nbsp;Built to Belong.
            </p>

            <div className="hero-anim flex flex-wrap justify-center gap-6">
              <Link to="/join" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)]">
                Join the Movement
              </Link>
              <Link to="/rides" className="inline-flex items-center gap-2 border border-white/10 text-primary font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-accent hover:text-accent hover:-translate-y-0.5">
                View Upcoming Rides
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 hero-anim text-secondary opacity-60">
          <span className="font-accent text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* ============================================================
          STATS
      ============================================================ */}
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

      {/* ============================================================
          VALUES — Alternating layout
      ============================================================ */}
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

      {/* ============================================================
          UPCOMING RIDES
      ============================================================ */}
      <section ref={ridesRef} className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-heading font-black mb-4 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
                Upcoming Rides
              </h2>
              <p className="font-body text-xl text-secondary">
                Find your next adventure. The best roads are meant to be shared.
              </p>
            </div>
            <Link
              to="/rides"
              className="inline-flex items-center gap-2 border border-border text-primary font-accent font-semibold text-sm tracking-[0.06em] uppercase px-6 py-3 rounded transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5 shrink-0 hidden sm:inline-flex"
            >
              View All Rides
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Horizontal scroll */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden px-6 md:px-12 lg:px-20">
          <div className="flex gap-8 pb-12" style={{ minWidth: 'max-content' }}>
            {upcomingRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          MEMBER SPOTLIGHT
      ============================================================ */}
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

      {/* ============================================================
          GALLERY PREVIEW — Masonry
      ============================================================ */}
      <section ref={galleryRef} className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="flex flex-col text-center items-center mb-16">
            <h2 className="font-heading font-black mb-6 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
              Through the Lens
            </h2>
            <Link to="/gallery" className="inline-flex items-center gap-2 border border-border text-primary font-accent font-semibold text-sm tracking-[0.06em] uppercase px-6 py-3 rounded transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5">
              View Full Gallery
            </Link>
          </div>
          
          {/* Masonry CSS columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="gallery-item group relative overflow-hidden rounded-xl break-inside-avoid shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="font-heading font-bold text-xl text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {img.title}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}
      <section ref={ctaRef} className="py-40 relative overflow-hidden bg-section border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.08)_0%,transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full text-center relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full border border-accent text-accent bg-accent/10 mb-8">Ready?</span>
          <h2 className="font-heading font-black mb-8 mx-auto max-w-4xl text-[clamp(3rem,7vw,6rem)] text-primary leading-tight">
            The road doesn't wait for the ready.
          </h2>
          <p className="font-body text-xl lg:text-2xl mb-12 mx-auto max-w-2xl leading-relaxed text-secondary">
            Apply to join MotoXCode and ride with people who treat the road as sacred.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-base tracking-[0.06em] uppercase px-10 py-4 rounded transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_40px_rgba(255,107,0,0.3)] hover:shadow-[0_12px_45px_rgba(255,107,0,0.4)]">
              Apply for Membership
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
