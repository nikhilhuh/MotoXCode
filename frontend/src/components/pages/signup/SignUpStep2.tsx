import React, { useRef, useState } from "react";
import { BiCheck, BiEdit } from "react-icons/bi";
import Cliploader from "@/components/ui/Cliploader";
import { registerVerifyOTP, registerSendOTP } from "@/services/auth.service";
import { useFeedback } from "@/context/FeedbackContext";
import { AxiosError } from "axios";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SignUpStep2Props {
  email: string;
  onSuccess: (verifiedToken: string) => void;
  onBack: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SignUpStep2: React.FC<SignUpStep2Props> = ({ email, onSuccess, onBack }) => {
  const { showError, showSuccess } = useFeedback();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [resent, setResent] = useState<boolean>(false);
  const [resendLabel, setResendLabel] = useState<string>("Resend Code");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "");
    if (otpError) setOtpError("");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.charAt(0);
    setOtp(newOtp);

    // Auto-advance focus
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (otpError) setOtpError("");
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]!.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (otpError) setOtpError("");
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const newOtp = Array(6).fill("");
    text.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus the last filled box or the next empty one
    const focusIdx = Math.min(text.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifying) return;

    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      setOtpError("Please enter all 6 digits of the verification code.");
      return;
    }
    if (!/^\d{6}$/.test(finalOtp)) {
      setOtpError("The verification code must contain only numbers.");
      return;
    }
    setOtpError("");

    setVerifying(true);
    try {
      const response = await registerVerifyOTP(email, finalOtp);
      const { verifiedToken } = response.data;
      showSuccess("Email verified! Set up your profile.");
      onSuccess(verifiedToken);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message ?? "OTP verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending || resent) return;

    setResending(true);
    try {
      await registerSendOTP(email);
      setResent(true);
      setResendLabel("Code Sent!");
      setOtp(Array(6).fill(""));
      setOtpError("");
      inputRefs.current[0]?.focus();
      showSuccess("A new verification code has been sent.");
      // Re-enable after 60 seconds
      setTimeout(() => {
        setResent(false);
        setResendLabel("Resend Code");
      }, 60_000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message ?? "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-5">
      {/* Step indicator */}
      <div className="flex flex-col gap-1">
        <p className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase">
          Step 2 of 3
        </p>
        <h2 className="font-[var(--font-heading)] text-[var(--color-primary)] text-2xl md:text-3xl tracking-wide uppercase leading-tight">
          Verify Your Email
        </h2>
      </div>

      {/* Email display with back edit */}
      <p className="text-xs lg:text-sm text-center font-[var(--font-body)] text-[var(--color-text-secondary)] flex flex-wrap justify-center gap-1">
        Enter the 6-digit code sent to
        <span className="flex w-full justify-center items-center gap-1 text-[var(--color-primary)] font-bold">
          {email}
          <BiEdit
            className="h-3 w-3 md:h-4 md:w-4 cursor-pointer hover:text-[var(--color-highlight)] transition-colors"
            onClick={onBack}
            title="Change email"
          />
        </span>
      </p>
      <p className="block text-xs text-center font-[var(--font-body)] text-[var(--color-text-secondary)]/70">
        Valid for 5 minutes. Check your spam folder if you don't see it.
      </p>

      {/* OTP boxes */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              id={`signup-otp-${index}`}
              name={`signup-otp-${index}`}
              autoComplete="one-time-code"
              aria-label={`OTP Digit ${index + 1}`}
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              className={`h-10 w-10 md:h-12 md:w-12 lg:w-14 lg:h-14 text-center text-xl md:text-2xl font-[var(--font-heading)] border ${
                otpError ? "border-red-500/50" : "border-white/10"
              } bg-white/5 rounded-xl focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 text-[var(--color-primary)] transition-all duration-300`}
            />
          ))}
        </div>
        {otpError && (
          <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] text-center mt-1">
            {otpError}
          </p>
        )}
      </div>

      {/* Resend */}
      <div className="flex gap-2 justify-center items-center">
        <span className="text-xs lg:text-sm font-[var(--font-body)] text-[var(--color-text-secondary)]">
          Didn't receive it?
        </span>
        <button
          type="button"
          onClick={handleResend}
          title="Resend verification code"
          className={`outline-none font-bold w-max text-xs lg:text-sm transition-colors duration-300 ${
            !resent
              ? "cursor-pointer text-[var(--color-highlight)] hover:underline underline-offset-4 decoration-2"
              : "text-[var(--color-primary)] cursor-default"
          }`}
        >
          {resending ? (
            <Cliploader size={16} color="currentColor" />
          ) : resent ? (
            <span className="flex gap-1 items-center">
              <BiCheck className="h-5 w-5 text-green-400" />
              {resendLabel}
            </span>
          ) : (
            resendLabel
          )}
        </button>
      </div>

      {/* Verify button */}
      <button
        type="submit"
        disabled={verifying}
        className="btn-primary px-6 py-3 text-sm"
      >
        {verifying ? <Cliploader size={20} color="currentColor" /> : "Verify & Continue"}
      </button>
    </form>
  );
};

export default SignUpStep2;
