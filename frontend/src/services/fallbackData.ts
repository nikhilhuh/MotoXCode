import type { Social } from "../types/social";
import type { Stat } from "../types/stat";
import type { Value } from "../types/value";
import type { Ride } from "../types/ride";
import type { Member } from "../types/member";
import type { GalleryImage } from "../types/galleryImage";
import type { Philosophy } from "../types/philosophy";
import type { Timeline } from "../types/timeline";
import type { RidingCode } from "../types/ridingCode";
import type { Event } from "../types/event";
import type { ContactInfoItem } from "../types/contactInfo";
import type { PageHero } from "./cms.service";

// ─── Fallback Data Compilation ────────────────────────────────────────────────
//
// Centralized local fallback dataset. Every value is strongly typed against
// the application's existing interfaces. Used when the backend API is
// unreachable (network errors, timeouts, 5xx). Local image paths reference
// files in public/assets/images/.
//
// ───────────────────────────────────────────────────────────────────────────────

// ─── Socials ──────────────────────────────────────────────────────────────────

const socials: Social[] = [
  { label: "Instagram", link: "#" },
  { label: "YouTube", link: "#" },
];

// ─── Home ─────────────────────────────────────────────────────────────────────

const homeHero: PageHero = {
  page: "home",
  image: "/assets/images/home/homeHero.png",
};

const homeStats: Stat[] = [
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
    image: "/assets/images/home/collective.png",
  },
  {
    id: "stat4",
    target: 10,
    suffix: "+",
    label: "States Covered",
    image: "/assets/images/home/states.png",
  },
];

const homeValues: Value[] = [
  {
    id: "value1",
    title: "The Code of the Road",
    description:
      "Every rider carries a responsibility — to themselves, to their machine, and to every other soul on the asphalt. We don't just ride fast. We ride right.",
    tag: "Safety First",
    image: "/assets/images/home/value1.jpg",
  },
  {
    id: "value2",
    title: "Brotherhood Over Horsepower",
    description:
      "It doesn't matter what you ride. What matters is how you show up — for a fellow rider stranded on a highway, for a friend who needs a shoulder, for the community that built this.",
    tag: "Community",
    image: "/assets/images/home/value2.jpg",
  },
  {
    id: "value3",
    title: "The Long Road as Teacher",
    description:
      "Every long ride strips away the noise. What remains is clarity. We ride not to escape life — but to meet it head-on, at speed, in the open air.",
    tag: "Philosophy",
    image: "/assets/images/home/value3.jpg",
  },
];

const homeUpcomingRides: Ride[] = [
  {
    id: "ride1",
    title: "Ghats of Fire",
    location: { from: "Pune", to: "Western Ghats" },
    date: "2026-05-10",
    distance: "480 km",
    routeType: "Inter-state",
    image: "/assets/images/rides/ride1.jpg",
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
    image: "/assets/images/rides/ride2.jpg",
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
    image: "/assets/images/rides/ride3.jpg",
    meetupTime: "04:30 AM",
    meetupLocation: "Mall Road Square, Manali",
    membersJoined: 32,
    description:
      "The highest motorable roads in the world. Thin air, zero margin for error, and scenery that breaks your heart open.",
    duration: "7 days",
    past: false,
  },
];

const homeMvpCrew: Member[] = [
  {
    id: "member1",
    name: "Arjun Mehta",
    role: "Founder & Ride Leader",
    bike: "Royal Enfield Himalayan 450",
    image: "/assets/images/crew/crew1.jpg",
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
    image: "/assets/images/crew/crew2.jpg",
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
    image: "/assets/images/crew/crew3.jpg",
    bio: "If your bike has a problem, Rajan has already fixed it in his head before you finish explaining. 15 years in the saddle, 20 years with a wrench.",
    years: 8,
    location: "Delhi, NCR",
    instagram: "@rajan.wrenches",
    whatsapp: "+91 99101 56789",
    mvp: true,
  },
];

const homeGallery: GalleryImage[] = [
  { id: "gallery1", src: "/assets/images/gallery/gallery1.jpg", title: "Mountain Pass Celebration", page: "home" },
  { id: "gallery2", src: "/assets/images/gallery/gallery2.jpg", title: "Coastal Convoy", page: "home" },
  { id: "gallery3", src: "/assets/images/gallery/gallery3.jpg", title: "Rain Reflections", page: "home" },
  { id: "gallery4", src: "/assets/images/gallery/gallery4.jpg", title: "Desert Run", page: "home" },
  { id: "gallery5", src: "/assets/images/gallery/gallery5.jpg", title: "Himalayan Scale", page: "home" },
  { id: "gallery6", src: "/assets/images/gallery/gallery6.jpg", title: "Golden Hour Viewpoint", page: "home" },
];

