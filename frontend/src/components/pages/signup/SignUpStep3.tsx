import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cliploader from "@/components/ui/Cliploader";
import PasswordRequirements from "@/components/ui/PasswordRequirements";
import { checkUsernameAvailability, registerComplete } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
// ─── Types ────────────────────────────────────────────────────────────────────

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface SignUpStep3Props {
  email: string;
  verifiedToken: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SignUpStep3: React.FC<SignUpStep3Props> = ({ email, verifiedToken }) => {
  const navigate = useNavigate();
  const { setUserDetails } = useUser();
  const { showError, showSuccess } = useFeedback();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Username validation regex (matches backend Zod schema) ────────────────
  const USERNAME_REGEX = /^[a-z0-9_]+$/;

  const checkUsername = useCallback(async (value: string) => {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      setUsernameStatus("idle");
      return;
    }

    if (trimmed.length < 3 || trimmed.length > 30 || !USERNAME_REGEX.test(trimmed)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    try {
      const response = await checkUsernameAvailability(trimmed);
      setUsernameStatus(response.data.available ? "available" : "taken");
    } catch {
      // Silently reset on network error — don't block the user
      setUsernameStatus("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounce username check at 400ms ──────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!username.trim()) {
      setUsernameStatus("idle");
      return;
    }

    debounceRef.current = setTimeout(() => {
      checkUsername(username);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username, checkUsername]);

  // ── Username status indicator ─────────────────────────────────────────────
  const UsernameIndicator: React.FC = () => {
    if (usernameStatus === "idle") return null;

    if (usernameStatus === "checking") {
      return (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <Cliploader size={14} color="var(--color-accent)" />
        </div>
      );
    }

    if (usernameStatus === "available") {
      return (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-400 text-lg font-bold">
          ✓
        </div>
      );
    }

    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      return (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-400 text-lg font-bold">
          ✕
        </div>
      );
    }

    return null;
  };

  const getUsernameHelperText = (): { text: string; color: string } | null => {
    if (usernameStatus === "invalid") {
      return {
        text: "3–30 chars, lowercase letters, numbers, and underscores only.",
        color: "text-red-400",
      };
    }
    if (usernameStatus === "taken") {
      return { text: "That username is already taken.", color: "text-red-400" };
    }
    if (usernameStatus === "available") {
      return { text: "Username is available!", color: "text-green-400" };
    }
    return null;
  };

  // ── Form submission ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const errors: Record<string, string> = {};

    if (!username.trim()) errors.username = "Username is required.";
    else if (usernameStatus === "invalid")
      errors.username = "Username format is invalid.";
    else if (usernameStatus === "taken")
      errors.username = "That username is already taken.";
    else if (usernameStatus === "checking")
      errors.username = "Please wait while we check username availability.";

    if (!password) errors.password = "Password is required.";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
      errors.password =
        "Password must contain uppercase, lowercase, a number, and a special character.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      const response = await registerComplete({
        email,
        verifiedToken,
        username: username.trim().toLowerCase(),
        password,
      });

      const { user, token } = response.data;
      const userWithToken = { ...user, token };

      setUserDetails(userWithToken);
      localStorage.setItem("userDetails", JSON.stringify(userWithToken));

      showSuccess(`Welcome to MotoXCode ${user.username}`);
      navigate("/");
    } catch (err: unknown) {
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

  const helperText = getUsernameHelperText();
  const isSubmitDisabled =
    loading ||
    !username.trim() ||
    !password ||
    usernameStatus === "checking" ||
    usernameStatus === "taken" ||
    usernameStatus === "invalid";

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
      {/* Step indicator */}
      <div className="flex flex-col gap-1">
        <p className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase">
          Step 3 of 3
        </p>
        <h2 className="font-[var(--font-heading)] text-[var(--color-primary)] text-2xl md:text-3xl tracking-wide uppercase leading-tight">
          Create Your Identity
        </h2>
        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-[var(--font-body)] mt-1">
          Registering as:{" "}
          <span className="text-[var(--color-primary)] font-semibold">{email}</span>
        </p>
      </div>

      {/* Username Field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="signup-username"
          className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
        >
          Username
        </label>
        <div className="relative">
          <input
            id="signup-username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setFormErrors((prev) => ({ ...prev, username: "" }));
            }}
            placeholder="your_username"
            autoComplete="username"
            autoFocus
            className={`w-full bg-white/5 border ${
              formErrors.username || usernameStatus === "taken" || usernameStatus === "invalid"
                ? "border-red-500/50"
                : usernameStatus === "available"
                ? "border-green-500/50"
                : "border-white/10"
            } rounded-xl py-3.5 px-10 pr-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">
            👤
          </div>
          <UsernameIndicator />
        </div>

        {/* Username helper / error text */}
        {(formErrors.username || helperText) && (
          <p
            className={`text-xs md:text-sm font-[var(--font-body)] mt-0.5 ${
              formErrors.username ? "text-red-400" : helperText?.color
            }`}
          >
            {formErrors.username || helperText?.text}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="signup-password"
          className="font-[var(--font-sub)] text-[var(--color-accent)] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase pl-1 block"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Keep a secure password"
            autoComplete="new-password"
            className={`w-full bg-white/5 border ${
              formErrors.password ? "border-red-500/50" : "border-white/10"
            } rounded-xl py-3.5 px-10 text-[var(--color-primary)] font-[var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-[var(--color-text-secondary)]/50`}
          />
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[var(--color-text-secondary)]">
            🔒
          </div>
          <div
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </div>
        </div>

        {formErrors.password && (
          <p className="text-xs md:text-sm text-red-400 font-[var(--font-body)] mt-0.5">
            {formErrors.password}
          </p>
        )}

        {/* Password strength UI */}
        <PasswordRequirements password={password} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="btn-primary px-6 py-3 text-sm"
      >
        {loading ? (
          <Cliploader size={20} color="currentColor" />
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default SignUpStep3;
