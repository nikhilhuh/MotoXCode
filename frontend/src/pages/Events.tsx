import { useEffect, useState } from "react";
import EventsHero from "../components/pages/events/EventsHero";
import EventsList from "../components/pages/events/EventsList";
import GalleryPreview from "@/components/ui/GalleryPreview";
import { eventsService } from "@/services";
import { EventsSkeleton } from "../components/skeletons/EventsSkeleton";

type EventsPageData = Awaited<ReturnType<typeof eventsService.fetchEventsPageData>>;

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

  if (isLoading || !eventsData) {
    return <EventsSkeleton />;
  }

  return (
    <>
      <EventsHero EventsHeroBg={eventsData.hero.image} />
      <EventsList events={eventsData.events}/>
      <GalleryPreview
        galleryPreviewImages={eventsData.galleryPreview}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
