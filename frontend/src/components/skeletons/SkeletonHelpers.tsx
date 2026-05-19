import React from "react";

interface HeroSkeletonProps {
  badgeTextWidth?: string;
  titleWidth?: string;
  subtitleWidth?: string;
  paragraphWidth?: string;
}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = ({
  badgeTextWidth = "w-48",
  titleWidth = "w-128",
  subtitleWidth = "w-96",
  paragraphWidth = "w-160",
}) => {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Dark premium gradient background overlay matching actual Hero */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 40%, rgba(2,6,23,0.4) 60%, rgba(2,6,23,1) 100%)",
        }}
      />
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center px-4 py-10 md:px-6 md:py-12 lg:px-12 lg:py-20">
          {/* Badge */}
          <div className="hero-anim mb-6">
            <div
              className={`h-8 sm:h-9 ${badgeTextWidth} rounded-full shimmer-box opacity-30 px-6 py-2.5`}
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <div
              className={`h-12 sm:h-16 lg:h-20 max-w-[85vw] ${titleWidth} rounded-xl shimmer-box opacity-25`}
            />
            <div
              className={`h-9 sm:h-12 lg:h-14 max-w-[70vw] ${subtitleWidth} rounded-xl shimmer-box opacity-20`}
            />
          </div>

          {/* Paragraph */}
          <div className="flex flex-col items-center justify-center gap-2 mb-10 w-full">
            <div
              className={`h-4 max-w-[80vw] ${paragraphWidth} rounded-md shimmer-box opacity-15`}
            />
            <div className="h-4 max-w-[60vw] w-96 rounded-md shimmer-box opacity-15" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[16rem] sm:max-w-none mx-auto">
            <div className="w-full sm:w-48 h-14 rounded-full shimmer-box opacity-25" />
            <div className="w-full sm:w-48 h-14 rounded-full shimmer-box opacity-15" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20">
        <div className="w-12 h-3 rounded-full shimmer-box" />
        <div className="w-px h-6 bg-[var(--color-border)]" />
      </div>
    </section>
  );
};

export const GalleryPreviewSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <section
      className={`py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-section)] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <div className="w-24 h-4 rounded shimmer-box mb-1 opacity-25" />
            <div className="w-64 h-10 rounded-lg shimmer-box opacity-35" />
          </div>
          <div className="w-32 h-10 rounded-full shimmer-box opacity-20" />
        </div>
        {/* Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-[var(--color-border)]/30 shimmer-box opacity-15"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
