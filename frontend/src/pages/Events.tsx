import { useEffect, useState, useCallback } from "react";
import EventsHero from "../components/pages/events/EventsHero";
import EventsList from "../components/pages/events/EventsList";
import GalleryPreview from "@/components/ui/GalleryPreview";
import { eventsService } from "@/services";
import { EventsSkeleton } from "../components/skeletons/EventsSkeleton";
import type { PageHero } from "@/services/cms.service";
import type { GalleryImage } from "@/types/galleryImage";

type EventsPageData = Awaited<
  ReturnType<typeof eventsService.fetchEventsPageData>
>;

export default function Events() {
  const [eventsData, setEventsData] = useState<EventsPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await eventsService.fetchEventsPageData();
        setEventsData(data);
      } catch (error) {
        console.error("Failed to load events data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setEventsData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  const handleGalleryUpdate = useCallback((updatedGallery: GalleryImage[]) => {
    setEventsData((prev) =>
      prev ? { ...prev, galleryPreview: updatedGallery } : prev,
    );
  }, []);

  if (isLoading || !eventsData) {
    return <EventsSkeleton />;
  }

  return (
    <>
      <EventsHero
        EventsHeroBg={eventsData.hero.image}
        onUpdate={handleHeroUpdate}
      />
      <EventsList events={eventsData.events} />
      <GalleryPreview
        galleryPreviewImages={eventsData.galleryPreview}
        page="events"
        onGalleryUpdate={handleGalleryUpdate}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
