import axios from 'axios';
import React, { useState } from "react";
import Cliploader from "@/components/ui/Cliploader";
import { forgotPassword } from "@/services/auth.service";
import { useFeedback } from "@/context/FeedbackContext";
interface ForgotPasswordFormProps {
  onCancel: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onCancel }) => {
  const { showSuccess, showError } = useFeedback();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await forgotPassword(email);
      showSuccess(response.data.message);
      onCancel(); // Go back to login
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
      className="flex-1 flex flex-col justify-center gap-5 lg:text-lg w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-xl md:text-2xl font-[var(--font-heading)] font-bold text-[var(--color-primary)] tracking-wide uppercase">
          Reset Password
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] font-[var(--font-body)]">
          Enter your registered email address and we'll send you a secure link to reset your password.
        </p>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
            placeholder="your@email.com"
            autoComplete="email"
            className={`w-full bg-white/5 border ${
              error ? "border-red-500/50" : "border-white/10"
            } rounded-xl py-3.5 px-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">
            ✉️
          </div>
        </div>
        {error && (
          <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="btn-secondary px-6 py-3 text-sm flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-3 text-sm flex-1"
        >
          {loading ? <Cliploader size={20} color="currentColor" /> : "Send Link"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
