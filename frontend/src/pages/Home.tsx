import { useEffect, useState, useCallback } from "react";
import Hero from "../components/pages/home/Hero";
import Stats from "../components/pages/home/Stats";
import Values from "../components/pages/home/Values";
import UpcomingRides from "../components/pages/home/UpcomingRides";
import MemberSpotlight from "../components/pages/home/MemberSpotlight";
import GalleryPreview from "../components/ui/GalleryPreview";
import Cta from "../components/pages/home/CTA";
import { cmsService } from "@/services";
import { HomeSkeleton } from "../components/skeletons/HomeSkeleton";
import DataError from "../components/ui/DataError";
import type { PageHero } from "@/services/cms.service";
import type { Stat } from "@/types/stat";
import type { Value } from "@/types/value";
import { GalleryImage } from "@/types/galleryImage";
import { useFeedback } from "@/context/FeedbackContext";

type HomeData = Awaited<ReturnType<typeof cmsService.fetchHomeData>>;

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { showError } = useFeedback();

  useEffect(() => {
    async function hydrate() {
      try {
        setError(false);
        const data = await cmsService.fetchHomeData();
        setHomeData(data);
      } catch (error) {
        showError("Failed to load home data");
        console.error("Failed to laod hoem data: ", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  /**
   * Optimistic state refresh callbacks — called by admin-editable sections
   * after a successful save so the live page reflects persisted changes
   * without a full re-fetch.
   */
  const handleHeroUpdate = useCallback((updatedHero: Partial<PageHero>) => {
    setHomeData((prev) =>
      prev ? { ...prev, hero: { ...prev.hero, ...updatedHero } } : prev,
    );
  }, []);

  const handleStatsUpdate = useCallback((updatedStats: Stat[]) => {
    setHomeData((prev) => (prev ? { ...prev, stats: updatedStats } : prev));
  }, []);

  const handleValuesUpdate = useCallback((updatedValues: Value[]) => {
    setHomeData((prev) => (prev ? { ...prev, values: updatedValues } : prev));
  }, []);

  const handleGalleryUpdate = useCallback((updatedGallery: GalleryImage[]) => {
    setHomeData((prev) =>
      prev ? { ...prev, galleryPreview: updatedGallery } : prev,
    );
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (error || !homeData) {
    return (
      <DataError
        message="Failed to load home data. Please try again later."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <Hero HeroBg={homeData.hero.image} onUpdate={handleHeroUpdate} />
      <Stats statsData={homeData.stats} onStatsUpdate={handleStatsUpdate} />
      <Values
        valuesData={homeData.values}
        onValuesUpdate={handleValuesUpdate}
      />
      <UpcomingRides upcomingRidesData={homeData.upcomingRides} />
      <MemberSpotlight mvpCrew={homeData.mvpCrew} />
      {homeData.galleryPreview.length > 0 && (
        <GalleryPreview
          galleryPreviewImages={homeData.galleryPreview}
          page="home"
          onGalleryUpdate={handleGalleryUpdate}
        />
      )}
      <Cta statsData={homeData.stats} />
    </>
  );
}
