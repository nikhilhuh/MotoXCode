import type { Route } from '../../types/route'

interface RouteCardProps {
  route: Route
}

const difficultyColor: Record<string, string> = {
  Easy: '#4ade80',
  Medium: '#facc15',
  Hard: '#f87171',
}

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <div
      className="group overflow-hidden rounded-sm card-hover relative"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={route.image}
          alt={route.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, var(--color-surface) 0%, #111 100%)', zIndex: -1 }}
        />
        <div className="img-overlay" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="pill" style={{ background: 'rgba(0,0,0,0.7)', color: difficultyColor[route.difficulty] ?? '#A1A1A1', borderColor: 'rgba(255,255,255,0.1)' }}>
            {route.difficulty}
          </span>
          <span className="pill" style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
            {route.terrain}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="font-heading font-bold text-lg mb-1 group-hover:text-accent transition-colors duration-200"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {route.name}
        </h3>
        <p
          className="font-accent text-sm font-semibold mb-3"
          style={{ color: 'var(--color-accent)', opacity: 0.85 }}
        >
          {route.distance}
        </p>
        {route.description && (
          <p
            className="font-body text-sm leading-relaxed line-clamp-2 mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {route.description}
          </p>
        )}
        {route.highlights && (
          <div className="flex flex-wrap gap-1.5">
            {route.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="font-accent text-xs px-2 py-0.5 rounded-sm"
                style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
              >
                {h}
              </span>
            ))}
          </div>
        )}
        {route.bestSeason && (
          <p
            className="font-accent text-xs mt-4 flex items-center gap-1.5"
            style={{ color: 'var(--color-text-secondary)', opacity: 0.6 }}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z"/>
            </svg>
            Best: {route.bestSeason}
          </p>
        )}
      </div>
    </div>
  )
}
