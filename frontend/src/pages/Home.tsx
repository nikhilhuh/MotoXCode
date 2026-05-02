import Hero from '../components/pages/home/Hero'
import Stats from '../components/pages/home/Stats'
import Values from '../components/pages/home/Values'
import UpcomingRides from '../components/pages/home/UpcomingRides'
import MemberSpotlight from '../components/pages/home/MemberSpotlight'
import GalleryPreview from '../components/pages/home/GalleryPreview'
import CTA from '../components/pages/home/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Values />
      <UpcomingRides />
      <MemberSpotlight />
      <GalleryPreview />
      <CTA />
    </>
  )
}
