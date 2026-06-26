import axios from 'axios';
import React, { useState } from "react";
import mailImg from "/assets/images/signin/mail.svg";
import Cliploader from "@/components/ui/Cliploader";
import { requestOTP } from "@/services/auth.service";
import { useFeedback } from "@/context/FeedbackContext";
type Props = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  verifying: boolean;
  setVerifying: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SignInStep1: React.FC<Props> = ({
  email,
  setEmail,
  verifying,
  setVerifying,
  setStep,
}) => {
  const { showError, showSuccess } = useFeedback();
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

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifying) return;
    if (!validateEmail(email)) return;

    setVerifying(true);
    try {
      await requestOTP(email.trim().toLowerCase());
      showSuccess("An OTP has been sent to your email.");
      setStep(2);
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

  return (
    <form onSubmit={handleVerification} noValidate className="w-full flex flex-col">
      <img
        src={mailImg}
        alt="Mail"
        className="mx-auto h-[7svh]"
        loading="lazy"
      />
      <p className="block mb-4 text-xs md:text-sm text-center font-[var(--font-body)] text-[var(--color-text-secondary)]">
        An OTP will be sent to the mail you provide below
      </p>
      <div className="relative mb-4">
        <label htmlFor="email" className="sr-only">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          placeholder="Your registered email"
          autoComplete="email"
          className={`w-full bg-white/5 border ${
            emailError ? "border-red-500/50" : "border-white/10"
          } rounded-xl py-3.5 px-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
        />
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">📧</div>
      </div>
      {emailError && (
        <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1 mb-4">
          {emailError}
        </p>
      )}
      <button
        type="submit"
        disabled={verifying}
        className="btn-primary px-6 py-3 text-sm"
      >
        {verifying ? <Cliploader size={20} color="currentColor" /> : "Verify Email"}
      </button>
    </form>
  );
};

export default SignInStep1;