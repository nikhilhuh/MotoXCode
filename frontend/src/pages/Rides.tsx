import { useEffect, useState } from "react";
import RidesHero from '../components/pages/rides/RidesHero'
import RidesGrid from '../components/pages/rides/RidesGrid'
import GalleryPreview from '@/components/ui/GalleryPreview';
import { ridesService } from '@/services';
import { RidesSkeleton } from "../components/skeletons/RidesSkeleton";

type RidesPageData = Awaited<ReturnType<typeof ridesService.fetchRidesPageData>>;

export default function Rides() {
  const [ridesData, setRidesData] = useState<RidesPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await ridesService.fetchRidesPageData();
        setRidesData(data);
      } catch (error) {
        console.error("Failed to load rides data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  if (isLoading || !ridesData) {
    return <RidesSkeleton />;
  }

  return (
    <>
      <RidesHero RidesHeroBg={ridesData.hero.image} />
      <RidesGrid rides={ridesData.allRides} />
      <GalleryPreview galleryPreviewImages={ridesData.galleryPreview} className="bg-gradient-to-b from-[var(--color-surface)] to-black" />
    </>
  )
}
