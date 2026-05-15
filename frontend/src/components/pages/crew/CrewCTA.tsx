import { Link } from 'react-router-dom'

export default function CrewCTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-section border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.05)_0%,transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full max-w-3xl text-center relative z-10">
        <h2 className="font-heading font-black mb-6 text-[clamp(2.5rem,5vw,4.5rem)] text-primary leading-tight">
          Think you belong here?
        </h2>
        <p className="font-body text-xl mb-12 max-w-xl mx-auto leading-relaxed text-secondary">
          We're always looking for riders who bring more than horsepower to the table.
        </p>
        <Link to="/join" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-10 py-4 rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)] justify-center">
          Apply to Join
        </Link>
      </div>
    </section>
  )
}
