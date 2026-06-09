export const ProfileSkeleton = () => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] relative z-10 bg-[var(--color-bg)]">
      {/* Cover Skeleton */}
      <div className="relative w-full h-64 sm:h-80 md:h-[450px] bg-[#111] animate-pulse border-b border-white/5" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-20 -mt-24 sm:-mt-32 pb-24">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-12">
          {/* Avatar Area */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[6px] border-[var(--color-bg)] bg-[#111] animate-pulse shrink-0 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />

          {/* Title Area */}
          <div className="flex-1 text-center md:text-left md:pb-4 lg:pb-6 pt-4 md:pt-0 w-full flex flex-col items-center md:items-start gap-4">
            <div className="h-12 w-64 md:w-96 bg-white/5 animate-pulse rounded-xl" />
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 mt-2">
              <div className="h-8 w-24 bg-[var(--color-accent)]/10 animate-pulse rounded-full border border-[var(--color-accent)]/20" />
              <div className="h-8 w-32 bg-white/5 animate-pulse rounded-full border border-white/10" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 flex flex-col gap-8 md:gap-12">
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-[2rem] h-64 animate-pulse" />
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-[2rem] h-64 animate-pulse" />
          </div>

          {/* Right Column Skeleton */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10 h-[400px] animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
};
