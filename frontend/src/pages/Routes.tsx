import RoutesHero from '../components/pages/routes/RoutesHero'
import RoutesGrid from '../components/pages/routes/RoutesGrid'

export default function Routes() {
  return (
    <>
      <RoutesHero />
      <RoutesGrid />

      {/* Submit a route CTA — keeping simple inline as it's just a footer link */}
      <section className="py-20 bg-gradient-to-b from-[var(--color-section)] via-[var(--color-bg)] to-black border-t border-[var(--color-border)]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full text-center">
          <h2 className="font-heading font-bold mb-4 text-[clamp(1.5rem,3vw,2.25rem)] text-primary">
            Know a route we should add?
          </h2>
          <p className="font-body text-base mb-8 max-w-md mx-auto text-secondary">
            Members can submit their own discovered routes. The best ones become MotoXCode official runs.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)]">
            Submit a Route
          </a>
        </div>
      </section>
    </>
  )
}
