import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import StaggeredMenu from "./StaggeredMenu";
import { Social } from "@/types/social";

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface NavLinkItem {
  to: string;
  label: string;
}

const navLinks: NavLinkItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/crew", label: "Crew" },
  { to: "/rides", label: "Rides" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

/* ===================== ANIMATIONS ===================== */

const navbarVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: EASE_PREMIUM,
    },
  },
};

const navItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.8,
      ease: EASE_PREMIUM,
    },
  }),
};

/* ===================== COMPONENT ===================== */
interface NavbarProps {
  socials: Social[];
}
const Navbar: React.FC<NavbarProps> = ({ socials }) => {
  const [scrolled, setScrolled] = useState<boolean>(() => typeof window !== 'undefined' ? window.scrollY > 20 : false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      if (newWidth >= 768) {
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "";
  }, [location]);

  /* Desktop navbar width logic */
  let maxWidth = windowWidth;
  let marginLeft = 0;

  if (scrolled && windowWidth >= 768) {
    if (windowWidth >= 1440) maxWidth = windowWidth * 0.6;
    else if (windowWidth >= 1024) maxWidth = windowWidth * 0.8;
    else maxWidth = windowWidth * 0.95;

    marginLeft = (windowWidth - maxWidth) / 2;
  }

  return (
    <>
      {/* ================= DESKTOP / TABLET ================= */}
      {windowWidth >= 768 && (
        <motion.header
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
          className={`fixed ${scrolled ? "top-5 py-4 px-8 rounded-[2.5rem] bg-[var(--color-navbar-bg)] backdrop-blur-[18px] shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-white/10" : "top-0 py-6 px-8 rounded-none bg-transparent backdrop-blur-none shadow-none border border-transparent"} left-0 z-40 w-full transition-[top,padding,border-radius,background-color,backdrop-filter,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
          style={{
            maxWidth,
            marginLeft,
          }}
        >
          <div className="w-full xl:max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              custom={0}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to="/"
                className="flex items-center gap-2 group"
                aria-label="MotoXCode Home"
              >
                <div className="size-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
                    <path
                      d="M2 12L8 4L14 12H2Z"
                      fill="var(--color-bg)"
                      fillOpacity="0.9"
                    />
                  </svg>
                </div>
              </Link>
            </motion.div>

            <ul className="flex md:gap-5 xl:gap-8 items-center">
              {navLinks.map((item, i) => (
                <motion.li
                  key={item.to}
                  custom={i + 1}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `relative font-[var(--font-body)] text-sm font-medium transition-colors duration-300 tracking-wide py-1 group ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className={`absolute left-0 bottom-0 h-[2px] rounded-full transition-all duration-300 ease-out ${
                            isActive
                              ? "w-full bg-[var(--color-primary)]"
                              : "w-0 bg-[var(--color-accent-hover)] group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <motion.div
              custom={navLinks.length + 1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              className="flex md:gap-4 xl:gap-5"
            >
              <Link
                to="/join"
                className="btn-primary hidden sm:inline-flex px-5 py-2.5 text-xs"
              >
                Join the Crew
              </Link>
            </motion.div>
          </div>
        </motion.header>
      )}

      {/* ================= MOBILE ================= */}
      {windowWidth < 768 && (
        <StaggeredMenu
          items={navLinks}
          socialItems={socials}
          displaySocials={true}
          colors={["var(--color-primary)", "var(--color-bg)"]}
          menuButtonColor="var(--color-text-primary)"
          openMenuButtonColor="var(--color-text-primary)"
          accentColor="var(--color-highlight)"
          onMenuOpen={() => {
            document.body.style.overflow = "hidden";
          }}
          onMenuClose={() => {
            document.body.style.overflow = "";
          }}
        />
      )}
    </>
  );
};

export default Navbar;
