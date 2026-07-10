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

  const handleEventCreated = useCallback((newEvent: any) => {
    setEventsData((prev) =>
      prev ? { ...prev, allEvents: [newEvent, ...prev.allEvents] } : prev
    );
  }, []);

  const handleEventUpdated = useCallback((updatedEvent: any) => {
    setEventsData((prev) =>
      prev
        ? {
            ...prev,
            allEvents: prev.allEvents.map((e) =>
              e._id === updatedEvent._id ? updatedEvent : e
            ),
          }
        : prev
    );
  }, []);

  const handleEventDeleted = useCallback((eventId: string) => {
    setEventsData((prev) =>
      prev
        ? {
            ...prev,
            allEvents: prev.allEvents.filter((e) => e._id !== eventId),
          }
        : prev
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
      <EventsList 
        events={eventsData.allEvents} 
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
        onEventDeleted={handleEventDeleted}
      />
      <GalleryPreview
        galleryPreviewImages={eventsData.galleryPreview}
        page="events"
        onGalleryUpdate={handleGalleryUpdate}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
