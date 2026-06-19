import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BiCheck, BiEdit } from "react-icons/bi";
import Cliploader from "@/components/ui/Cliploader";
import { verifyOTP, requestOTP } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { AxiosError } from "axios";

type Props = {
  email: string;
  verifying: boolean;
  setVerifying: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const SignInStep2: React.FC<Props> = ({
  email,
  setVerifying,
  verifying,
  setStep,
}) => {
  const navigate = useNavigate();
  const { setUserDetails } = useUser();
  const { showError, showSuccess } = useFeedback();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resending, setResending] = useState<boolean>(false);
  const [resent, setResent] = useState<boolean>(false);
  const [resendText, setResendText] = useState<string>("Resend OTP");

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    if (otpError) setOtpError("");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.charAt(0); // only take 1 digit
    setOtp(newOtp);

    // Auto-focus next
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
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
      const response = await verifyOTP(email, finalOtp);
      const { user, token } = response.data;

      const userWithToken = { ...user, token };
      setUserDetails(userWithToken);
      localStorage.setItem("userDetails", JSON.stringify(userWithToken));

      showSuccess(`You are signed in as ${user.username}`);
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message ?? "OTP verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || resent || resending) return;

    setResending(true);
    try {
      await requestOTP(email);
      setResent(true);
      setResendText("OTP Sent!");
      setOtp(Array(6).fill(""));
      setOtpError("");
      inputRefs.current[0]?.focus();
      showSuccess("A new OTP has been sent to your email.");
      // Allow resend again after 60 seconds
      setTimeout(() => {
        setResent(false);
        setResendText("Resend OTP");
      }, 60000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showError(error.response?.data?.message ?? "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleOtpSubmit} noValidate className="w-full flex flex-col gap-5 justify-center">
      <div className="flex flex-col gap-2">
        <p className="text-xs lg:text-sm text-center font-[var(--font-body)] text-[var(--color-text-secondary)] w-full justify-center flex flex-wrap gap-1">
          Enter the 6-digit OTP sent to
          <span className="flex w-full justify-center items-center gap-1 text-[var(--color-primary)] font-bold">
            {email}
            <BiEdit
              className="h-3 w-3 md:h-4 md:w-4 cursor-pointer hover:text-[var(--color-highlight)] transition-colors"
              onClick={() => setStep(1)}
            />
          </span>
        </p>
        <p className="block text-xs text-center font-[var(--font-body)] text-[var(--color-text-secondary)]/70">
          The otp is only valid for 5 minutes
          <br />
          Check your spam/junk folder if you don't see it in your inbox
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              id={`digit-${index}`}
              name={`digit-${index}`}
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

      <div className="flex gap-2 justify-center items-center">
        <span className="text-xs lg:text-sm font-[var(--font-body)] text-[var(--color-text-secondary)]">
          Didn't receive the otp?
        </span>
        <button
          type="button"
          onClick={handleResendOTP}
          title="Resend otp"
          className={`outline-none font-bold w-max text-xs lg:text-sm transition-colors duration-300 ${
            !resent ? "cursor-pointer text-[var(--color-highlight)] hover:underline underline-offset-4 decoration-2" : "text-[var(--color-primary)]"
          }`}
        >
          {resending ? (
            <Cliploader size={16} color="currentColor" />
          ) : resent ? (
            <span className="flex gap-1 items-center">
              <BiCheck className="h-5 w-5 text-green-400" />
              {resendText}
            </span>
          ) : (
            resendText
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={verifying}
        className="btn-primary px-6 py-3 text-sm"
      >
        {verifying ? <Cliploader size={20} color="currentColor" /> : "Sign in"}
      </button>
    </form>
  );
};

export default SignInStep2;