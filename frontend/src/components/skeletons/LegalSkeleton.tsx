import React from "react";

export const LegalSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen pt-24 pb-16 px-4 md:px-8 bg-[var(--color-bg)] animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="h-16 bg-[var(--color-surface)] rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-[var(--color-surface)] rounded w-1/4"></div>
        </div>

        <div className="bg-[var(--color-surface)]/40 border border-[var(--color-border)] rounded-2xl p-6 md:p-8 space-y-6">
          <section className="space-y-4">
            <div className="h-8 bg-[var(--color-surface)] rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[var(--color-surface)] rounded w-full"></div>
              <div className="h-4 bg-[var(--color-surface)] rounded w-full"></div>
              <div className="h-4 bg-[var(--color-surface)] rounded w-5/6"></div>
            </div>
            <div className="space-y-2 mt-4 pl-6">
               <div className="h-4 bg-[var(--color-surface)] rounded w-3/4"></div>
               <div className="h-4 bg-[var(--color-surface)] rounded w-5/6"></div>
               <div className="h-4 bg-[var(--color-surface)] rounded w-4/5"></div>
            </div>
          </section>

          <hr className="border-[var(--color-border)]" />

          <section className="space-y-4">
            <div className="h-8 bg-[var(--color-surface)] rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[var(--color-surface)] rounded w-full"></div>
              <div className="h-4 bg-[var(--color-surface)] rounded w-4/5"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