// ─── About ────────────────────────────────────────────────────────────────────

const aboutHero: PageHero = {
  page: "about",
  image: "/assets/images/about/aboutHero.png",
};

const aboutPhilosophy: Philosophy[] = [
  {
    id: "philosophy1",
    quote: "The road is not a destination. It's a conversation.",
    author: "Arjun Mehta, Founder",
    image: "/assets/images/about/philosophy.jpg",
  },
];

const aboutTimeline: Timeline[] = [
  { id: "timeline1", year: "2019", location: "LADAKH", event: "First ride. Ladakh. 12 riders. One borrowed tent. No regrets." },
  { id: "timeline2", year: "2020", location: "DIGITAL HQ", event: "Locked down but not out — we built the community online, planned the routes, sharpened the code." },
  { id: "timeline3", year: "2021", location: "WESTERN GHATS", event: "First official MotoXCode group ride. 34 riders. Western Ghats. Zero incidents." },
  { id: "timeline4", year: "2022", location: "PAN INDIA", event: "Hit 200 members. Launched our first safety certification program." },
  { id: "timeline5", year: "2023", location: "SPITI VALLEY", event: "Spiti expedition. 22 riders. 7 days. The hardest thing most of us had ever done." },
  { id: "timeline6", year: "2024", location: "THE HORIZON", event: "Crossed 500 active members. 80+ rides. 12 states." },
];

const aboutRidingCode: RidingCode[] = [
  { id: "riding1", rule: "Gear Up Always", detail: "Every ride, every time. ATGATT is not a suggestion, it's our identity." },
  { id: "riding2", rule: "Ride Your Own Ride", detail: "No peer pressure on pace. No judgement on ability. Everyone starts together, everyone finishes together." },
  { id: "riding3", rule: "Leave No Rider Behind", detail: "If someone needs help on the road, the whole pack stops. Period." },
  { id: "riding4", rule: "Respect the Road", detail: "Communities, villages, and wildlife are our hosts. We move through with absolute care." },
  { id: "riding5", rule: "Earn Your Stripes", detail: "Trust in this community is built through shared miles, not talk. Actions define the rider." },
];

// ─── Crew ─────────────────────────────────────────────────────────────────────

const crewHero: PageHero = {
  page: "crew",
  image: "/assets/images/crew/crewHero.png",
};

const crewMembers: Member[] = [
  {
    id: "member-001",
    name: "Arjun Mehta",
    role: "Founder & Ride Leader",
    bike: "Royal Enfield Himalayan 450",
    image: "/assets/images/crew/crew1.jpg",
    bio: "Started MotoXCode in 2019 with a single ride to Ladakh and a WhatsApp group of 12. Now a movement of hundreds. Arjun believes every machine has a soul — you just have to listen.",
    years: 7,
    location: "Mumbai, Maharashtra",
    instagram: "@arjun.rides",
    whatsapp: "+91 98200 11234",
  },
  {
    id: "member-002",
    name: "Priya Nair",
    role: "Route Architect",
    bike: "KTM 390 Adventure",
    image: "/assets/images/crew/crew2.jpg",
    bio: "Priya maps every route like a military operation — elevation profiles, fuel stops, bail-out points, and the best chai stops. She's ridden 40,000+ km across India.",
    years: 5,
    location: "Pune, Maharashtra",
    instagram: "@priya.routes",
  },
  {
    id: "member-003",
    name: "Rajan Sharma",
    role: "Mechanic & Crew Chief",
    bike: "Bajaj Dominar 400",
    image: "/assets/images/crew/crew3.jpg",
    bio: "If your bike has a problem, Rajan has already fixed it in his head before you finish explaining. 15 years in the saddle, 20 years with a wrench.",
    years: 8,
    location: "Delhi, NCR",
    instagram: "@rajan.wrenches",
    whatsapp: "+91 99101 56789",
  },
  {
    id: "member-004",
    name: "Kavya Reddy",
    role: "Content & Visual Lead",
    bike: "Honda CB500X",
    image: "/assets/images/crew/crew4.jpg",
    bio: "Kavya captures the emotion that a spec sheet can't — the way light hits a visor at golden hour, the blur of a fast corner, the silence of a mountain pass.",
    years: 3,
    location: "Hyderabad, Telangana",
    instagram: "@kavya.lens",
  },
  {
    id: "member-005",
    name: "Dev Krishnan",
    role: "Safety Officer",
    bike: "BMW G 310 GS",
    image: "/assets/images/crew/crew5.jpg",
    bio: "Dev has a first responder certification and has seen what happens when riders skip the safety briefing. He doesn't lecture — he leads by example.",
    years: 6,
    location: "Bengaluru, Karnataka",
    instagram: "@dev.safe",
    whatsapp: "+91 97400 22345",
  },
  {
    id: "member-006",
    name: "Zara Khan",
    role: "Events Coordinator",
    bike: "Triumph Street Twin",
    image: "/assets/images/crew/crew6.jpg",
    bio: "Behind every seamless MotoXCode event is Zara's meticulous planning. Hotel blocks, group entries, rider registrations — she makes the chaos invisible.",
    years: 4,
    location: "Jaipur, Rajasthan",
    instagram: "@zara.events",
  },
];

