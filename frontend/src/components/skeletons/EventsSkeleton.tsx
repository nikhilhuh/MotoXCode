import React from "react";
import { HeroSkeleton, GalleryPreviewSkeleton } from "./SkeletonHelpers";

export const EventsSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-48"
        titleWidth="w-128"
        subtitleWidth="w-96"
        paragraphWidth="w-160"
      />

      {/* Events List */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col gap-6 relative z-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center justify-between border border-[var(--color-border)]/40 p-6 rounded-2xl bg-[var(--color-bg)]/40 backdrop-blur-2xl shadow-lg gap-6"
            >
              {/* Date Card & details */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-16 h-16 rounded-xl border border-[var(--color-border)]/30 shimmer-box opacity-35 flex-shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="w-48 max-w-[60vw] h-6 rounded-md shimmer-box opacity-45" />
                  <div className="w-36 max-w-[45vw] h-4 rounded shimmer-box opacity-25" />
                </div>
              </div>
              {/* Mid meta info */}
              <div className="flex gap-4 w-full md:w-auto">
                <div className="w-20 h-6 rounded-full shimmer-box opacity-30" />
                <div className="w-32 h-6 rounded-full shimmer-box opacity-20" />
              </div>
              {/* Action Button */}
              <div className="w-32 h-10 rounded-full shimmer-box opacity-30 w-full md:w-32" />
            </div>
          ))}
        </div>
      </section>

      <GalleryPreviewSkeleton className="bg-gradient-to-b from-[var(--color-surface)] to-black" />
    </div>
  );
};
