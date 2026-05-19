import React from "react";
import { HeroSkeleton, GalleryPreviewSkeleton } from "./SkeletonHelpers";

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-56"
        titleWidth="w-128"
        subtitleWidth="w-96"
        paragraphWidth="w-160"
      />

      {/* Stats Section */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-section)] border-b border-[var(--color-border)]/50">
        <div className="absolute inset-0 bg-[var(--color-section)]/10 backdrop-blur-sm z-0"></div>
        <div className="px-6 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative flex flex-col overflow-hidden rounded-[2rem] bg-[var(--color-surface)]/20 backdrop-blur-xl border border-[var(--color-border)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <div className="w-full overflow-hidden relative border-b border-[var(--color-border)]/50 aspect-square">
                  <div className="w-full h-full shimmer-box opacity-15" />
                </div>
                <div className="flex flex-col items-center sm:items-start p-6 lg:p-8 relative z-20">
                  <div className="w-24 h-10 rounded-md shimmer-box mb-2 opacity-35" />
                  <div className="w-32 h-4 rounded shimmer-box opacity-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 lg:py-22 bg-gradient-to-b from-[var(--color-section)] via-[var(--color-bg)] to-[var(--color-surface)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="mb-12 lg:mb-22 text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="w-64 h-12 rounded-lg shimmer-box mb-4 opacity-40" />
            <div className="w-96 max-w-full h-5 rounded shimmer-box opacity-20" />
          </div>

          <div className="flex flex-col gap-10 lg:gap-20">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full ${
                  idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <div className="flex-1 w-full max-w-2xl flex flex-col items-start relative">
                  <div className="w-32 h-8 rounded-full shimmer-box mb-8 opacity-25" />
                  <div className="w-full relative mb-6">
                    <div className="absolute -top-10 lg:-top-20 -left-2 lg:-left-4 w-24 h-24 shimmer-box opacity-10" />
                    <div className="w-96 max-w-full h-12 rounded-lg shimmer-box opacity-35" />
                  </div>
                  <div className="w-full pl-4 border-l-2 border-[var(--color-border)]/50">
                    <div className="w-full h-4 rounded shimmer-box mb-2.5 opacity-20" />
                    <div className="w-5/6 h-4 rounded shimmer-box mb-2.5 opacity-20" />
                    <div className="w-4/6 h-4 rounded shimmer-box opacity-20" />
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className="w-full lg:flex-1">
                  <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden aspect-[21/9] sm:aspect-[16/9] lg:aspect-[16/10] bg-[var(--color-surface)]/20 border border-[var(--color-border)]/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <div className="absolute inset-0 w-full h-full shimmer-box opacity-15" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Rides Section */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 text-center flex flex-col items-center gap-4">
          <div className="w-56 h-12 rounded-lg shimmer-box opacity-40" />
          <div className="w-80 h-5 rounded shimmer-box opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
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

        <div className="flex justify-center pt-4">
          <div className="w-48 h-12 rounded-md shimmer-box opacity-25" />
        </div>
      </section>

      {/* Member Spotlight Section */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 text-center flex flex-col items-center gap-4">
          <div className="w-64 h-12 rounded-lg shimmer-box opacity-40" />
          <div className="w-80 h-5 rounded shimmer-box opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl aspect-[4/5] p-6 flex flex-col justify-end bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30"
              >
                <div className="absolute inset-0 shimmer-box opacity-10" />
                <div className="w-full flex flex-col gap-2 relative z-10">
                  <div className="w-32 h-4 rounded shimmer-box opacity-25" />
                  <div className="w-48 h-8 rounded-lg shimmer-box opacity-45" />
                  <div className="w-24 h-6 rounded shimmer-box opacity-35" />
                  <div className="flex gap-4 mt-3">
                    <div className="w-24 h-4 rounded shimmer-box opacity-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="w-48 h-12 rounded-md shimmer-box opacity-25" />
        </div>
      </section>

      <GalleryPreviewSkeleton />

      {/* CTA Section */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-black">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center relative z-10">
          <div className="w-96 max-w-full h-16 rounded-xl shimmer-box mb-6 opacity-45" />
          <div className="w-128 max-w-full h-4 rounded shimmer-box mb-10 opacity-20" />
          <div className="w-48 h-14 rounded-full shimmer-box opacity-35" />
        </div>
      </section>
    </div>
  );
};
