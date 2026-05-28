import React from "react";
import { HeroSkeleton } from "./SkeletonHelpers";

export const AboutSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-48"
        titleWidth="w-112"
        subtitleWidth="w-80"
        paragraphWidth="w-144"
      />

      {/* Philosophy Section */}
      <section className="py-12 lg:py-22 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6">
            <div className="w-32 h-4 rounded shimmer-box opacity-20" />
            <div className="w-full h-24 rounded-lg shimmer-box opacity-40" />
            <div className="w-48 h-6 rounded shimmer-box opacity-25" />
            <div className="w-full h-16 rounded shimmer-box opacity-15 mt-4" />
          </div>
          <div className="w-full aspect-[4/3] lg:aspect-square rounded-2xl border border-[var(--color-border)]/40 shimmer-box opacity-20" />
        </div>
      </section>

      {/* Journey Section (Timeline) */}
      <section className="py-12 lg:py-22 bg-[var(--color-bg)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col items-center relative z-10">
          <div className="mb-16 text-center">
            <div className="w-48 h-12 rounded-lg shimmer-box mb-4 opacity-40 mx-auto" />
            <div className="w-72 h-5 rounded shimmer-box opacity-20 mx-auto" />
          </div>

          {/* Timeline Placeholder */}
          <div className="relative w-full max-w-3xl border-l-2 border-[var(--color-border)]/30 pl-8 ml-4 flex flex-col gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative">
                {/* Node Dot */}
                <div className="absolute -left-[41px] top-1.5 size-4 rounded-full bg-[var(--color-border)] border-4 border-black" />
                <div className="w-16 h-6 rounded shimmer-box mb-2 opacity-35" />
                <div className="w-32 h-4 rounded shimmer-box mb-3 opacity-25" />
                <div className="w-full h-12 rounded-lg shimmer-box opacity-15" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Riding Code Section */}
      <section className="py-12 lg:py-22 bg-gradient-to-b from-[var(--color-bg)] to-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col items-center relative z-10">
          <div className="mb-16 text-center">
            <div className="w-56 h-12 rounded-lg shimmer-box mb-4 opacity-40 mx-auto" />
            <div className="w-80 h-5 rounded shimmer-box opacity-20 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-border)]/50 p-6 flex flex-col gap-3 bg-[var(--color-surface)]/20"
              >
                <div className="size-10 rounded-lg shimmer-box opacity-35" />
                <div className="w-36 h-6 rounded-md shimmer-box mb-1 opacity-45" />
                <div className="w-full h-12 rounded shimmer-box opacity-15" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
