import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInUser } from "@/types/signInUser";
import Cliploader from "@/components/ui/Cliploader";
import { loginWithPassword } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
interface UsernameFormProps {
  onForgotPassword?: () => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { setUserDetails } = useUser();
  const { showError, showSuccess } = useFeedback();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [credentials, setCredentials] = useState<SignInUser>({
    username: "",
    password: "",
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormError((prev) => ({ ...prev, [name]: "" }));
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPassword = async () => {
    if (loading) return;
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!credentials.username.trim())
      return setFormError((prev) => ({ ...prev, username: "Please enter your username" }));
    if (!credentials.password.trim())
      return setFormError((prev) => ({ ...prev, password: "Please enter your password" }));

    setLoading(true);
    try {
      const response = await loginWithPassword(credentials.username, credentials.password);
      const { user, token } = response.data;

      // Persist to context + localStorage with token attached
      const userWithToken = { ...user, token };
      setUserDetails(userWithToken);
      localStorage.setItem("userDetails", JSON.stringify(userWithToken));

      showSuccess(`You are signed in as ${user.username}`);
      navigate("/");
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
      className="flex-1 flex flex-col justify-center gap-5 lg:text-lg w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[30vw]"
    >
      {/* Username Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block">
          Username or Email
        </label>
        <div className="relative">
          <input
            type="text"
            name="username"
            id="username"
            value={credentials.username}
            onChange={handleCredentialsChange}
            placeholder="your username or email"
            autoComplete="username"
            className={`w-full bg-white/5 border ${
              formError.username ? "border-red-500/50" : "border-white/10"
            } rounded-xl py-3.5 px-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">
            👤
          </div>
        </div>
        {formError.username && (
          <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1">
            {formError.username}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleCredentialsChange}
            placeholder="your password"
            autoComplete="current-password"
            className={`w-full bg-white/5 border ${
              formError.password ? "border-red-500/50" : "border-white/10"
            } rounded-xl py-3.5 px-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">
            🔒
          </div>
          <div
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            onClick={toggleShowPassword}
          >
            {showPassword ? "🙈" : "👁️"}
          </div>
        </div>

        {formError.password && (
          <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-1">
            {formError.password}
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-end mt-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleForgotPassword}
            className="font-[var(--font-sub)] text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[var(--color-accent)] hover:text-[var(--color-primary)] hover:underline underline-offset-4 decoration-2 transition-all hover:cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-6 py-3 text-sm"
      >
        {loading ? (
          <Cliploader size={20} color="currentColor" />
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
};

export default UsernameForm;