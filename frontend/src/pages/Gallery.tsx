import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const galleryData = [
  { src: '/assets/images/gallery/img-1.jpg', alt: 'Riders on mountain pass', title: 'The Summit' },
  { src: '/assets/images/gallery/img-2.jpg', alt: 'Sunset ride on coastal road', title: 'Coastal Run' },
  { src: '/assets/images/gallery/img-3.jpg', alt: 'Desert convoy', title: 'Dust & Glory' },
  { src: '/assets/images/gallery/img-4.jpg', alt: 'Morning fuel stop', title: 'First Light' },
  { src: '/assets/images/gallery/img-5.jpg', alt: 'Group photo at summit', title: 'Brotherhood' },
  { src: '/assets/images/gallery/img-6.jpg', alt: 'Night campfire after ride', title: 'Tales by the Fire' },
  { src: '/assets/images/gallery/img-7.jpg', alt: 'Helmet close-up in rain', title: 'Monsoon Grit' },
  { src: '/assets/images/gallery/img-8.jpg', alt: 'Bikes parked at viewpoint', title: 'The Lineup' },
  { src: '/assets/images/gallery/img-9.jpg', alt: 'Rider in full gear', title: 'Pre-flight Check' },
]

export default function Gallery() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        gridRef.current?.querySelectorAll('.gallery-item') ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Gallery"
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
            style={{ maxHeight: '90vh' }}
          />
          <button
            className="absolute top-6 right-6 p-4 font-accent text-xl bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors"
            style={{ color: 'white' }}
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* Hero */}
      <section className="relative flex items-end overflow-hidden bg-bg pt-40 pb-24 min-h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-8">
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full border border-none text-accent bg-accent/10">Visual Archive</span>
          </div>
          <h1 className="hero-item font-heading font-black mb-6 text-[clamp(4rem,8vw,7rem)] text-primary leading-none">
            Through<br /><span className="text-accent">the Lens</span>
          </h1>
          <p className="hero-item font-body text-xl lg:text-2xl max-w-2xl leading-relaxed text-secondary">
            A visual record of the roads we've conquered, the moments we've shared, and the machines that carried us there.
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div
            ref={gridRef}
            className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
          >
            {galleryData.map((img, i) => (
              <div
                key={i}
                className="gallery-item group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-surface"
                onClick={() => setLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover overlay with title */}
                <div
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="font-heading font-bold text-2xl text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {img.title}
                  </span>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 bg-white/5 backdrop-blur-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
