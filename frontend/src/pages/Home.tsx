import Hero from "../components/pages/home/Hero";
import Stats from "../components/pages/home/Stats";
import Values from "../components/pages/home/Values";
import UpcomingRides from "../components/pages/home/UpcomingRides";
import MemberSpotlight from "../components/pages/home/MemberSpotlight";
import GalleryPreview from "../components/pages/home/GalleryPreview";
import CTA from "../components/pages/home/CTA";
import { Stat } from "@/types/stat";
import { Value } from "@/types/value";
import { Ride } from "@/types/ride";

// this static data will become dynamic and come from server
import HeroBg from "/assets/images/home/hero.png";
import { Member } from "@/types/member";
import { GalleryImage } from "@/types/galleryImage";
const statsData: Stat[] = [
  {
    id: "stat1",
    target: 500,
    suffix: "+",
    label: "Active Members",
    image: "/assets/images/home/members.png",
  },
  {
    id: "stat2",
    target: 80,
    suffix: "+",
    label: "Rides Completed",
    image: "/assets/images/home/rides.png",
  },
  {
    id: "stat3",
    target: 1.2,
    suffix: "L+",
    label: "Collective KMs",
    isFloat: true,
    image: "/assets/images/home/collective_kms.png",
  },
  {
    id: "stat4",
    target: 10,
    suffix: "+",
    label: "States Covered",
    image: "/assets/images/home/states.png",
  },
];
const valuesData: Value[] = [
  {
    id: "value1",
    title: "The Code of the Road",
    body: "Every rider carries a responsibility — to themselves, to their machine, and to every other soul on the asphalt. We don't just ride fast. We ride right.",
    tag: "Safety First",
    image: "/assets/images/home/img-1.jpg",
  },
  {
    id: "value2",
    title: "Brotherhood Over Horsepower",
    body: "It doesn't matter what you ride. What matters is how you show up — for a fellow rider stranded on a highway, for a friend who needs a shoulder, for the community that built this.",
    tag: "Community",
    image: "/assets/images/home/img-2.jpg",
  },
  {
    id: "value3",
    title: "The Long Road as Teacher",
    body: "Every long ride strips away the noise. What remains is clarity. We ride not to escape life — but to meet it head-on, at speed, in the open air.",
    tag: "Philosophy",
    image: "/assets/images/home/img-3.jpg",
  },
];
const upcomingRidesData: Ride[] = [
  {
    id: "ride1",
    title: "Ghats of Fire",
    location: { from: "Pune", to: "Western Ghats" },
    date: "2026-05-10",
    distance: "480 km",
    routeType: "Inter-state",
    image: "/assets/images/rides/ride-1.jpg",
    meetupTime: "05:30 AM",
    meetupLocation: "Bavdhan Highway Cafe, Pune",
    membersJoined: 24,
    description:
      "A legendary run through the serpentine passes of the Western Ghats. Rain-carved roads, misty peaks, and the kind of silence that only a rider knows.",
    duration: "2 days",
    past: false,
  },
  {
    id: "ride2",
    title: "Desert Thunder",
    location: { from: "Jaipur", to: "Jaisalmer" },
    date: "2026-05-24",
    distance: "620 km",
    routeType: "Inter-city",
    image: "/assets/images/rides/ride-2.jpg",
    meetupTime: "06:00 AM",
    meetupLocation: "NH11 Toll Plaza, Jaipur",
    membersJoined: 18,
    description:
      "Golden dunes, ancient forts, and an endless horizon. The desert doesn't forgive weakness — but it rewards courage.",
    duration: "3 days",
    past: false,
  },
  {
    id: "ride3",
    title: "Himalayan Vigil",
    location: { from: "Manali", to: "Spiti Valley" },
    date: "2026-06-14",
    distance: "1,100 km",
    routeType: "Inter-state",
    image: "/assets/images/rides/ride-3.jpg",
    meetupTime: "04:30 AM",
    meetupLocation: "Mall Road Square, Manali",
    membersJoined: 32,
    description:
      "The highest motorable roads in the world. Thin air, zero margin for error, and scenery that breaks your heart open.",
    duration: "7 days",
    past: false,
  },
];
const mvpCrew: Member[] = [
  {
    id: "member1",
    name: "Arjun Mehta",
    role: "Founder & Ride Leader",
    bike: "Royal Enfield Himalayan 450",
    image: "/assets/images/crew/member-1.jpg",
    bio: "Started MotoXCode in 2019 with a single ride to Ladakh and a WhatsApp group of 12. Now a movement of hundreds. Arjun believes every machine has a soul — you just have to listen.",
    years: 7,
    location: "Mumbai, Maharashtra",
    instagram: "@arjun.rides",
    whatsapp: "+91 98200 11234",
    mvp: true,
  },
  {
    id: "member2",
    name: "Priya Nair",
    role: "Route Architect",
    bike: "KTM 390 Adventure",
    image: "/assets/images/crew/member-2.jpg",
    bio: "Priya maps every route like a military operation — elevation profiles, fuel stops, bail-out points, and the best chai stops. She's ridden 40,000+ km across India.",
    years: 5,
    location: "Pune, Maharashtra",
    instagram: "@priya.routes",
    mvp: true,
  },
  {
    id: "member3",
    name: "Rajan Sharma",
    role: "Mechanic & Crew Chief",
    bike: "Bajaj Dominar 400",
    image: "/assets/images/crew/member-3.jpg",
    bio: "If your bike has a problem, Rajan has already fixed it in his head before you finish explaining. 15 years in the saddle, 20 years with a wrench.",
    years: 8,
    location: "Delhi, NCR",
    instagram: "@rajan.wrenches",
    whatsapp: "+91 99101 56789",
    mvp: true,
  },
];
const galleryPreviewImages: GalleryImage[] = [
  {
    id: "gallery1",
    src: "/assets/images/gallery/img-1.jpg",
    title: "Mountain Pass Celebration",
  },
  {
    id: "gallery2",
    src: "/assets/images/gallery/img-2.jpg",
    title: "Coastal Convoy",
  },
  {
    id: "gallery3",
    src: "/assets/images/gallery/img-7.jpg",
    title: "Rain Reflections",
  },
  {
    id: "gallery4",
    src: "/assets/images/gallery/img-4.jpg",
    title: "Desert Run",
  },
  {
    id: "gallery5",
    src: "/assets/images/gallery/img-5.jpg",
    title: "Himalayan Scale",
  },
  {
    id: "gallery6",
    src: "/assets/images/gallery/img-6.jpg",
    title: "Golden Hour Viewpoint",
  },
];

export default function Home() {
  return (
    <>
      <Hero HeroBg={HeroBg} />
      <Stats statsData={statsData} />
      <Values valuesData={valuesData} />
      <UpcomingRides upcomingRidesData={upcomingRidesData} />
      <MemberSpotlight mvpCrew={mvpCrew} />
      <GalleryPreview galleryPreviewImages={galleryPreviewImages} />
      <CTA statsData={statsData} />
    </>
  );
}
