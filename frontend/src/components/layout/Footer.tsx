import { Link } from 'react-router-dom'


const footerGroups = [
  {
    heading: 'Explore',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/crew', label: 'Our Crew' },
      { to: '/routes', label: 'Routes' },
      { to: '/gallery', label: 'Gallery' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { to: '/rides', label: 'Rides' },
      { to: '/events', label: 'Events' },
      { to: '/join', label: 'Join Us' },
      { to: '/contact', label: 'Contact' },
    ],
  },
]

const socials = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'Strava',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)]/20 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)]/60 to-transparent" />
      <div className="absolute -top-[20%] left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-primary)]/3 blur-[140px] pointer-events-none" />
      <div className="absolute -top-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-[var(--color-accent)]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 relative z-10">

        {/* Top: Brand + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <div className="w-9 h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(248,250,252,0.3)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12L8 4L14 12H2Z" fill="var(--color-bg)" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="font-heading font-black text-xl tracking-[0.15em] text-[var(--color-primary)] uppercase">
                Moto<span className="text-[var(--color-accent)]">X</span>Code
              </span>
            </Link>

            <p className="font-body text-sm leading-relaxed max-w-xs text-[var(--color-text-secondary)] mb-8">
              Born to ride. Built to belong. A premium motorcycle community for riders who take both the road and the craft seriously.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h4 className="font-accent text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-text-secondary)] uppercase mb-5">
                {group.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="font-body text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-[var(--color-primary)] transition-all duration-300 overflow-hidden" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)]/40 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-accent text-xs text-[var(--color-text-secondary)]/60">
            © {new Date().getFullYear()} MotoXCode. All rights reserved.
          </p>
          <p className="font-heading font-black text-xs tracking-[0.3em] text-[var(--color-text-secondary)]/40 uppercase">
            Born to Ride · Built to Belong
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-accent text-xs text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-secondary)] transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
