import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Profile } from "../../../types/profile";
import { checkUsernameAvailability } from "../../../services/auth.service";
import Cliploader from "@/components/ui/Cliploader";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface ProfileEditModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

export default function ProfileEditModal({
  profile,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState<{
    username: string;
    name: string;
    headline: string;
    bio: string;
    location: string;
    years: number | "";
    bike: string;
    instagram: string;
    youtube: string;
    facebook: string;
  }>({
    username: profile.username || "",
    name: profile.name || "",
    headline: profile.headline || "",
    bio: profile.bio || "",
    location: profile.location || "",
    years: profile.years || 0,
    bike: profile.bike ? profile.bike.join(", ") : "",
    instagram: profile.instagram || "",
    youtube: profile.youtube || "",
    facebook: profile.facebook || "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkUsername = useCallback(
    async (value: string) => {
      const USERNAME_REGEX = /^[a-z0-9_]+$/;
      const trimmed = value.trim().toLowerCase();

      if (trimmed === profile.username) {
        setUsernameStatus("idle");
        return;
      }

      if (!trimmed) {
        setUsernameStatus("idle");
        return;
      }

      if (
        trimmed.length < 3 ||
        trimmed.length > 30 ||
        !USERNAME_REGEX.test(trimmed)
      ) {
        setUsernameStatus("invalid");
        return;
      }

      setUsernameStatus("checking");
      try {
        const response = await checkUsernameAvailability(trimmed);
        setUsernameStatus(response.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    },
    [profile.username],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (formData.username.trim() === profile.username) {
      setUsernameStatus("idle");
      return;
    }

    if (!formData.username.trim()) {
      setUsernameStatus("idle");
      return;
    }

    debounceRef.current = setTimeout(() => {
      checkUsername(formData.username);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.username, checkUsername, profile.username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const isSubmitDisabled =
    loading ||
    !formData.username.trim() ||
    usernameStatus === "checking" ||
    usernameStatus === "taken" ||
    usernameStatus === "invalid";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    setLoading(true);
    try {
      const updates: Partial<Profile> = {
        username: formData.username.trim().toLowerCase(),
        name: formData.name,
        headline: formData.headline,
        bio: formData.bio,
        location: formData.location,
        years: Number(formData.years),
        bike: formData.bike
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        instagram: formData.instagram,
        youtube: formData.youtube,
        facebook: formData.facebook,
      };
      await onSave(updates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === "undefined") return null;

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
  const helperText = getUsernameHelperText();

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-body focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-white/20";
  const labelClass =
    "block text-[11px] font-accent tracking-[0.15em] text-white/50 uppercase ml-1";

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!loading ? onClose : undefined}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[var(--color-bg)]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] w-full max-w-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 p-6 sm:p-8 pb-5 border-b border-white/5 flex justify-between items-start relative z-10 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
                Edit Profile
              </h2>
              <p className="text-white/50 text-sm mt-1.5 font-body">
                Update your identity, garage details, and social links.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300 disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed disabled:hover:rotate-0 shrink-0 ml-4"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
            <form
              id="profile-edit-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-10"
            >
              {/* Basic Info Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white uppercase tracking-widest">
                    Basic Identity
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label htmlFor="username" className={labelClass}>
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full bg-white/5 border ${
                          usernameStatus === "taken" ||
                          usernameStatus === "invalid"
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                            : usernameStatus === "available"
                              ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/50"
                              : "border-white/10 focus:border-[var(--color-highlight)] focus:ring-[var(--color-highlight)]/50"
                        } rounded-xl py-3 px-4 pr-12 text-white font-body focus:outline-none focus:ring-1 transition-all duration-300 placeholder:text-white/20`}
                        placeholder="your_username"
                      />
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                        {usernameStatus === "checking" && (
                          <Cliploader size={14} color="var(--color-accent)" />
                        )}
                        {usernameStatus === "available" && (
                          <span className="text-green-400 font-bold">✓</span>
                        )}
                        {(usernameStatus === "taken" ||
                          usernameStatus === "invalid") && (
                          <span className="text-red-400 font-bold">✕</span>
                        )}
                      </div>
                    </div>
                    {helperText && (
                      <p
                        className={`text-xs ml-1 font-body ${helperText.color}`}
                      >
                        {helperText.text}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={labelClass}>
                      Display Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="headline" className={labelClass}>
                      Headline
                    </label>
                    <input
                      id="headline"
                      type="text"
                      name="headline"
                      autoComplete="organization-title"
                      value={formData.headline}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Stunt Rider"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="bio" className={labelClass}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    autoComplete="off"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell the community about yourself..."
                  />
                </div>
              </div>

              {/* Rider Details Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m12 18-7 4 2-7-5-5 7-1 3-7 3 7 7 1-5 5 2 7-7-4z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white uppercase tracking-widest">
                    Rider Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="location" className={labelClass}>
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      autoComplete="street-address"
                      value={formData.location}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="years" className={labelClass}>
                      Years Riding
                    </label>
                    <input
                      id="years"
                      type="number"
                      name="years"
                      autoComplete="off"
                      value={formData.years}
                      onChange={handleChange}
                      min="0"
                      className={inputClass}
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="bike" className={labelClass}>
                    Bikes (comma separated)
                  </label>
                  <input
                    id="bike"
                    type="text"
                    name="bike"
                    autoComplete="off"
                    value={formData.bike}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Yamaha R1, Kawasaki Ninja"
                  />
                </div>
              </div>

              {/* Socials Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white uppercase tracking-widest">
                    Social Links
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="instagram" className={labelClass}>
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      name="instagram"
                      autoComplete="url"
                      value={formData.instagram}
                      onChange={handleChange}
                      className={`${inputClass} text-sm`}
                      placeholder="URL"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="youtube" className={labelClass}>
                      YouTube
                    </label>
                    <input
                      id="youtube"
                      type="text"
                      name="youtube"
                      autoComplete="url"
                      value={formData.youtube}
                      onChange={handleChange}
                      className={`${inputClass} text-sm`}
                      placeholder="URL"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="facebook" className={labelClass}>
                      Facebook
                    </label>
                    <input
                      id="facebook"
                      type="text"
                      name="facebook"
                      autoComplete="url"
                      value={formData.facebook}
                      onChange={handleChange}
                      className={`${inputClass} text-sm`}
                      placeholder="URL"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-6 sm:p-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4 bg-black/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/10 text-white/70 font-bold hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profile-edit-form"
              disabled={isSubmitDisabled}
              className="btn-primary text-black w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_var(--color-accent)] hover:shadow-[0_0_30px_var(--color-accent)] disabled:opacity-70 hover:cursor-pointer disabled:cursor-not-allowed order-1 sm:order-2 min-w-[160px]"
            >
              {loading ? (
                <>
                  <Cliploader size={20} color="black" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
