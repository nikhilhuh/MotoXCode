import { useEffect, useState, useCallback } from "react";
import JoinHero from "../components/pages/join/JoinHero";
import JoinForm from "../components/pages/join/JoinForm";
import SignInCTA from "../components/pages/join/SignInCTA";
import GalleryPreview from "@/components/ui/GalleryPreview";
import { intakeService } from "@/services";
import { JoinSkeleton } from "../components/skeletons/JoinSkeleton";
import type { PageHero } from "@/services/cms.service";
import type { GalleryImage } from "@/types/galleryImage";

type JoinPageData = Awaited<ReturnType<typeof intakeService.fetchJoinPageData>>;

export default function Join() {
  const [joinData, setJoinData] = useState<JoinPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await intakeService.fetchJoinPageData();
        setJoinData(data);
      } catch (error) {
        console.error("Failed to load join data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setJoinData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  const handleGalleryUpdate = useCallback((updatedGallery: GalleryImage[]) => {
    setJoinData((prev) =>
      prev ? { ...prev, galleryPreview: updatedGallery } : prev,
    );
  }, []);

  if (isLoading || !joinData) {
    return <JoinSkeleton />;
  }

  return (
    <>
      <JoinHero JoinHeroBg={joinData.hero.image} onUpdate={handleHeroUpdate} />
      <JoinForm />
      <GalleryPreview
        galleryPreviewImages={joinData.galleryPreview}
        page="join"
        className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] pb-12"
        onGalleryUpdate={handleGalleryUpdate}
      />
      <SignInCTA />
    </>
  );
}
