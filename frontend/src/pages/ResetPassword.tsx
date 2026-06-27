import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyResetToken, resetPassword } from "@/services/auth.service";
import { useFeedback } from "@/context/FeedbackContext";
import Cliploader from "@/components/ui/Cliploader";
import PasswordRequirements from "@/components/ui/PasswordRequirements";
import SignInImg from "/assets/images/signin/signin.png";
const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useFeedback();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [verifying, setVerifying] = useState<boolean>(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkToken = async () => {
      if (!token || !email) {
        setVerifying(false);
        setIsTokenValid(false);
        return;
      }

      try {
        await verifyResetToken(email, token);
        setIsTokenValid(true);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Backend operation failed.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [token, email, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const errors: Record<string, string> = {};
    if (!newPassword) {
      errors.newPassword = "Password is required.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword)
    ) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, a number, and a special character.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      const response = await resetPassword(email!, token!, newPassword);
      showSuccess(response.data.message);
      navigate("/signin");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Backend operation failed.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[100dvh]">
        {/* Left Side: Asset Container */}
        <div className="hidden lg:block relative">
          <img
            src={SignInImg}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-[var(--color-bg)]/80 mix-blend-multiply" />
        </div>

        {/* Right Side: Interactive Form */}
        <div className="h-full flex flex-col px-4 py-8 md:py-12 relative overflow-y-auto">
          {/* Ambient Light */}
          <div className="absolute top-[10%] left-[5%] w-[60%] h-[40%] rounded-full bg-[var(--color-highlight)] blur-[120px] pointer-events-none lg:hidden" />

          {/* Header Branding */}
          <div className="text-center mb-8 relative z-10">
            <Link
              to="/"
              className="flex gap-3 items-center justify-center text-[var(--color-primary)]"
            >
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
            </Link>
          </div>

          <div className="flex flex-col flex-1 items-center justify-center relative z-10">
            <div className="flex flex-col justify-center gap-6 lg:text-lg w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[30vw]">
              <div className="bg-[var(--color-surface)]/30 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-2xl">
                {verifying ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Cliploader size={40} color="var(--color-highlight)" />
                    <p className="font-[var(--font-body)] text-[var(--color-text-secondary)] text-sm uppercase tracking-widest">
                      Verifying Link...
                    </p>
                  </div>
                ) : !isTokenValid ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                    <div className="text-4xl mb-2">⚠️</div>
                    <h2 className="text-xl md:text-2xl font-[var(--font-heading)] font-bold text-red-400 tracking-wide uppercase">
                      Link Invalid
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] font-[var(--font-body)]">
                      The password reset link is invalid or has expired. Please
                      request a new one.
                    </p>
                    <button
                      onClick={() => navigate("/signin")}
                      className="btn-primary px-8 py-3 text-sm mt-4 w-full"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2 mb-2 text-center">
                      <h2 className="text-xl md:text-2xl font-[var(--font-heading)] font-bold text-[var(--color-primary)] tracking-wide uppercase">
                        Create New Password
                      </h2>
                      <p className="text-sm text-[var(--color-text-secondary)] font-[var(--font-body)]">
                        Enter a strong new password for your account.
                      </p>
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="newPassword"
                        className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setFormErrors((prev) => ({
                            ...prev,
                            newPassword: "",
                          }));
                        }}
                        className={`w-full bg-white/5 border ${
                          formErrors.newPassword
                            ? "border-red-500/50"
                            : "border-white/10"
                        } rounded-xl py-3.5 px-4 pr-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
                        placeholder="Enter new password"
                      />
                      {formErrors.newPassword && (
                        <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1">
                          {formErrors.newPassword}
                        </p>
                      )}
                      <PasswordRequirements password={newPassword} />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="confirmPassword"
                        className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setFormErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                        }}
                        className={`w-full bg-white/5 border ${
                          formErrors.confirmPassword
                            ? "border-red-500/50"
                            : "border-white/10"
                        } rounded-xl py-3.5 px-4 pr-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
                        placeholder="Confirm new password"
                      />
                      {formErrors.confirmPassword && (
                        <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1">
                          {formErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary px-6 py-3 text-sm mt-2"
                    >
                      {submitting ? (
                        <Cliploader size={20} color="currentColor" />
                      ) : (
                        "Save Password"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ResetPassword;
