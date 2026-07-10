import { useEffect, useState, useCallback } from "react";
import AboutHero from "../components/pages/about/AboutHero";
import AboutPhilosophy from "../components/pages/about/AboutPhilosophy";
import AboutJourney from "../components/pages/about/AboutJourney";
import AboutRidingCode from "../components/pages/about/AboutRidingCode";
import { cmsService } from "@/services";
import { AboutSkeleton } from "../components/skeletons/AboutSkeleton";
import DataError from "../components/ui/DataError";
import type { PageHero } from "@/services/cms.service";
import type { Philosophy } from "@/types/philosophy";
import type { Timeline } from "@/types/timeline";
import type { RidingCode } from "@/types/ridingCode";

type AboutData = Awaited<ReturnType<typeof cmsService.fetchAboutData>>;

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function hydrate() {
      try {
        setError(false);
        const data = await cmsService.fetchAboutData();
        setAboutData(data);
      } catch (error) {
        console.error("Failed to load about data", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setAboutData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  const handlePhilosophyUpdate = useCallback(
    (updatedPhilosophy: Philosophy) => {
      setAboutData((prev) =>
        prev
          ? {
              ...prev,
              philosophy: [updatedPhilosophy, ...prev.philosophy.slice(1)],
            }
          : prev,
      );
    },
    [],
  );

  const handleTimelineUpdate = useCallback((updatedTimeline: Timeline[]) => {
    setAboutData((prev) =>
      prev ? { ...prev, timeline: updatedTimeline } : prev,
    );
  }, []);

  const handleRidingCodeUpdate = useCallback(
    (updatedRidingCode: RidingCode[]) => {
      setAboutData((prev) =>
        prev ? { ...prev, ridingCode: updatedRidingCode } : prev,
      );
    },
    [],
  );

  if (isLoading) {
    return <AboutSkeleton />;
  }

  if (error || !aboutData) {
    return <DataError message="Failed to load about data. Please try again later." onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <AboutHero
        AboutHeroBg={aboutData.hero.image}
        onUpdate={handleHeroUpdate}
      />
      <AboutPhilosophy
        philosophy={aboutData.philosophy[0]}
        onUpdate={handlePhilosophyUpdate}
      />
      <AboutJourney
        timeline={aboutData.timeline}
        onUpdate={handleTimelineUpdate}
      />
      <AboutRidingCode
        ridingCode={aboutData.ridingCode}
        onUpdate={handleRidingCodeUpdate}
      />
    </>
  );
}
