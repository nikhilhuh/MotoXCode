import { useEffect, useState } from "react";
import CrewHero from '../components/pages/crew/CrewHero'
import CrewGrid from '../components/pages/crew/CrewGrid'
import RiderGrid from '../components/pages/crew/RiderGrid'
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

  const crewMembers = crewData.members.filter(m => m.role === 'crew' || m.role === 'admin');
  const riderMembers = crewData.members.filter(m => m.role === 'rider');

  return (
    <>
      <CrewHero CrewHeroBg={crewData.hero.image} />
      <CrewGrid crew={crewMembers}/>
      {riderMembers.length > 0 && <RiderGrid riders={riderMembers} />}
      <CrewCTA />
    </>
  )
}
