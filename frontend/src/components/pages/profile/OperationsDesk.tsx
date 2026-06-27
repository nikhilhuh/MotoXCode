import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { profileService } from "../../../services/profile.service";
import type { Profile as ProfileType } from "../../../types/profile";
import { useFeedback } from "../../../context/FeedbackContext";
import Cliploader from "@/components/ui/Cliploader";
import axios from "axios";

interface OperationsDeskProps {
  profile: ProfileType | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
}

export default function OperationsDesk({
  profile,
  setProfile,
}: OperationsDeskProps) {
  const { showSuccess, showError } = useFeedback();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"crew" | "admin" | "rider">(
    "rider",
  );

  useEffect(() => {
    if (profile?.role) {
      setSelectedRole(profile.role);
    }
  }, [profile?.role]);

  const handleIssueStrike = async () => {
    if (!profile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await profileService.issueStrike(profile.username);
      setProfile((prev) => (prev ? { ...prev, strikes: res.strikes } : prev));
      showSuccess(`Strike issued. Current count: ${res.strikes}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to issue strike.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReduceStrike = async (action: "decrease" | "reset") => {
    if (!profile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await profileService.reduceStrike(profile.username, action);
      setProfile((prev) => (prev ? { ...prev, strikes: res.strikes } : prev));
      showSuccess(
        action === "reset"
          ? "Strike record cleared."
          : `Strike reduced. Current count: ${res.strikes}`,
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to reduce strike.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignRole = async () => {
    if (!profile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await profileService.assignRole(
        profile.username,
        selectedRole,
      );
      setProfile((prev) =>
        prev ? { ...prev, role: res.role, strikes: res.strikes } : prev,
      );
      showSuccess(`Role updated to '${res.role}' successfully.`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to update role.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = profile?.role === "admin";
  const canIssueStrike = profile?.role !== "admin" && profile?.role !== "crew";

  const roleMeta = {
    rider: {
      label: "Rider",
      desc: "Standard community member",
      dot: "bg-[var(--color-accent)]",
      active:
        "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/10 text-[var(--color-primary)]",
    },
    crew: {
      label: "Crew",
      desc: "Elevated club member",
      dot: "bg-blue-400",
      active: "border-blue-500/60 bg-blue-500/10 text-blue-300",
    },
    admin: {
      label: "Admin",
      desc: "Full system access",
      dot: "bg-[var(--color-highlight)]",
      active:
        "border-[var(--color-highlight)]/60 bg-[var(--color-highlight)]/10 text-[var(--color-highlight)]",
    },
  } as const;

  const roleBadgeClass =
    profile?.role === "admin"
      ? "text-[var(--color-highlight)] border-[var(--color-highlight)]/40 bg-[var(--color-highlight)]/10"
      : profile?.role === "crew"
        ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
        : "text-[var(--color-accent)] border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
      className="pointer-events-auto mt-8"
    >
      {/*
        Mobile:  flat sections, no card, gap between sections
        md+:     matches ProfileStats/ProfileGarage card exactly —
                 gradient bg, subtle border, inset shadow, rounded-[2rem], p-10
      */}
      <div className="flex flex-col gap-6 md:gap-10 md:bg-gradient-to-b md:from-white/[0.04] md:to-transparent md:border md:border-white/[0.05] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:rounded-[2rem] md:p-10 md:backdrop-blur-sm transition-all duration-500 md:hover:border-white/[0.08]">
        {/* PANEL HEADER */}
        <div>
          {/* Mobile: large accent heading */}
          <div className="md:hidden mt-4 pb-4 border-b border-white/10">
            <h2 className="font-heading font-black text-2xl tracking-widest uppercase text-[var(--color-accent)] leading-none mb-2">
              Operations Desk
            </h2>
            <p className="text-xs font-body text-white/30 tracking-wide">
              Restricted · Admin access only
            </p>
          </div>

          {/* md+: bigger, spaced-out heading matching card style */}
          <div className="hidden md:block">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-heading font-black text-2xl lg:text-3xl tracking-widest uppercase text-[var(--color-accent)] leading-none">
                Operations Desk
              </h2>
              <span className="shrink-0 mt-1 px-3 py-1 rounded-lg border border-[var(--color-highlight)]/30 bg-[var(--color-highlight)]/8 text-[10px] font-mono uppercase tracking-widest text-[var(--color-highlight)]/60">
                secured
              </span>
            </div>
            <p className="text-sm font-body text-white/30 tracking-wide">
              Administrative access · Changes are permanent and auditable
            </p>
          </div>
        </div>

        {/* ROLE SECTION */}
        <div>
          {/* Section label */}
          <span className="block font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-2 md:font-accent md:text-xs lg:text-sm md:tracking-[0.25em] md:text-white/40 md:mb-3">
            Role
          </span>

          {/* Current role badge */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm lg:text-base font-body font-bold uppercase tracking-wider border ${roleBadgeClass}`}
            >
              {profile?.role ?? "rider"}
            </span>
            {isLocked && (
              <span className="text-xs lg:text-sm font-body text-white/30 italic">
                · immutable via policy
              </span>
            )}
          </div>

          {/* Admin lock note */}
          {isLocked && (
            <p className="text-sm font-body text-white/30 italic">
              Admin roles can only be changed via direct database access.
            </p>
          )}

          {/* Role picker + Apply */}
          {!isLocked && (
            <>
              {/* flex-col on mobile, grid-cols-3 on md+ */}
              <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-3 mb-4">
                {(["rider", "crew", "admin"] as const).map((value) => {
                  const isSelected = selectedRole === value;
                  const { label, desc, dot, active } = roleMeta[value];
                  return (
                    <button
                      key={value}
                      id={`admin-role-card-${value}`}
                      onClick={() => setSelectedRole(value)}
                      disabled={isSubmitting}
                      className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200
                        ${isSelected ? active : "border-[var(--color-border)] bg-[var(--color-bg)]/60 text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40"}
                        ${isSubmitting ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      {/* Selection dot absolutely positioned on top right */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-2 h-2 rounded-full transition-all ${isSelected ? dot : "bg-[var(--color-border)]"}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm lg:text-base font-[var(--font-sub)] font-bold leading-none ${isSelected ? "" : "text-[var(--color-text-secondary)]"}`}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] sm:text-xs lg:text-sm font-body text-[var(--color-text-secondary)] opacity-70 mt-0.5 lg:mt-1 leading-snug">
                          {desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                id="admin-assign-role-btn"
                onClick={handleAssignRole}
                disabled={isSubmitting || selectedRole === profile?.role}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-highlight)] text-white text-sm lg:text-base font-body font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Cliploader size={12} color="white" />
                    Applying…
                  </>
                ) : (
                  "Apply Role"
                )}
              </button>
            </>
          )}
        </div>

        {/* DISCIPLINARY ACTIONS SECTION */}
        <div>
          {/* Section label */}
          <span className="block font-heading font-black text-xl tracking-widest uppercase text-[var(--color-accent)] mb-2 md:font-accent md:text-xs lg:text-sm md:tracking-[0.25em] md:text-white/40 md:mb-3">
            Disciplinary Actions
          </span>

          {!canIssueStrike ? (
            <p className="font-body text-white/40 italic text-base">
              Strike controls are disabled for this role.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="admin-issue-strike-btn"
                  onClick={handleIssueStrike}
                  disabled={isSubmitting || (profile?.strikes ?? 0) >= 3}
                  className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 rounded-xl border border-amber-500/40 bg-amber-500/8 text-amber-400 text-sm lg:text-base font-body font-semibold transition-all duration-200 hover:bg-amber-500/15 hover:border-amber-500/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  )}
                  Issue Strike
                </button>

                <button
                  id="admin-reduce-strike-btn"
                  onClick={() => handleReduceStrike("decrease")}
                  disabled={isSubmitting || (profile?.strikes ?? 0) === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-sm lg:text-base font-body font-semibold transition-all duration-200 hover:text-[var(--color-primary)] hover:border-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  )}
                  Reduce Strike
                </button>

                <button
                  id="admin-clear-record-btn"
                  onClick={() => handleReduceStrike("reset")}
                  disabled={isSubmitting || (profile?.strikes ?? 0) === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 rounded-xl border border-red-500/30 bg-red-500/8 text-red-400 text-sm lg:text-base font-body font-semibold transition-all duration-200 hover:bg-red-500/15 hover:border-red-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  )}
                  Clear Record
                </button>
              </div>

              {(profile?.strikes ?? 0) >= 3 && (
                <p className="text-[11px] font-body text-red-400/70">
                  Maximum strike count reached (3/3). Clear the record to issue
                  new strikes.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
