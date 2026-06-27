import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignInImg from "/assets/images/signin/signin.png";
import UsernameForm from "@/components/pages/signin/UsernameForm";
import OTPLogin from "@/components/pages/signin/OTPLogin";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import ForgotPasswordForm from "@/components/pages/signin/ForgotPasswordForm";
import AlreadySignedIn from "@/components/auth/AlreadySignedIn";
import { useUser } from "@/context/UserContext";

const SignIn: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp" | "forgot">(
    "password",
  );
  const [step, setStep] = useState<number>(1);
  const { userDetails } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="flex flex-col h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <main className="grid grid-cols-1 lg:grid-cols-2 h-[100dvh]">
        {/* Left Side: Asset Container */}
        <div className="hidden lg:block relative">
          <img
            src={SignInImg}
            alt="Sign In Image"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {/* Subtle gradient overlay to merge into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-[var(--color-bg)]/80 mix-blend-multiply" />
        </div>

        {/* Right Side: Interactive Form */}
        <div className="h-full flex flex-col px-4 py-8 md:py-12 relative overflow-y-auto">
          {/* Mobile Ambient Light */}
          <div className="absolute top-[10%] left-[5%] w-[60%] h-[40%] rounded-full bg-[var(--color-highlight)] blur-[120px] pointer-events-none lg:hidden" />

          {/* Header Branding */}
          <div className="text-center mb-8 relative z-10">
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
          </div>

          {/* Form Container */}
          <div className="flex flex-col flex-1 items-center justify-center relative z-10">
            <div className="flex flex-col justify-center gap-6 lg:text-lg w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[30vw]">
              {userDetails ? (
                <AlreadySignedIn />
              ) : (
                <>
                  {/* Dynamic Form Render */}
                  <div className="flex items-center w-full">
                    {loginMethod === "forgot" ? (
                      <ForgotPasswordForm
                        onCancel={() => setLoginMethod("password")}
                      />
                    ) : loginMethod === "password" ? (
                      <UsernameForm
                        onForgotPassword={() => setLoginMethod("forgot")}
                      />
                    ) : (
                      <OTPLogin step={step} setStep={setStep} />
                    )}
                  </div>

                  {loginMethod !== "forgot" && (
                    <>
                      {/* OR divider */}
                      <div className="h-[1px] w-full bg-white/10 mt-6 mb-6 relative flex justify-center items-center">
                        <div className="absolute hidden lg:block bg-[var(--color-bg)] text-[var(--color-text-secondary)] px-4 font-[var(--font-mono)] text-xs tracking-widest uppercase">
                          or
                        </div>
                      </div>

                      {/* Secondary Actions */}
                      <GoogleLoginButton
                        key={`mxc-auth-signin-state-${false}`}
                        isSignUp={false}
                      />

                      {loginMethod === "password" ? (
                        <button
                          onClick={() => setLoginMethod("otp")}
                          className="btn-outline px-8 py-3 text-xs md:text-sm"
                        >
                          Login with OTP
                        </button>
                      ) : (
                        <button
                          onClick={() => setLoginMethod("password")}
                          className="btn-outline px-8 py-3 text-xs md:text-sm"
                        >
                          Login with Password
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!userDetails && (
              <div className="text-center mt-12 pb-6 relative z-10">
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-[var(--font-body)]">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-[var(--color-accent)] hover:underline font-medium transition-colors hover:text-[var(--color-primary)]"
                  >
                    Sign Up
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

export default SignIn;
