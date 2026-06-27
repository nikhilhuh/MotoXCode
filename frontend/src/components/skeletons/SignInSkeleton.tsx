export const SignInSkeleton = () => (
  <section className="flex flex-col h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
    <main className="grid grid-cols-1 lg:grid-cols-2 h-[100dvh]">
      {/* Left Side: Asset Container */}
      <div className="hidden lg:block relative bg-[var(--color-surface)] shimmer-box opacity-20" />

      {/* Right Side: Interactive Form */}
      <div className="h-full flex flex-col px-4 py-8 md:py-12 relative overflow-y-auto">
        {/* Header Branding */}
        <div className="text-center mb-8 relative z-10 flex justify-center">
          <div className="flex gap-3 items-center justify-center">
            <div className="size-8 md:size-10 rounded-full shimmer-box opacity-40" />
            <div className="w-40 h-8 rounded-md shimmer-box opacity-30 mt-1" />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex flex-col flex-1 items-center justify-center relative z-10">
          <div className="flex flex-col justify-center gap-6 lg:text-lg w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[30vw]">
            <div className="space-y-6">
              {/* Form fields */}
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-sm shimmer-box opacity-20" />
                <div className="h-12 w-full rounded-sm shimmer-box opacity-10" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-sm shimmer-box opacity-20" />
                <div className="h-12 w-full rounded-sm shimmer-box opacity-10" />
              </div>
              <div className="h-12 w-full rounded-sm shimmer-box opacity-30 mt-8" />
              
              {/* OR divider */}
              <div className="h-[1px] w-full bg-[var(--color-border)]/20 mt-6 mb-6 relative flex justify-center items-center">
                <div className="absolute hidden lg:block bg-[var(--color-bg)] px-4">
                  <div className="w-6 h-4 shimmer-box opacity-20 rounded" />
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="h-14 w-full rounded-full shimmer-box opacity-20" />
              <div className="h-14 w-full rounded-full shimmer-box opacity-20" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pb-6 relative z-10 flex justify-center">
             <div className="w-48 h-4 rounded shimmer-box opacity-20" />
          </div>
        </div>
      </div>
    </main>
  </section>
);
