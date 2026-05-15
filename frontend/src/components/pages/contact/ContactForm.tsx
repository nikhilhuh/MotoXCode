import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const contactInfo = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Base',
    value: 'Mumbai, Maharashtra, India',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'hello@motoxcode.in',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: 'Instagram',
    value: '@motoxcode.in',
  },
]

export default function ContactForm() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', message: '',
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.anim-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%', once: true },
        }
      )
    }, contentRef)
    return () => ctx.revert()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-10 anim-item">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-5">
                <div className="w-10 h-10 bg-surface border border-border text-accent rounded-sm flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-accent text-xs font-semibold uppercase tracking-widest mb-1 text-secondary">
                    {item.label}
                  </div>
                  <div className="font-body text-base text-primary">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-border">
              <p className="font-accent text-sm leading-relaxed text-secondary">
                We typically respond within 48 hours. For ride inquiries, please check the{' '}
                <a href="/rides" className="text-accent">Rides page</a> first.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 anim-item">
            {submitted ? (
              <div className="text-center py-16 rounded-sm bg-surface border border-border">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-accent/15 text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <h2 className="font-heading font-bold text-xl mb-2 text-primary">
                  Message Sent
                </h2>
                <p className="font-body text-sm text-secondary">
                  Thanks, {formData.name}. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Name *</label>
                    <input
                      id="contact-name" name="name" type="text" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="Your name"
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Email *</label>
                    <input
                      id="contact-email" name="email" type="email" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="you@email.com"
                      value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Subject</label>
                  <input
                    id="contact-subject" name="subject" type="text"
                    className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="What's this about?"
                    value={formData.subject} onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Message *</label>
                  <textarea
                    id="contact-message" name="message" required rows={6}
                    className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="Tell us everything..."
                    value={formData.message} onChange={handleChange}
                  />
                </div>
                <button type="submit" id="contact-submit" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)] w-full justify-center">
                  Send Message
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
