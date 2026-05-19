import EventsHero from "../components/pages/events/EventsHero";
import EventsList from "../components/pages/events/EventsList";
import { GalleryImage } from "@/types/galleryImage";
import GalleryPreview from "@/components/ui/GalleryPreview";
import { Event } from "@/types/event";

// this static data will become dynamic and come from server
import EventsHeroBg from "/assets/images/events/eventsHero.png";
const events: Event[] = [
  {
    id: "evt-001",
    date: "2026-05-10",
    title: "Ghats of Fire — Group Ride",
    location: "Western Ghats, Maharashtra",
    type: "Ride",
    time: "05:30 AM departure",
    spots: 20,
    spotsLeft: 7,
  },
  {
    id: "evt-002",
    date: "2026-05-17",
    title: "Gear Check & Safety Workshop",
    location: "Pune, Maharashtra",
    type: "Workshop",
    time: "10:00 AM – 1:00 PM",
    spots: 30,
    spotsLeft: 15,
  },
  {
    id: "evt-003",
    date: "2026-05-24",
    title: "Desert Thunder — Rajasthan Ride",
    location: "Jaisalmer, Rajasthan",
    type: "Ride",
    time: "06:00 AM departure",
    spots: 25,
    spotsLeft: 12,
  },
  {
    id: "evt-004",
    date: "2026-06-01",
    title: "Community Meetup & New Member Welcome",
    location: "Mumbai, Maharashtra",
    type: "Meetup",
    time: "07:00 PM",
    spots: 60,
    spotsLeft: 34,
  },
  {
    id: "evt-005",
    date: "2026-06-14",
    title: "Himalayan Vigil Expedition",
    location: "Spiti Valley, Himachal Pradesh",
    type: "Ride",
    time: "05:00 AM departure (Day 1)",
    spots: 15,
    spotsLeft: 3,
  },
];
const galleryPreviewImages: GalleryImage[] = [
  {
    id: "gallery1",
    src: "/assets/images/gallery/gallery1.jpg",
    title: "Mountain Pass Celebration",
    page: "events",
  },
  {
    id: "gallery2",
    src: "/assets/images/gallery/gallery2.jpg",
    title: "Coastal Convoy",
    page: "events",
  },
  {
    id: "gallery3",
    src: "/assets/images/gallery/gallery3.jpg",
    title: "Rain Reflections",
    page: "events",
  },
  {
    id: "gallery4",
    src: "/assets/images/gallery/gallery4.jpg",
    title: "Desert Run",
    page: "events",
  },
  {
    id: "gallery5",
    src: "/assets/images/gallery/gallery5.jpg",
    title: "Himalayan Scale",
    page: "events",
  },
  {
    id: "gallery6",
    src: "/assets/images/gallery/gallery6.jpg",
    title: "Golden Hour Viewpoint",
    page: "events",
  },
];

export default function Events() {
  return (
    <>
      <EventsHero EventsHeroBg={EventsHeroBg} />
      <EventsList events={events}/>
      <GalleryPreview
        galleryPreviewImages={galleryPreviewImages}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
