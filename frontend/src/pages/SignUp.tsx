import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignInImg from "/assets/images/signin/signin.png";
import SignUpStep1 from "@/components/pages/signup/SignUpStep1";
import SignUpStep2 from "@/components/pages/signup/SignUpStep2";
import SignUpStep3 from "@/components/pages/signup/SignUpStep3";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import AlreadySignedIn from "@/components/auth/AlreadySignedIn";
import { useUser } from "@/context/UserContext";

// Component
const SignUp: React.FC = () => {
  const [signUpStep, setSignUpStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verifiedToken, setVerifiedToken] = useState<string>("");
  const { userDetails } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Step progress bar segments
  const steps = [1, 2, 3];

  return (
    <section className="flex flex-col h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <main className="grid grid-cols-1 lg:grid-cols-2 h-[100dvh]">
        {/* Left: Image Panel  */}
        <div className="hidden lg:block relative">
          <img
            src={SignInImg}
            alt="Sign Up"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {/* Gradient overlay matching SignIn.tsx */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-[var(--color-bg)]/80 mix-blend-multiply" />

          {/* Step labels overlay on left panel */}
          <div className="absolute bottom-10 left-10 right-10 z-10 flex flex-col gap-3">
            {steps.map((s) => (
              <div
                key={s}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  s < signUpStep
                    ? "opacity-50"
                    : s === signUpStep
                      ? "opacity-100"
                      : "opacity-25"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold font-[var(--font-mono)] transition-all duration-300 ${
                    s < signUpStep
                      ? "bg-[var(--color-highlight)] border-[var(--color-highlight)] text-white"
                      : s === signUpStep
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-white/30 text-white/30"
                  }`}
                >
                  {s < signUpStep ? "✓" : s}
                </div>
                <span
                  className={`font-[var(--font-sub)] text-xs tracking-[0.15em] uppercase ${
                    s === signUpStep
                      ? "text-[var(--color-primary)] font-bold"
                      : "text-white/50"
                  }`}
                >
                  {s === 1
                    ? "Email Verification"
                    : s === 2
                      ? "Confirm OTP"
                      : "Create Identity"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="h-full flex flex-col px-4 py-8 md:py-12 relative overflow-y-auto">
          {/* Mobile ambient glow */}
          <div className="absolute top-[10%] left-[5%] w-[60%] h-[40%] rounded-full bg-[var(--color-highlight)] blur-[120px] pointer-events-none lg:hidden opacity-20" />

          {/* Header Branding */}
          <div className="text-center mb-6 relative z-10">
            <div className="flex gap-3 items-center justify-center text-[var(--color-primary)]">
              <div className="size-8 md:size-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="black"
                  className="md:w-5 md:h-5"
                >
                  <path
                    d="M2 12L8 4L14 12H2Z"
                    fill="var(--color-bg)"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-[var(--color-primary)] font-[var(--font-heading)] font-bold tracking-widest uppercase mt-1">
                MotoXCode
              </h1>
            </div>

            {/* Mobile step progress bar */}
            <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
              {steps.map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    s <= signUpStep
                      ? "bg-[var(--color-highlight)] w-8"
                      : "bg-white/10 w-5"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="flex flex-col flex-1 items-center justify-center relative z-10">
            <div className="flex flex-col justify-center gap-6 lg:text-lg w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[30vw]">
              {userDetails ? (
                <AlreadySignedIn />
              ) : (
                <>
                  {/* Dynamic Step Render */}
                  <div className="flex items-center w-full">
                    {signUpStep === 1 && (
                      <SignUpStep1
                        email={email}
                        setEmail={setEmail}
                        onSuccess={() => setSignUpStep(2)}
                      />
                    )}
                    {signUpStep === 2 && (
                      <SignUpStep2
                        email={email}
                        onSuccess={(token) => {
                          setVerifiedToken(token);
                          setSignUpStep(3);
                        }}
                        onBack={() => setSignUpStep(1)}
                      />
                    )}
                    {signUpStep === 3 && (
                      <SignUpStep3
                        email={email}
                        verifiedToken={verifiedToken}
                      />
                    )}
                  </div>

                  {/* Only show OR divider + Google on Step 1 */}
                  {signUpStep === 1 && (
                    <>
                      {/* OR divider */}
                      <div className="h-[1px] w-full bg-white/10 mt-2 mb-2 relative flex justify-center items-center">
                        <div className="absolute hidden lg:block bg-[var(--color-bg)] text-[var(--color-text-secondary)] px-4 font-[var(--font-mono)] text-xs tracking-widest uppercase">
                          or
                        </div>
                      </div>

                      {/* Google OAuth — reuses existing component, handles upsert + redirect */}
                      <GoogleLoginButton
                        key={`mxc-auth-signup-state-${true}`}
                        isSignUp={true}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer: Already a member? */}
            {!userDetails && (
              <div className="text-center mt-10 pb-6 relative z-10">
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-[var(--font-body)]">
                  Already a member?{" "}
                  <Link
                    to="/signin"
                    className="text-[var(--color-accent)] hover:underline font-medium transition-colors hover:text-[var(--color-primary)]"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default SignUp;
