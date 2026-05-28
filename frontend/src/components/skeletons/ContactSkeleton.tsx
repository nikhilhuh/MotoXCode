import React from "react";
import { HeroSkeleton } from "./SkeletonHelpers";

export const ContactSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg)]">
      <HeroSkeleton
        badgeTextWidth="w-48"
        titleWidth="w-128"
        subtitleWidth="w-96"
        paragraphWidth="w-160"
      />

      {/* Contact Content */}
      <section className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black border-t border-[var(--color-border)]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
            
            {/* Info Card (2 Column) */}
            <div className="lg:col-span-2 bg-[var(--color-bg)]/40 border border-[var(--color-border)]/50 backdrop-blur-2xl p-6 lg:p-10 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="mb-8 flex flex-col gap-2">
                  <div className="w-36 h-8 rounded-lg shimmer-box opacity-40 mx-auto lg:mx-0" />
                  <div className="w-56 h-4 rounded shimmer-box opacity-20 mx-auto lg:mx-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="size-12 rounded-xl border border-[var(--color-border)]/30 shimmer-box opacity-30 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <div className="w-16 h-3 rounded shimmer-box opacity-25" />
                        <div className="w-36 h-4 rounded shimmer-box opacity-35" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Card (3 Column) */}
            <div className="lg:col-span-3 bg-[var(--color-bg)]/40 border border-[var(--color-border)]/50 backdrop-blur-2xl p-6 lg:p-10 rounded-2xl shadow-xl flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="mb-2 flex flex-col gap-2">
                  <div className="w-44 h-8 rounded-lg shimmer-box opacity-40 mx-auto lg:mx-0" />
                  <div className="w-80 h-4 rounded shimmer-box opacity-20 mx-auto lg:mx-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="w-16 h-4 rounded shimmer-box mb-2 opacity-30" />
                    <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
                  </div>
                  <div>
                    <div className="w-16 h-4 rounded shimmer-box mb-2 opacity-30" />
                    <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
                  </div>
                </div>

                <div>
                  <div className="w-20 h-4 rounded shimmer-box mb-2 opacity-30" />
                  <div className="w-full h-12 rounded-lg shimmer-box opacity-20" />
                </div>

                <div>
                  <div className="w-20 h-4 rounded shimmer-box mb-2 opacity-30" />
                  <div className="w-full h-32 rounded-lg shimmer-box opacity-20" />
                </div>

                <div className="w-full h-14 rounded-lg shimmer-box opacity-35" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
