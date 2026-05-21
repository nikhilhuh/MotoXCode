import { useEffect, useState } from "react";
import CrewHero from '../components/pages/crew/CrewHero'
import CrewGrid from '../components/pages/crew/CrewGrid'
import CrewCTA from '../components/pages/crew/CrewCTA'
import { crewService } from '@/services';
import { CrewSkeleton } from "../components/skeletons/CrewSkeleton";

type CrewData = Awaited<ReturnType<typeof crewService.fetchCrewData>>;

export default function Crew() {
  const [crewData, setCrewData] = useState<CrewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await crewService.fetchCrewData();
        setCrewData(data);
      } catch (error) {
        console.error("Failed to load crew data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  if (isLoading || !crewData) {
    return <CrewSkeleton />;
  }

  return (
    <>
      <CrewHero CrewHeroBg={crewData.hero.image} />
      <CrewGrid crew={crewData.members}/>
      <CrewCTA />
    </>
  )
}
