import { useEffect, useState } from "react";
import AboutHero from "../components/pages/about/AboutHero";
import AboutPhilosophy from "../components/pages/about/AboutPhilosophy";
import AboutJourney from "../components/pages/about/AboutJourney";
import AboutRidingCode from "../components/pages/about/AboutRidingCode";
import { cmsService } from "@/services";
import { AboutSkeleton } from "../components/skeletons/AboutSkeleton";

type AboutData = Awaited<ReturnType<typeof cmsService.fetchAboutData>>;

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await cmsService.fetchAboutData();
        setAboutData(data);
      } catch (error) {
        console.error("Failed to load about data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  if (isLoading || !aboutData) {
    return <AboutSkeleton />;
  }

  return (
    <>
      <AboutHero AboutHeroBg={aboutData.hero.image} />
      <AboutPhilosophy philosophy={aboutData.philosophy[0]} />
      <AboutJourney timeline={aboutData.timeline} />
      <AboutRidingCode ridingCode={aboutData.ridingCode} />
    </>
  );
}
