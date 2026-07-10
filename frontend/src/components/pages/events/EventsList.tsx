import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPencil, FaPlus } from "react-icons/fa6";
import EventCard from "@/components/ui/EventCard";
import EventForm from "./EventForm";
import { Event } from "@/types/event";
import { useUser } from "@/context/UserContext";

interface EventsListProps {
  events: Event[];
  onEventCreated?: (event: Event) => void;
  onEventUpdated?: (event: Event) => void;
  onEventDeleted?: (id: string) => void;
}

type EventFilter = "all" | "upcoming" | "past";

export default function EventsList({ 
  events,
  onEventCreated,
  onEventUpdated,
  onEventDeleted 
}: EventsListProps) {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { userDetails } = useUser();
  const isPrivileged = userDetails?.role === "admin" || userDetails?.role === "crew";

  const filtered = events.filter((e) => {
    if (filter === "upcoming") return !e.past;
    if (filter === "past") return e.past;
    return true;
  });

  function handleCancelEditing() {
    setIsEditing(false);
  }

  useEffect(() => {
    if (isAddFormOpen || editingEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAddFormOpen, editingEvent]);

  return (
    <section
      id="events-grid"
      className={`${isPrivileged ? "py-16" : "py-12"} lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-[var(--color-surface)]`}
    >
      {/* Decorative premium ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] size-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0" />

      {/* Pencil FAB */}
      {isPrivileged && !isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          title="Manage Events"
          className="absolute top-4 right-4 z-30 btn-admin-edit"
        >
          <FaPencil size={18} />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="mb-10 lg:mb-16 text-center max-w-4xl mx-auto">
          <h2 className="section-heading">Upcoming Gatherings</h2>
          <p className="section-subheading">Calendar</p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-10 lg:mb-16 relative z-10">
          <div className="inline-flex p-1 rounded-full bg-[var(--color-surface)]/30 backdrop-blur-xl border border-[var(--color-border)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {(["all", "upcoming", "past"] as EventFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`relative font-accent font-bold text-xs uppercase tracking-[0.12em] px-6 py-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                  filter === f
                    ? "text-[var(--color-bg)] z-10"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] z-10"
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="active-event-tab"
                    className="absolute inset-0 bg-[var(--color-primary)] rounded-full -z-10 shadow-[0_4px_12px_rgba(248,250,252,0.2)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isEditing && (
          <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest mb-6">
            Editing Events
          </p>
        )}

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <EventCard 
                  event={event} 
                  isEditing={isEditing}
                  onDelete={onEventDeleted}
                  onEditClick={(e) => setEditingEvent(e)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {isEditing && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => setIsAddFormOpen(true)}
                className="group relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer aspect-[4/5] w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-primary)]/50 bg-[var(--color-bg)]/30 hover:bg-[var(--color-bg)]/60 transition-all duration-300 hover:border-[var(--color-primary)]/80"
              >
                <div className="size-14 rounded-full bg-[var(--color-primary)]/15 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[var(--color-primary)]/25 transition-all duration-300">
                  <FaPlus size={22} className="text-[var(--color-primary)]" />
                </div>
                <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest font-[var(--font-accent)]">
                  Add Event
                </span>
                <span className="text-[var(--color-text-secondary)] text-xs mt-1 font-[var(--font-accent)]">
                  Create a new community gathering
                </span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {filtered.length === 0 && !isEditing && (
          <div className="text-center py-20">
            <p className="font-accent text-base text-[var(--color-text-secondary)]">
              No events in this category yet.
            </p>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-3 justify-end mt-8">
            <button
              type="button"
              onClick={handleCancelEditing}
              className="px-6 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {isAddFormOpen && (
        <EventForm
          onSuccess={(newEvent) => {
            onEventCreated?.(newEvent);
            setIsAddFormOpen(false);
          }}
          onClose={() => setIsAddFormOpen(false)}
        />
      )}

      {editingEvent && (
        <EventForm
          editEvent={editingEvent}
          onSuccess={(updatedEvent) => {
            onEventUpdated?.(updatedEvent);
            setEditingEvent(null);
          }}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </section>
  );
}
