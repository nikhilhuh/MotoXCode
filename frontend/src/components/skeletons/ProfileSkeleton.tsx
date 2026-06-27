export const ProfileSkeleton = () => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] relative z-10 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black">
      {/* Cover Skeleton */}
      <div className="relative w-full h-64 sm:h-80 md:h-[450px] bg-[var(--color-surface)] shimmer-box opacity-15 border-b border-[var(--color-border)]/50" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-20 -mt-24 sm:-mt-32 pb-24">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-12">
          {/* Avatar Area */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[6px] border-[var(--color-bg)] bg-[var(--color-surface)] shimmer-box opacity-20 shrink-0 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />

          {/* Title Area */}
          <div className="flex-1 text-center md:text-left md:pb-4 lg:pb-6 pt-4 md:pt-0 w-full flex flex-col items-center md:items-start gap-4">
            <div className="h-12 w-64 md:w-96 rounded-xl shimmer-box opacity-30" />
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 mt-2">
              <div className="h-8 w-24 rounded-full shimmer-box opacity-25" />
              <div className="h-8 w-32 rounded-full shimmer-box opacity-20" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 flex flex-col gap-8 md:gap-12">
            <div className="bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30 p-8 md:p-10 rounded-[2rem] h-64 shimmer-box opacity-10" />
            <div className="bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30 p-8 md:p-10 rounded-[2rem] h-64 shimmer-box opacity-10" />
          </div>

          {/* Right Column Skeleton */}
          <div className="flex flex-col gap-6">
            <div className="bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30 rounded-[2rem] p-8 md:p-10 h-[400px] shimmer-box opacity-10" />
          </div>
        </div>
      </div>
    </div>
  );
};
