import { Philosophy } from '@/types/philosophy'
import { Link } from 'react-router-dom'

interface AboutPhilosophyProps {
  philosophy: Philosophy;
}
export default function AboutPhilosophy({ philosophy }: AboutPhilosophyProps) {
  return (
    <section id="philosophy" className="py-12 lg:py-22 bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-section)] relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1">
            <h2 className="section-heading">
              Why We Exist
            </h2>
            <div className="space-y-6 text-[var(--color-text-secondary)]">
              <p className="font-[var(--font-body)] text-lg lg:text-xl leading-relaxed">
                Most riding groups are about the bike. MotoXCode is about the rider. There's a difference — and we felt it every time we tried to find our people.
              </p>
              <p className="font-[var(--font-body)] text-lg lg:text-xl leading-relaxed">
                We wanted a community that took safety as seriously as speed. That valued the story of a ride over the spec sheet of the machine. That made space for the beginner and the veteran in the same convoy.
              </p>
              <p className="font-[var(--font-body)] text-lg lg:text-xl leading-relaxed">
                So we built it. And every person who rides with us adds a chapter to what it means.
              </p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12">
              <Link to="/join" className="btn-primary px-8 py-4 text-sm">
                Be Part of It
              </Link>
              <Link to="/crew" className="btn-secondary px-8 py-4 text-sm">
                Meet the Team
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[var(--color-border)]/30">
              <img
                src={philosophy.image}
                alt="MotoXCode Story"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-10 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent">
                <blockquote className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl italic mb-4 text-[var(--color-primary)] leading-tight">
                  {philosophy.quote}
                </blockquote>
                <p className="font-[var(--font-sub)] text-sm tracking-widest uppercase font-semibold text-[var(--color-accent)]">
                  —{philosophy.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
