export const SignInSkeleton = () => (
  <main className="min-h-screen w-full flex bg-[var(--color-bg)]">
    <div className="hidden lg:flex w-1/2 relative shimmer-box" />
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
      <div className="w-full max-w-md space-y-10">
        <div className="h-12 w-48 bg-[var(--color-surface)] rounded-sm shimmer-box" />
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[var(--color-surface)] rounded-sm shimmer-box" />
            <div className="h-12 w-full bg-[var(--color-surface)] rounded-sm shimmer-box" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[var(--color-surface)] rounded-sm shimmer-box" />
            <div className="h-12 w-full bg-[var(--color-surface)] rounded-sm shimmer-box" />
          </div>
          <div className="h-14 w-full bg-[var(--color-surface)] rounded-full shimmer-box mt-8" />
        </div>
      </div>
    </div>
  </main>
);
