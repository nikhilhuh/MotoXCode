import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const galleryImages = [
  { src: '/assets/images/gallery/img-1.jpg', title: 'Mountain Pass Celebration' },
  { src: '/assets/images/gallery/img-2.jpg', title: 'Coastal Convoy' },
  { src: '/assets/images/gallery/img-7.jpg', title: 'Rain Reflections' },
  { src: '/assets/images/gallery/img-4.jpg', title: 'Desert Run' },
  { src: '/assets/images/gallery/img-5.jpg', title: 'Himalayan Scale' },
  { src: '/assets/images/gallery/img-6.jpg', title: 'Golden Hour Viewpoint' },
  { src: '/assets/images/gallery/img-8.jpg', title: 'Campfire Stories' },
]

export default function GalleryPreview() {
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        galleryRef.current?.querySelectorAll('.gallery-item') ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: galleryRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
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
  )
}
