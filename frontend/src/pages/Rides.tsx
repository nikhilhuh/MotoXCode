import RidesHero from '../components/pages/rides/RidesHero'
import RidesGrid from '../components/pages/rides/RidesGrid'
import GalleryPreview from '@/components/ui/GalleryPreview';
import { Ride } from '@/types/ride';
import { GalleryImage } from '@/types/galleryImage';

// this static data will become dynamic and come from server
import RidesHeroBg from '/assets/images/rides/ridesHero.png'
const rides: Ride[] = [
  {
    id: 'ride1',
    title: 'Ghats of Fire',
    location: { from: 'Pune', to: 'Western Ghats' },
    date: '2026-05-10',
    distance: '480 km',
    routeType: 'Inter-state',
    image: '/assets/images/rides/ride1.jpg',
    meetupTime: '05:30 AM',
    meetupLocation: 'Bavdhan Highway Cafe, Pune',
    membersJoined: 24,
    description: 'A legendary run through the serpentine passes of the Western Ghats. Rain-carved roads, misty peaks, and the kind of silence that only a rider knows.',
    duration: '2 days',
    past: false,
  },
  {
    id: 'ride2',
    title: 'Desert Thunder',
    location: { from: 'Jaipur', to: 'Jaisalmer' },
    date: '2026-05-24',
    distance: '620 km',
    routeType: 'Inter-city',
    image: '/assets/images/rides/ride2.jpg',
    meetupTime: '06:00 AM',
    meetupLocation: 'NH11 Toll Plaza, Jaipur',
    membersJoined: 18,
    description: 'Golden dunes, ancient forts, and an endless horizon. The desert doesn\'t forgive weakness — but it rewards courage.',
    duration: '3 days',
    past: false,
  },
  {
    id: 'ride3',
    title: 'Himalayan Vigil',
    location: { from: 'Manali', to: 'Spiti Valley' },
    date: '2026-06-14',
    distance: '1,100 km',
    routeType: 'Inter-state',
    image: '/assets/images/rides/ride3.jpg',
    meetupTime: '04:30 AM',
    meetupLocation: 'Mall Road Square, Manali',
    membersJoined: 32,
    description: 'The highest motorable roads in the world. Thin air, zero margin for error, and scenery that breaks your heart open.',
    duration: '7 days',
    past: false,
  },
  {
    id: 'ride4',
    title: 'Coastal Circuit',
    location: { from: 'Goa', to: 'Mangalore' },
    date: '2026-04-01',
    distance: '380 km',
    routeType: 'Inter-state',
    image: '/assets/images/rides/ride4.jpg',
    meetupTime: '07:00 AM',
    meetupLocation: 'Panjim Circle, Goa',
    membersJoined: 45,
    description: 'Salt air, coconut palms, and the Arabian Sea to your left. A ride that reminds you why you started.',
    duration: '1 day',
    past: true,
  },
  {
    id: 'ride5',
    title: 'Valley of Shadows',
    location: { from: 'Bangalore', to: 'Coorg' },
    date: '2026-03-15',
    distance: '290 km',
    routeType: 'Inter-city',
    image: '/assets/images/rides/ride5.jpg',
    meetupTime: '05:00 AM',
    meetupLocation: 'Mysore Road NICE Junction, BLR',
    membersJoined: 28,
    description: 'Coffee country in the fog. Twisty roads through ancient forests. A meditative run for the seasoned rider.',
    duration: '1 day',
    past: true,
  },
];
const galleryPreviewImages: GalleryImage[] = [
  {
    id: "gallery1",
    src: "/assets/images/gallery/gallery1.jpg",
    title: "Mountain Pass Celebration",
    page: "rides",
  },
  {
    id: "gallery2",
    src: "/assets/images/gallery/gallery2.jpg",
    title: "Coastal Convoy",
    page: "rides",
  },
  {
    id: "gallery3",
    src: "/assets/images/gallery/gallery3.jpg",
    title: "Rain Reflections",
    page: "rides",
  },
  {
    id: "gallery4",
    src: "/assets/images/gallery/gallery4.jpg",
    title: "Desert Run",
    page: "rides",
  },
  {
    id: "gallery5",
    src: "/assets/images/gallery/gallery5.jpg",
    title: "Himalayan Scale",
    page: "rides",
  },
  {
    id: "gallery6",
    src: "/assets/images/gallery/gallery6.jpg",
    title: "Golden Hour Viewpoint",
    page: "rides",
  },
];

export default function Rides() {
  return (
    <>
      <RidesHero RidesHeroBg={RidesHeroBg} />
      <RidesGrid rides={rides} />
      <GalleryPreview galleryPreviewImages={galleryPreviewImages} className="bg-gradient-to-b from-[var(--color-surface)] to-black" />
    </>
  )
}
