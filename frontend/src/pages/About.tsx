import AboutHero from "../components/pages/about/AboutHero";
import AboutPhilosophy from "../components/pages/about/AboutPhilosophy";
import AboutJourney from "../components/pages/about/AboutJourney";
import AboutRidingCode from "../components/pages/about/AboutRidingCode";
import { Philosophy } from "@/types/philosophy";
import { Timeline } from "@/types/timeline";
import { RidingCode } from "@/types/ridingCode";

// this static data will become dynamic and come from server
import AboutHeroBg from "/assets/images/about/aboutHero.png";
const philosophy: Philosophy = {
  id: "philosophy1",
  quote: "The road is not a destination. It's a conversation.",
  author: "Arjun Mehta, Founder",
  image: "/assets/images/about/philosophy.jpg",
};
const timeline: Timeline[] = [
  {
    id: "timeline1",
    year: "2019",
    location: "LADAKH",
    event: "First ride. Ladakh. 12 riders. One borrowed tent. No regrets.",
  },
  {
    id: "timeline2",
    year: "2020",
    location: "DIGITAL HQ",
    event:
      "Locked down but not out — we built the community online, planned the routes, sharpened the code.",
  },
  {
    id: "timeline3",
    year: "2021",
    location: "WESTERN GHATS",
    event:
      "First official MotoXCode group ride. 34 riders. Western Ghats. Zero incidents.",
  },
  {
    id: "timeline4",
    year: "2022",
    location: "PAN INDIA",
    event: "Hit 200 members. Launched our first safety certification program.",
  },
  {
    id: "timeline5",
    year: "2023",
    location: "SPITI VALLEY",
    event:
      "Spiti expedition. 22 riders. 7 days. The hardest thing most of us had ever done.",
  },
  {
    id: "timeline5",
    year: "2024",
    location: "THE HORIZON",
    event: "Crossed 500 active members. 80+ rides. 12 states.",
  },
];
const ridingCode: RidingCode[] = [
  {
    id: "riding1",
    rule: "Gear Up Always",
    detail:
      "Every ride, every time. ATGATT is not a suggestion, it's our identity.",
  },
  {
    id: "riding2",
    rule: "Ride Your Own Ride",
    detail:
      "No peer pressure on pace. No judgement on ability. Everyone starts together, everyone finishes together.",
  },
  {
    id: "riding3",
    rule: "Leave No Rider Behind",
    detail: "If someone needs help on the road, the whole pack stops. Period.",
  },
  {
    id: "riding4",
    rule: "Respect the Road",
    detail:
      "Communities, villages, and wildlife are our hosts. We move through with absolute care.",
  },
  {
    id: "riding5",
    rule: "Earn Your Stripes",
    detail:
      "Trust in this community is built through shared miles, not talk. Actions define the rider.",
  },
];

export default function About() {
  return (
    <>
      <AboutHero AboutHeroBg={AboutHeroBg} />
      <AboutPhilosophy philosophy={philosophy} />
      <AboutJourney timeline={timeline} />
      <AboutRidingCode ridingCode={ridingCode} />
    </>
  );
}
