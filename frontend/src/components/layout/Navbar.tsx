import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/crew', label: 'Crew' },
  { to: '/rides', label: 'Rides' },
  { to: '/routes', label: 'Routes' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-border py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="MotoXCode Home"
          >
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L8 4L14 12H2Z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <span className="font-heading font-black text-lg tracking-[0.15em] text-primary uppercase">
              Moto<span className="text-accent">X</span>Code
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `font-accent text-sm font-medium px-4 py-2 rounded-sm transition-all duration-200 tracking-wide ${
                    isActive
                      ? 'text-accent'
                      : 'text-secondary hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/join"
              className="hidden lg:inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-xs tracking-[0.06em] uppercase px-5 py-2.5 rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)]"
            >
              Join the Crew
            </Link>
            <button
              id="nav-menu-toggle"
              className="lg:hidden flex flex-col gap-1.5 p-2 group"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col transition-all duration-500 bg-[#0F0F0F]/98 backdrop-blur-xl ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col items-start justify-center h-full gap-2 pt-20">
          {navLinks.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `font-heading font-bold text-4xl sm:text-5xl py-2 transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-primary hover:text-accent'
                }`
              }
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
              }}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/join"
            className="inline-flex items-center gap-2 bg-accent text-white font-accent font-semibold text-sm tracking-[0.06em] uppercase px-8 py-[0.875rem] rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,0,0.35)] mt-6"
          >
            Join the Crew
          </Link>
        </div>
      </div>
    </>
  )
}
