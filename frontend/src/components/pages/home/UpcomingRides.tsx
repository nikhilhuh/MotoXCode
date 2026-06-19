import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import RideCard from '../../ui/RideCard'
import { Ride } from '@/types/ride'

interface UpcomingRidesProps {
  upcomingRidesData: Ride[];
}

export default function UpcomingRides({ upcomingRidesData }: UpcomingRidesProps) {

  return (
    <section 
      className="py-12 lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }}
        viewport={{ once: true, margin: "-50px" }}
        className="w-full relative z-10"
      >
      {/* Decorative ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

      {/* Section header — centered */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
        <h2 className="section-heading">Upcoming Rides</h2>
        <p className="section-subheading text-center">
          Find your next adventure. The best roads are meant to be shared.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {upcomingRidesData.map((ride) => (
            <RideCard key={ride._id} ride={ride} />
          ))}
        </div>
      </div>

      {/* View All — centered below grid */}
      <div className="flex justify-center pt-4 pb-4 relative z-10">
        <Link to="/rides" className="btn-outline px-8 py-3 text-sm">
          View All Rides
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
          </svg>
        </Link>
      </div>
      </motion.div>
    </section>
  )
}