// ─── Rides ────────────────────────────────────────────────────────────────────

const ridesHero: PageHero = {
  page: "rides",
  image: "/assets/images/rides/ridesHero.png",
};

const allRides: Ride[] = [
  {
    id: "ride1",
    title: "Ghats of Fire",
    location: { from: "Pune", to: "Western Ghats" },
    date: "2026-05-10",
    distance: "480 km",
    routeType: "Inter-state",
    image: "/assets/images/rides/ride1.jpg",
    meetupTime: "05:30 AM",
    meetupLocation: "Bavdhan Highway Cafe, Pune",
    membersJoined: 24,
    description: "A legendary run through the serpentine passes of the Western Ghats. Rain-carved roads, misty peaks, and the kind of silence that only a rider knows.",
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
    image: "/assets/images/rides/ride2.jpg",
    meetupTime: "06:00 AM",
    meetupLocation: "NH11 Toll Plaza, Jaipur",
    membersJoined: 18,
    description: "Golden dunes, ancient forts, and an endless horizon. The desert doesn't forgive weakness — but it rewards courage.",
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
    image: "/assets/images/rides/ride3.jpg",
    meetupTime: "04:30 AM",
    meetupLocation: "Mall Road Square, Manali",
    membersJoined: 32,
    description: "The highest motorable roads in the world. Thin air, zero margin for error, and scenery that breaks your heart open.",
    duration: "7 days",
    past: false,
  },
  {
    id: "ride4",
    title: "Coastal Circuit",
    location: { from: "Goa", to: "Mangalore" },
    date: "2026-04-01",
    distance: "380 km",
    routeType: "Inter-state",
    image: "/assets/images/rides/ride4.jpg",
    meetupTime: "07:00 AM",
    meetupLocation: "Panjim Circle, Goa",
    membersJoined: 45,
    description: "Salt air, coconut palms, and the Arabian Sea to your left. A ride that reminds you why you started.",
    duration: "1 day",
    past: true,
  },
  {
    id: "ride5",
    title: "Valley of Shadows",
    location: { from: "Bangalore", to: "Coorg" },
    date: "2026-03-15",
    distance: "290 km",
    routeType: "Inter-city",
    image: "/assets/images/rides/ride5.jpg",
    meetupTime: "05:00 AM",
    meetupLocation: "Mysore Road NICE Junction, BLR",
    membersJoined: 28,
    description: "Coffee country in the fog. Twisty roads through ancient forests. A meditative run for the seasoned rider.",
    duration: "1 day",
    past: true,
  },
];

const ridesGallery: GalleryImage[] = [
  { id: "gallery1", src: "/assets/images/gallery/gallery1.jpg", title: "Mountain Pass Celebration", page: "rides" },
  { id: "gallery2", src: "/assets/images/gallery/gallery2.jpg", title: "Coastal Convoy", page: "rides" },
  { id: "gallery3", src: "/assets/images/gallery/gallery3.jpg", title: "Rain Reflections", page: "rides" },
  { id: "gallery4", src: "/assets/images/gallery/gallery4.jpg", title: "Desert Run", page: "rides" },
  { id: "gallery5", src: "/assets/images/gallery/gallery5.jpg", title: "Himalayan Scale", page: "rides" },
  { id: "gallery6", src: "/assets/images/gallery/gallery6.jpg", title: "Golden Hour Viewpoint", page: "rides" },
];

// ─── Events ───────────────────────────────────────────────────────────────────

const eventsHero: PageHero = {
  page: "events",
  image: "/assets/images/events/eventsHero.png",
};

