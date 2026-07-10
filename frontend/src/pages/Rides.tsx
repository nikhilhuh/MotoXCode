import { useEffect, useState, useCallback } from "react";
import RidesHero from "../components/pages/rides/RidesHero";
import RidesGrid from "../components/pages/rides/RidesGrid";
import GalleryPreview from "@/components/ui/GalleryPreview";
import { ridesService } from "@/services";
import { RidesSkeleton } from "../components/skeletons/RidesSkeleton";
import DataError from "../components/ui/DataError";
import type { PageHero } from "@/services/cms.service";
import type { GalleryImage } from "@/types/galleryImage";
import type { Ride } from "@/types/ride";

type RidesPageData = Awaited<
  ReturnType<typeof ridesService.fetchRidesPageData>
>;

export default function Rides() {
  const [ridesData, setRidesData] = useState<RidesPageData | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function hydrate() {
      try {
        setError(false);
        const data = await ridesService.fetchRidesPageData();
        setRidesData(data);
        setRides(data.allRides);
      } catch (error) {
        console.error("Failed to load rides data", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setRidesData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  const handleGalleryUpdate = useCallback((updatedGallery: GalleryImage[]) => {
    setRidesData((prev) =>
      prev ? { ...prev, galleryPreview: updatedGallery } : prev,
    );
  }, []);

  /** Prepend the newly created ride to the top of the local list. */
  const handleRideCreated = useCallback((newRide: Ride) => {
    setRides((prev) => [newRide, ...prev]);
  }, []);

  /** Merge the updated ride document into the existing list. */
  const handleRideUpdated = useCallback((updatedRide: Ride) => {
    setRides((prev) =>
      prev.map((r) => (r._id === updatedRide._id ? updatedRide : r)),
    );
  }, []);

  /** Remove the deleted ride from the local list by ID. */
  const handleRideDeleted = useCallback((id: string) => {
    setRides((prev) => prev.filter((r) => r._id !== id));
  }, []);

  if (isLoading) {
    return <RidesSkeleton />;
  }

  if (error || !ridesData) {
    return <DataError message="Failed to load rides data. Please try again later." onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <RidesHero
        RidesHeroBg={ridesData.hero.image}
        onUpdate={handleHeroUpdate}
      />
      <RidesGrid
        rides={rides}
        onRideCreated={handleRideCreated}
        onRideUpdated={handleRideUpdated}
        onRideDeleted={handleRideDeleted}
      />
      <GalleryPreview
        galleryPreviewImages={ridesData.galleryPreview}
        page="rides"
        onGalleryUpdate={handleGalleryUpdate}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
