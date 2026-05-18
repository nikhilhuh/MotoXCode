import EventsHero from '../components/pages/events/EventsHero'
import EventsList from '../components/pages/events/EventsList'
import EventsHeroBg from '/assets/images/events/eventsHero.png'

export default function Events() {
  return (
    <>
      <EventsHero EventsHeroBg={EventsHeroBg} />
      <EventsList />
    </>
  )
}
