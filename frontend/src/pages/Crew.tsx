import { useEffect, useState, useCallback } from "react";
import CrewHero from "../components/pages/crew/CrewHero";
import CrewGrid from "../components/pages/crew/CrewGrid";
import RiderGrid from "../components/pages/crew/RiderGrid";
import CrewCTA from "../components/pages/crew/CrewCTA";
import { crewService } from "@/services";
import { CrewSkeleton } from "../components/skeletons/CrewSkeleton";
import DataError from "../components/ui/DataError";
import type { PageHero } from "@/services/cms.service";

type CrewData = Awaited<ReturnType<typeof crewService.fetchCrewData>>;

export default function Crew() {
  const [crewData, setCrewData] = useState<CrewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function hydrate() {
      try {
        setError(false);
        const data = await crewService.fetchCrewData();
        setCrewData(data);
      } catch (error) {
        console.error("Failed to load crew data", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setCrewData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  if (isLoading) {
    return <CrewSkeleton />;
  }

  if (error || !crewData) {
    return <DataError message="Failed to load crew data. Please try again later." onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <CrewHero CrewHeroBg={crewData.hero.image} onUpdate={handleHeroUpdate} />
      {crewData.mvpMembers.length > 0 && (
        <CrewGrid crew={crewData.mvpMembers} />
      )}
      {crewData.normalMembers.length > 0 && (
        <RiderGrid riders={crewData.normalMembers} />
      )}
      <CrewCTA />
    </>
  );
}
