import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FormData {
  name: string
  email: string
  phone: string
  location: string
  bike: string
  experience: string
  why: string
  ridden: string
  agree: boolean
}

const experienceLevels = ['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']

export default function Join() {
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', location: '',
    bike: '', experience: '', why: '', ridden: '', agree: false,
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value
    setFormData((prev) => ({ ...prev, [target.name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden bg-bg pt-28 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_70%,rgba(255,107,0,0.08)_0%,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10" ref={heroRef}>
          <div className="hero-item mb-5"><span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-accent text-accent bg-accent/10">Membership</span></div>
          <h1 className="hero-item font-heading font-black mb-4 text-[clamp(2.5rem,6vw,5rem)] text-primary leading-tight">
            Earn Your<br /><span className="text-accent">Place in the Pack</span>
          </h1>
          <p className="hero-item font-body text-lg max-w-xl text-secondary">
            MotoXCode membership isn't automatic. Tell us who you are, what you ride, and why the road calls you. We'll take it from there.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl mx-auto" ref={formRef}>
            {submitted ? (
              <div className="text-center py-20 rounded-sm bg-surface border border-border">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-accent/15 text-accent">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <h2 className="font-heading font-bold text-2xl mb-3 text-primary">
                  Application Received
                </h2>
                <p className="font-body text-base text-secondary">
                  Thank you, {formData.name}. We review every application personally. You'll hear from us within 7 days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="join-form" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="join-name" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Full Name *</label>
                    <input
                      id="join-name" name="name" type="text" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="Your name"
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="join-email" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Email *</label>
                    <input
                      id="join-email" name="email" type="email" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="you@email.com"
                      value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="join-phone" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Phone</label>
                    <input
                      id="join-phone" name="phone" type="tel"
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="+91 XXXXX XXXXX"
                      value={formData.phone} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="join-location" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">City / Location *</label>
                    <input
                      id="join-location" name="location" type="text" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="Your city"
                      value={formData.location} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="join-bike" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Your Bike *</label>
                    <input
                      id="join-bike" name="bike" type="text" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" placeholder="Make, model, year"
                      value={formData.bike} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="join-experience" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Riding Experience *</label>
                    <select
                      id="join-experience" name="experience" required
                      className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent appearance-none"
                      value={formData.experience} onChange={handleChange}
                    >
                      <option value="" disabled>Select experience</option>
                      {experienceLevels.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="join-ridden" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Where have you ridden? (top routes / trips)</label>
                  <textarea
                    id="join-ridden" name="ridden"
                    className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" rows={3} placeholder="E.g. Leh-Ladakh, Coorg, Rajasthan circuit..."
                    value={formData.ridden} onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="join-why" className="block font-accent text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Why MotoXCode? *</label>
                  <textarea
                    id="join-why" name="why" required
                    className="w-full bg-surface border border-border rounded py-3.5 px-5 text-primary font-body text-[0.9375rem] transition-colors duration-200 outline-none placeholder:text-secondary placeholder:opacity-60 focus:border-accent" rows={4} placeholder="Tell us why you want to ride with us..."
                    value={formData.why} onChange={handleChange}
                  />
                </div>
                {/* Agreement */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    id="join-agree" name="agree" type="checkbox" required
                    className="mt-0.5 flex-shrink-0 accent-orange-600 w-4 h-4"
                    checked={formData.agree}
                    onChange={handleChange}
                  />
                  <span className="font-accent text-sm text-secondary">
                    I agree to uphold the MotoXCode riding code and understand that membership is subject to review.
                  </span>
                </label>

                <button type="submit" id="join-submit" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)] w-full justify-center">
                  Submit Application
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
