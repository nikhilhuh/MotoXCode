import { Link } from 'react-router-dom'

export default function AboutPhilosophy() {
  return (
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
  )
}
