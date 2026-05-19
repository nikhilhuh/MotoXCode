import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryImage } from "@/types/galleryImage";

gsap.registerPlugin(ScrollTrigger);

interface GalleryPreviewProps {
  galleryPreviewImages: GalleryImage[];
}

export default function GalleryPreview({
  galleryPreviewImages,
}: GalleryPreviewProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
  } | null>(null);

  // Scroll lock when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── LIGHTBOX PORTAL ── */}
      {lightbox &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setLightbox(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-accent)]/30 text-white transition-colors cursor-pointer z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Image & Title Container — stop propagation so clicking content itself doesn't close */}
            <div
              className="relative flex flex-col items-center gap-4 max-w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title at top of the image */}
              <h3 className="font-heading text-2xl md:text-4xl text-[var(--color-primary)] tracking-[0.1em] text-center select-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {lightbox.title}
              </h3>
              
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-w-full max-h-[72vh] md:max-h-[78vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </div>,
          document.body,
        )}

      {/* ── SECTION ── */}
      <section
        ref={sectionRef}
        className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-section)]"
      >
        {/* Ambient glow blobs */}
        <div className="absolute -top-[10%] right-[5%] w-[35%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] -left-[5%] w-[35%] h-[40%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0" />

        {/* Section header — centered */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
          <h2 className="section-heading">Through the Lens</h2>
          <p className="section-subheading text-center">
            Roads conquered, moments shared, machines remembered.
          </p>
        </div>

        {/* Grid — flows left-to-right in rows of 1 → 2 → 3 */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPreviewImages.map((img) => (
              <div
                key={img.id}
                className="gallery-item group relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer aspect-[4/3]"
                onClick={() => setLightbox({ src: img.src, title: img.title })}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <span className="font-heading font-bold text-xl text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {img.title}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 bg-white/5 backdrop-blur-sm">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
