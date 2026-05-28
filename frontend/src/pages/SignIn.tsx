import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMotorcycle, FaArrowLeft } from "react-icons/fa";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in attempt with:", email);
  };

  return (
    <main className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex bg-[var(--color-bg)]">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/join/joinHero.png')",
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-black/30" />

        <div className="relative z-10 flex flex-col justify-between h-full w-full p-10 xl:p-16">
          <div className="flex flex-col items-start gap-4">
            <Link
              to="/join"
              className="text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 font-[var(--font-body)] uppercase tracking-wider text-sm font-bold"
            >
              <FaArrowLeft />
              Back
            </Link>

            <div className="text-[var(--color-primary)] flex items-center gap-3 w-fit">
              <FaMotorcycle className="text-3xl" />

              <span className="font-[var(--font-heading)] text-3xl tracking-widest uppercase mt-1">
                MotoXCode
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="font-[var(--font-heading)] font-black text-[clamp(3.2rem,6vw,7rem)] text-[var(--color-primary)] uppercase leading-[0.92] mb-6 tracking-tight">
              Welcome <br />
              <span className="text-[var(--color-accent)]">
                Back Rider
              </span>
            </h1>

            <p className="font-body text-lg tracking-wide leading-relaxed text-[var(--color-text-secondary)] max-w-md">
              Log in to connect with the crew, find upcoming rides,
              and share your journey on the open road.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Right Side */}
      <section className="relative flex w-full lg:w-1/2 items-center justify-center h-full overflow-hidden">
        {/* Mobile Background Blur */}
        <div className="absolute top-[10%] left-[5%] w-[60%] h-[40%] rounded-full bg-[var(--color-highlight)]/5 blur-[120px] pointer-events-none lg:hidden" />

        <div className="absolute bottom-[10%] right-[5%] w-[60%] h-[40%] rounded-full bg-[var(--color-accent)]/10 blur-[140px] pointer-events-none lg:hidden" />

        {/* Mobile Back Button */}
        <Link
          to="/join"
          className="absolute top-10 left-5 sm:top-12 sm:left-6 lg:hidden text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 font-[var(--font-body)] uppercase tracking-wider text-xs font-bold z-20"
        >
          <FaArrowLeft />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md px-5 sm:px-8 py-6 sm:py-8 lg:py-10 h-full flex items-center"
        >
          <div className="w-full bg-transparent md:bg-[var(--color-section)]/30 lg:bg-transparent md:backdrop-blur-xl lg:backdrop-blur-none border border-transparent md:border-[var(--color-border)]/40 lg:border-transparent rounded-3xl p-5 sm:p-8 md:p-10 lg:p-0 shadow-none md:shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:shadow-none">
            {/* Mobile Branding */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 text-[var(--color-primary)]">
                <FaMotorcycle className="text-3xl sm:text-4xl" />

                <span className="font-[var(--font-heading)] text-2xl sm:text-4xl tracking-widest uppercase mt-1">
                  MotoXCode
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl mb-2">
                Sign In
              </h2>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rider@example.com"
                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)]/60 rounded-md px-4 sm:px-5 py-3 sm:py-4 text-[var(--color-primary)] font-body text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)]/60 rounded-md px-4 sm:px-5 py-3 sm:py-4 text-[var(--color-primary)] font-body text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50"
                />

                <div className="text-right pr-1 pt-1">
                  <a
                    href="#"
                    className="font-[var(--font-sub)] text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[var(--color-accent)] hover:text-[var(--color-primary)] hover:underline underline-offset-4 decoration-2 transition-all"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-primary py-3.5 sm:py-4 text-sm mt-2 group"
              >
                Start Engine

                <svg
                  className="transform transition-transform duration-300 group-hover:translate-x-1"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                  />
                </svg>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 lg:mt-8 text-center border-t border-[var(--color-border)]/30 pt-4 lg:pt-6">
              <p className="font-body text-[var(--color-text-secondary)] text-sm tracking-wide leading-relaxed">
                New to the crew?
                <Link
                  to="/join"
                  className="text-[var(--color-primary)] font-bold tracking-widest uppercase ml-2 hover:text-[var(--color-primary)] transition-all duration-300 relative group inline-block"
                >
                  Join Now

                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}