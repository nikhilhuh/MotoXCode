interface MaxStrikesStatusProps {
  isOwner: boolean;
}

export default function MaxStrikesStatus({ isOwner }: MaxStrikesStatusProps) {
  return (
    <div
      className="mb-8 p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors shadow-lg bg-red-500/10 border-red-500/30 text-red-400"
    >
      <div className="text-center flex flex-col gap-2 items-center w-full">
        <h3 className="font-[var(--font-heading)] font-black text-xl mb-1 flex flex-col items-center gap-2">
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Account Suspended
        </h3>
        <p className="text-sm opacity-90 font-[var(--font-body)]">
          {isOwner 
            ? "You got three strikes and won't be able to join or sign up for another ride or event. Contact an admin for further assistance to remove the strikes and reset them."
            : "This account has three strikes and is suspended from joining or signing up for rides and events."
          }
        </p>
      </div>
    </div>
  );
}
