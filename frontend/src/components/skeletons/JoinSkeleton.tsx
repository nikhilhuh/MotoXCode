import React from "react";
import { HeroSkeleton, GalleryPreviewSkeleton } from "./SkeletonHelpers";

export const JoinSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-56"
        titleWidth="w-128"
        subtitleWidth="w-96"
        paragraphWidth="w-160"
      />

      {/* Form Section */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="max-w-3xl mx-auto bg-[var(--color-bg)]/40 border border-[var(--color-border)]/50 backdrop-blur-2xl p-6 lg:p-10 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] flex flex-col gap-6">
            
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 rounded shimmer-box opacity-30" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 rounded shimmer-box opacity-30" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
              </div>
            </div>

            {/* Phone & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 rounded shimmer-box opacity-30" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 rounded shimmer-box opacity-30" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
              </div>
            </div>

            {/* Bike & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 rounded shimmer-box opacity-30" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-32 h-4 rounded shimmer-box opacity-30" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
              </div>
            </div>

            {/* Ridden places */}
            <div className="flex flex-col gap-2">
              <div className="w-48 h-4 rounded shimmer-box opacity-30" />
              <div className="w-full h-20 rounded-lg shimmer-box opacity-20" />
            </div>

            {/* Why MotoXCode */}
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 rounded shimmer-box opacity-30" />
              <div className="w-full h-28 rounded-lg shimmer-box opacity-20" />
            </div>

            {/* Agreement */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded shimmer-box opacity-30 flex-shrink-0" />
              <div className="w-80 max-w-full h-4 rounded shimmer-box opacity-20" />
            </div>

            {/* Submit */}
            <div className="w-full h-14 rounded-lg shimmer-box opacity-35" />
          </div>
        </div>
      </section>

      <GalleryPreviewSkeleton className="bg-gradient-to-b from-[var(--color-surface)] to-black" />
    </div>
  );
};
