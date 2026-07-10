import React from "react";

export default function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {htmlFor ? (
        <label
          htmlFor={htmlFor}
          className="text-[0.7rem] font-semibold font-[var(--font-accent)] text-[var(--color-text-secondary)] uppercase tracking-[0.12em]"
        >
          {label}
          {required && (
            <span className="text-[var(--color-highlight)] ml-0.5">*</span>
          )}
        </label>
      ) : (
        <span className="text-[0.7rem] font-semibold font-[var(--font-accent)] text-[var(--color-text-secondary)] uppercase tracking-[0.12em]">
          {label}
          {required && (
            <span className="text-[var(--color-highlight)] ml-0.5">*</span>
          )}
        </span>
      )}
      {children}
      {error && (
        <p className="text-[0.68rem] text-red-400 font-[var(--font-accent)]">
          {error}
        </p>
      )}
    </div>
  );
}
