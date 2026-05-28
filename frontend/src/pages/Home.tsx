import { useEffect, useState } from "react";
import Hero from "../components/pages/home/Hero";
import Stats from "../components/pages/home/Stats";
import Values from "../components/pages/home/Values";
import UpcomingRides from "../components/pages/home/UpcomingRides";
import MemberSpotlight from "../components/pages/home/MemberSpotlight";
import GalleryPreview from "../components/ui/GalleryPreview";
import Cta from "../components/pages/home/CTA";
import { cmsService } from "@/services";
import { HomeSkeleton } from "../components/skeletons/HomeSkeleton";

type HomeData = Awaited<ReturnType<typeof cmsService.fetchHomeData>>;

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await cmsService.fetchHomeData();
        setHomeData(data);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  if (isLoading || !homeData) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <Hero HeroBg={homeData.hero.image} />
      <Stats statsData={homeData.stats} />
      <Values valuesData={homeData.values} />
      <UpcomingRides upcomingRidesData={homeData.upcomingRides} />
      <MemberSpotlight mvpCrew={homeData.mvpCrew} />
      <GalleryPreview galleryPreviewImages={homeData.galleryPreview} />
      <Cta statsData={homeData.stats} />
    </>
  );
}
