import React from "react";
import { HeroSkeleton } from "./SkeletonHelpers";

export const CrewSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-48"
        titleWidth="w-128"
        subtitleWidth="w-96"
        paragraphWidth="w-160"
      />

      {/* Crew Grid */}
      <section className="py-12 lg:py-22 bg-[var(--color-bg)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-border)]/50 overflow-hidden flex flex-col bg-[var(--color-surface)]/20 relative aspect-[4/5]"
              >
                <div className="absolute inset-0 shimmer-box opacity-15" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end">
                  <div className="w-40 h-4 rounded shimmer-box mb-2 opacity-25" />
                  <div className="w-48 h-8 rounded-lg shimmer-box mb-2 opacity-45" />
                  <div className="w-24 h-6 rounded shimmer-box opacity-35" />
                  <div className="flex gap-4 mt-3">
                    <div className="w-24 h-4 rounded shimmer-box opacity-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crew CTA */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black border-t border-[var(--color-border)]/20">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center relative z-10">
          <div className="w-80 h-12 rounded-lg shimmer-box mb-4 opacity-40" />
          <div className="w-128 max-w-full h-4 rounded shimmer-box mb-8 opacity-20" />
          <div className="w-48 h-12 rounded-full shimmer-box opacity-35" />
        </div>
      </section>
    </div>
  );
};
