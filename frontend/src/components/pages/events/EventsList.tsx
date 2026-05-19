import { Event, EventType } from "@/types/event";
import { useState } from "react";
import JoinFormModal from "@/components/ui/JoinFormModal";

const typeColors: Record<EventType, string> = {
  Ride: "var(--color-highlight)",
  Meetup: "#38bdf8",
  Workshop: "#c084fc",
  Social: "#34d399",
};

interface EventsListProps {
  events: Event[];
}
export default function EventsList({ events }: EventsListProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const targetDetails = selectedEvent
    ? {
        id: selectedEvent.id,
        title: selectedEvent.title,
        date: new Date(selectedEvent.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: selectedEvent.time,
        location: selectedEvent.location,
        type: "event" as const,
      }
    : null;
  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
    };
  }

  return (
    <section
      id="events-list"
      className="py-24 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]"
    >
      {/* Decorative premium ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        {/* Section header — centered */}
        <div className="mb-12 lg:mb-20 text-center max-w-4xl mx-auto">
          <h2 className="section-heading">Upcoming Gatherings</h2>
          <span className="section-subheading">Calendar</span>
        </div>

        <div className="space-y-6 md:space-y-8 relative z-10">
          {events.map((event) => {
            const { day, month, weekday } = formatDate(event.date);
            const fillPercent =
              ((event.spots - event.spotsLeft) / event.spots) * 100;
            const isAlmostFull = event.spotsLeft <= 5;

            return (
              <div
                key={event.id}
                className="event-item group flex flex-col lg:flex-row items-stretch lg:items-center gap-6 p-6 md:p-8 transition-all duration-300 rounded-3xl bg-[var(--color-surface)]/20 backdrop-blur-xl border border-[var(--color-border)]/30 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface)]/35 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 z-10"
              >
                {/* Visual side glow accent on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: typeColors[event.type] }}
                />

                {/* Left: Date Block */}
                <div className="flex-shrink-0 flex lg:flex-col items-center justify-center gap-3 lg:gap-0 w-full lg:w-28 h-16 lg:h-28 rounded-2xl bg-black/45 border border-white/5 shadow-inner">
                  <span
                    className="font-heading font-black text-4xl lg:text-5xl leading-none"
                    style={{ color: typeColors[event.type] }}
                  >
                    {day}
                  </span>
                  <span className="font-accent text-xs font-bold uppercase tracking-[0.2em] lg:mt-1.5 text-[var(--color-text-secondary)]">
                    {month}
                  </span>
                </div>

                {/* Middle: Info Content */}
                <div className="flex-grow flex flex-col justify-center min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full border bg-transparent"
                      style={{
                        color: typeColors[event.type],
                        borderColor: typeColors[event.type] + "40",
                      }}
                    >
                      {event.type}
                    </span>
                    {isAlmostFull && (
                      <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full border border-red-500/50 text-red-500 bg-red-500/10 animate-pulse">
                        Almost Full
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-accent font-bold text-xl md:text-2xl mb-3 text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-200 leading-snug">
                    {event.title}
                  </h3>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2.5 font-accent text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 opacity-70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 opacity-70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {weekday}, {event.time}
                    </span>
                  </div>
                </div>

                {/* Right: Progress Meter & RSVP Button */}
                <div className="flex-shrink-0 flex flex-col md:flex-row lg:flex-col items-stretch md:items-center lg:items-end justify-between lg:justify-center gap-6 w-full lg:w-72 lg:pl-6 lg:border-l border-[var(--color-border)]/20">
                  {/* Spots Gauge */}
                  <div className="flex-grow w-full md:max-w-xs lg:max-w-none">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-accent text-[0.65rem] uppercase tracking-[0.1em] font-semibold text-[var(--color-text-secondary)]">
                        Spots Filled
                      </span>
                      <span className="font-accent text-xs font-bold text-[var(--color-text-primary)]">
                        {event.spots - event.spotsLeft} / {event.spots} (
                        {Math.round(fillPercent)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-black/40 border border-white/5 p-[1px]">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_currentColor]"
                        style={{
                          width: `${fillPercent}%`,
                          backgroundColor: isAlmostFull
                            ? "#ef4444"
                            : "var(--color-highlight)",
                          color: isAlmostFull
                            ? "#ef4444"
                            : "var(--color-highlight)",
                        }}
                      />
                    </div>
                    <p className="mt-1.5 font-accent text-[0.68rem] text-[var(--color-text-secondary)] flex items-center gap-1.5">
                      {isAlmostFull ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      )}
                      {event.spotsLeft} slots left. Grab yours now!
                    </p>
                  </div>

                  {/* RSVP Action */}
                  <div className="w-full md:w-auto lg:w-full">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="btn-primary w-full block text-center px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-all duration-300 hover:shadow-[0_4px_20px_rgba(248,250,252,0.2)] hover:scale-[1.02] cursor-pointer"
                    >
                      RSVP Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {targetDetails && (
        <JoinFormModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          target={targetDetails}
        />
      )}
    </section>
  );
}
