import axios from "axios";
import React, { useState } from "react";
import Cliploader from "@/components/ui/Cliploader";
import { registerSendOTP } from "@/services/auth.service";
import { useFeedback } from "@/context/FeedbackContext";

// Props
interface SignUpStep1Props {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onSuccess: () => void;
}

// Component
const SignUpStep1: React.FC<SignUpStep1Props> = ({
  email,
  setEmail,
  onSuccess,
}) => {
  const { showError, showSuccess } = useFeedback();
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateEmail(email)) return;

    setLoading(true);
    try {
      await registerSendOTP(email.trim().toLowerCase());
      showSuccess("OTP sent! Check your inbox.");
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Backend operation failed.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full flex flex-col gap-5"
    >
      {/* Step indicator */}
      <div className="flex flex-col gap-1">
        <p className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase">
          Step 1 of 3
        </p>
        <h2 className="font-[var(--font-heading)] text-[var(--color-primary)] text-2xl md:text-3xl tracking-wide uppercase leading-tight">
          Enter Your Email
        </h2>
        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-[var(--font-body)] mt-1">
          We'll send a 6-digit verification code to this address.
        </p>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="signup-email"
          className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="signup-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            className={`w-full bg-white/5 border ${
              emailError ? "border-red-500/50" : "border-white/10"
            } rounded-xl py-3.5 px-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">
            📧
          </div>
        </div>
        {emailError && (
          <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1">
            {emailError}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-6 py-3 text-sm"
      >
        {loading ? (
          <Cliploader size={20} color="currentColor" />
        ) : (
          "Send Verification Code"
        )}
      </button>
    </form>
  );
};

export default SignUpStep1;
