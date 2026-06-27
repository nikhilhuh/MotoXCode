import React from "react";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    { label: "One special character", valid: /[\W_]/.test(password) },
  ];

  return (
    <div className="flex flex-col gap-1.5 mt-2 mb-2 p-3 bg-black/20 border border-white/5 rounded-xl">
      <p className="text-[10px] font-[var(--font-sub)] text-[var(--color-accent)] font-bold tracking-[0.1em] uppercase mb-0.5">
        Password Requirements
      </p>
      {requirements.map((req, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center size-3.5 rounded-full transition-colors duration-300 ${
              req.valid
                ? "bg-green-500/20 text-green-400"
                : "bg-white/5 text-[var(--color-text-secondary)]"
            }`}
          >
            {req.valid ? (
              <svg viewBox="0 0 14 14" fill="none" className="w-2.5 h-2.5">
                <path
                  d="M2.5 7.5L5.5 10.5L11.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="size-1 rounded-full bg-current opacity-50" />
            )}
          </div>
          <span
            className={`text-xs font-[var(--font-body)] transition-colors duration-300 ${
              req.valid
                ? "text-green-400"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordRequirements;
