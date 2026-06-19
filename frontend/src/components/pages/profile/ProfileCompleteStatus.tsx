interface ProfileCompleteStatusProps {
  isProfileComplete: boolean | null;
  missingFields: string[];
}

export default function ProfileCompleteStatus({
  isProfileComplete,
  missingFields,
}: ProfileCompleteStatusProps) {
  return (
    <div
      className={`mb-8 p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors shadow-lg ${
        isProfileComplete
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
      }`}
    >
      <div className="text-center flex flex-col items-center gap-2 w-full">
        <h3 className="font-[var(--font-heading)] font-black text-xl mb-1 flex flex-col items-center gap-2">
          {isProfileComplete ? (
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Profile Completed
            </>
          ) : (
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Profile Incomplete
            </>
          )}
        </h3>
        {!isProfileComplete && (
          <p className="text-sm opacity-90 font-[var(--font-body)] max-w-2xl">
            <strong>Missing details:</strong> {missingFields.join(", ")}
          </p>
        )}
        {isProfileComplete && (
          <p className="text-sm opacity-90 font-[var(--font-body)]">
            Awesome! Your profile is 100% complete.
          </p>
        )}
      </div>
    </div>
  );
}
