import React from "react";
import { HeroSkeleton, GalleryPreviewSkeleton } from "./SkeletonHelpers";

export const RidesSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-48"
        titleWidth="w-128"
        subtitleWidth="w-96"
        paragraphWidth="w-160"
      />

      {/* Filter and Rides Grid */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col gap-10 relative z-10">
          {/* Filters Bar Placeholder */}
          <div className="flex flex-wrap gap-3 pb-4 border-b border-[var(--color-border)]/20">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-10 rounded-full shimmer-box opacity-30" />
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl aspect-[4/5] p-6 flex flex-col justify-between bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30"
              >
                <div className="absolute inset-0 shimmer-box opacity-10" />
                <div className="flex justify-between w-full relative z-10">
                  <div className="w-20 h-6 rounded-full shimmer-box opacity-30" />
                  <div className="w-20 h-6 rounded-full shimmer-box opacity-25" />
                </div>
                <div className="w-full flex flex-col mt-auto gap-2 relative z-10">
                  <div className="w-32 h-4 rounded shimmer-box opacity-25" />
                  <div className="w-48 h-8 rounded-lg shimmer-box opacity-45" />
                  <div className="w-24 h-6 rounded shimmer-box opacity-35" />
                  <div className="w-full border-t border-[var(--color-border)]/35 pt-3 mt-2 flex gap-4">
                    <div className="w-20 h-4 rounded shimmer-box opacity-20" />
                    <div className="w-20 h-4 rounded shimmer-box opacity-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GalleryPreviewSkeleton className="bg-gradient-to-b from-[var(--color-surface)] to-black" />
    </div>
  );
};