const allEvents: Event[] = [
  { id: "evt-001", date: "2026-05-10", title: "Ghats of Fire — Group Ride", location: "Western Ghats, Maharashtra", type: "Ride", time: "05:30 AM departure", spots: 20, spotsLeft: 7 },
  { id: "evt-002", date: "2026-05-17", title: "Gear Check & Safety Workshop", location: "Pune, Maharashtra", type: "Workshop", time: "10:00 AM – 1:00 PM", spots: 30, spotsLeft: 15 },
  { id: "evt-003", date: "2026-05-24", title: "Desert Thunder — Rajasthan Ride", location: "Jaisalmer, Rajasthan", type: "Ride", time: "06:00 AM departure", spots: 25, spotsLeft: 12 },
  { id: "evt-004", date: "2026-06-01", title: "Community Meetup & New Member Welcome", location: "Mumbai, Maharashtra", type: "Meetup", time: "07:00 PM", spots: 60, spotsLeft: 34 },
  { id: "evt-005", date: "2026-06-14", title: "Himalayan Vigil Expedition", location: "Spiti Valley, Himachal Pradesh", type: "Ride", time: "05:00 AM departure (Day 1)", spots: 15, spotsLeft: 3 },
];

const eventsGallery: GalleryImage[] = [
  { id: "gallery1", src: "/assets/images/gallery/gallery1.jpg", title: "Mountain Pass Celebration", page: "events" },
  { id: "gallery2", src: "/assets/images/gallery/gallery2.jpg", title: "Coastal Convoy", page: "events" },
  { id: "gallery3", src: "/assets/images/gallery/gallery3.jpg", title: "Rain Reflections", page: "events" },
  { id: "gallery4", src: "/assets/images/gallery/gallery4.jpg", title: "Desert Run", page: "events" },
  { id: "gallery5", src: "/assets/images/gallery/gallery5.jpg", title: "Himalayan Scale", page: "events" },
  { id: "gallery6", src: "/assets/images/gallery/gallery6.jpg", title: "Golden Hour Viewpoint", page: "events" },
];

// ─── Contact ──────────────────────────────────────────────────────────────────

const contactHero: PageHero = {
  page: "contact",
  image: "/assets/images/contact/contactHero.png",
};

const contactInfo: ContactInfoItem[] = [
  { id: "contact1", label: "Base", value: "Mumbai, Maharashtra, India", type: "base" },
  { id: "contact2", label: "Email", value: "hello@motoxcode.in", type: "email" },
  { id: "contact3", label: "Instagram", value: "@motoxcode.in", type: "instagram" },
  { id: "contact4", label: "WhatsApp", value: "+91 9999999999", type: "whatsapp" },
  { id: "contact5", label: "Phone", value: "+91 9999999999", type: "phone" },
  { id: "contact6", label: "Website", value: "www.motoxcode.in", type: "website" },
];

// ─── Join ─────────────────────────────────────────────────────────────────────

const joinHero: PageHero = {
  page: "join",
  image: "/assets/images/join/joinHero.png",
};

const joinGallery: GalleryImage[] = [
  { id: "gallery1", src: "/assets/images/gallery/gallery1.jpg", title: "Mountain Pass Celebration", page: "join" },
  { id: "gallery2", src: "/assets/images/gallery/gallery2.jpg", title: "Coastal Convoy", page: "join" },
  { id: "gallery3", src: "/assets/images/gallery/gallery3.jpg", title: "Rain Reflections", page: "join" },
  { id: "gallery4", src: "/assets/images/gallery/gallery4.jpg", title: "Desert Run", page: "join" },
  { id: "gallery5", src: "/assets/images/gallery/gallery5.jpg", title: "Himalayan Scale", page: "join" },
  { id: "gallery6", src: "/assets/images/gallery/gallery6.jpg", title: "Golden Hour Viewpoint", page: "join" },
];

// ─── Exported Compilation Object ──────────────────────────────────────────────

export const fallbackData = {
  socials,
  home: {
    hero: homeHero,
    stats: homeStats,
    values: homeValues,
    upcomingRides: homeUpcomingRides,
    mvpCrew: homeMvpCrew,
    galleryPreview: homeGallery,
  },
  about: {
    hero: aboutHero,
    philosophy: aboutPhilosophy,
    timeline: aboutTimeline,
    ridingCode: aboutRidingCode,
  },
  crew: {
    hero: crewHero,
    members: crewMembers,
  },
  rides: {
    hero: ridesHero,
    allRides,
    galleryPreview: ridesGallery,
  },
  events: {
    hero: eventsHero,
    events: allEvents,
    galleryPreview: eventsGallery,
  },
  contact: {
    hero: contactHero,
    contactInfo,
  },
  join: {
    hero: joinHero,
    galleryPreview: joinGallery,
  },
} as const;
