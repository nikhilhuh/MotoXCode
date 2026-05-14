import { Link } from 'react-router-dom'

const footerLinks = {
  'Explore': [
    { to: '/about', label: 'About Us' },
    { to: '/crew', label: 'Our Crew' },
    { to: '/rides', label: 'Rides' },
    { to: '/routes', label: 'Routes' },
  ],
  'Community': [
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/join', label: 'Join Us' },
    { to: '/contact', label: 'Contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t mt-0 border-[var(--color-border)]/20 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12L8 4L14 12H2Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span className="font-heading font-black text-lg tracking-[0.15em] text-primary uppercase">
                Moto<span className="text-accent">X</span>Code
              </span>
            </Link>
            <p className="font-accent text-sm leading-relaxed max-w-xs text-secondary">
              Born to ride. Built to belong. A premium motorcycle community for riders who take both the road and the craft seriously.
            </p>
            <div className="flex gap-4 mt-6">
              {['Instagram', 'YouTube', 'Strava'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-accent text-xs font-semibold tracking-widest text-secondary hover:text-accent uppercase transition-colors duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-accent text-xs font-bold tracking-[0.15em] text-secondary uppercase mb-5">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="font-accent text-sm text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="font-accent text-xs text-secondary">
            © {new Date().getFullYear()} MotoXCode. All rights reserved.
          </p>
          <p className="font-accent text-xs tracking-widest text-secondary opacity-50 uppercase">
            Born to Ride. Built to Belong.
          </p>
        </div>
      </div>
    </footer>
  )
}
