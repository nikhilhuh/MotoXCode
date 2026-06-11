import { Link } from "react-router-dom";
import { Social } from "@/types/social";
import { useUser } from "@/context/UserContext";
import {
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaStrava,
  FaFacebook,
  FaXTwitter,
  FaDiscord,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa6";

const getSocialIcon = (label: string) => {
  const cleanLabel = label.toLowerCase().trim();
  switch (cleanLabel) {
    case "instagram":
      return <FaInstagram size={18} />;
    case "youtube":
      return <FaYoutube size={18} />;
    case "whatsapp":
      return <FaWhatsapp size={18} />;
    case "strava":
      return <FaStrava size={18} />;
    case "facebook":
      return <FaFacebook size={18} />;
    case "twitter":
    case "x":
    case "xtwitter":
      return <FaXTwitter size={18} />;
    case "discord":
      return <FaDiscord size={18} />;
    case "linkedin":
      return <FaLinkedin size={18} />;
    default:
      return <FaGlobe size={16} />;
  }
};

const footerGroups = [
  {
    heading: "Explore",
    links: [
      { to: "/", label: "Home"},
      { to: "/about", label: "About Us" },
      { to: "/crew", label: "Our Crew" },
    ],
  },
  {
    heading: "Community",
    links: [
      { to: "/rides", label: "Rides" },
      { to: "/events", label: "Events" },
      { to: "/join", label: "Join Us" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
];

interface FooterProps {
  socials: Social[];
}
export default function Footer({ socials }: FooterProps) {
  const { userDetails, isInitialized } = useUser();

  return (
    <footer className="relative border-t border-[var(--color-border)]/20 bg-gradient-to-b from-black via-[var(--color-bg)] to-[var(--color-surface)]  overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)]/60 to-transparent" />
      <div className="absolute -top-[20%] left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-primary)]/3 blur-[140px] pointer-events-none" />
      <div className="absolute -top-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-[var(--color-accent)]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20 pb-6 relative z-10">
        {/* Top: Brand + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <div className="size-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(248,250,252,0.3)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 12L8 4L14 12H2Z"
                    fill="var(--color-bg)"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <span className="font-heading font-black text-xl tracking-[0.15em] text-[var(--color-primary)] uppercase">
                Moto<span className="text-[var(--color-accent)]">X</span>Code
              </span>
            </Link>

            <p className="font-body text-sm leading-relaxed max-w-sm text-[var(--color-text-secondary)] mb-8">
              A premium motorcycle community for
              riders who take both the road and the craft seriously.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials &&
                socials.map((s) => (
                  <a
                    key={s._id}
                    href={s.link}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 flex items-center justify-center rounded-full border border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all duration-300"
                  >
                    {getSocialIcon(s.label)}
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
                {group.links
                  .filter((link) => {
                    if (link.to === "/join" && isInitialized && userDetails) return false;
                    return true;
                  })
                  .map((link) => (
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
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)]/20 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <p className="font-accent text-xs text-[var(--color-text-secondary)]/60">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> MotoXCode. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <button
                key={item}
                type="button"
                className="font-accent text-xs text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-secondary)] transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Giant Billboard Slogan */}
        <div className="w-full overflow-hidden select-none pointer-events-none mt-8 md:mt-12 lg:mt-16 border-t border-[var(--color-border)]/30 pt-6 md:pt-10">
          <h2 className="font-[var(--font-heading)] font-black text-[clamp(4rem,10vw,11rem)] leading-[0.8] text-center uppercase tracking-[-0.05em] text-[var(--color-accent)] opacity-20">
            Born to Ride
            <br />
            Built to Belong
          </h2>
        </div>
      </div>
    </footer>
  );
}
