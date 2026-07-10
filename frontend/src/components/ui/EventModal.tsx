import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { Event } from "../../types/event";
import { useUser } from "@/context/UserContext";
import Cliploader from "./Cliploader";

interface EventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  localEvent: Event;
  event: Event;
  handleActionTrigger: (e: React.MouseEvent) => void;
  isAttendanceProcessing: boolean;
  formattedDate: string;
}

const typeColors: Record<Event["type"], string> = {
  Ride: "var(--color-highlight)",
  Meetup: "#38bdf8",
  Workshop: "#c084fc",
  Social: "#34d399",
};

export default function EventModal({
  isOpen,
  setIsOpen,
  localEvent,
  event,
  handleActionTrigger,
  isAttendanceProcessing,
  formattedDate,
}: EventModalProps) {
  const { userDetails } = useUser();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={() => setIsOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsOpen(false);
      }}
    >
      <div
        className="relative bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div 
          className="relative h-52 sm:h-64 flex-shrink-0 rounded-t-2xl overflow-hidden"
          style={!localEvent.image ? {
            background: `linear-gradient(135deg, ${typeColors[event.type]}30 0%, var(--color-bg) 100%)`,
          } : undefined}
        >
          {localEvent.image && (
            <img
              src={localEvent.image}
              alt={localEvent.title}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          <button
            type="button"
            aria-label="Close event details"
            className="absolute top-4 right-4 z-20 size-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            <span
              className="inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border"
              style={{ color: typeColors[event.type], borderColor: typeColors[event.type] }}
            >
              {event.type}
            </span>
            {localEvent.past && (
              <span className="inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/70">
                Past Event
              </span>
            )}
            {localEvent.spotsLeft === 0 && !localEvent.past && (
              <span className="inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-red-500 text-red-500">
                Full
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-4 z-20 flex items-end flex-wrap justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-[var(--font-heading)] font-black text-xl sm:text-2xl lg:text-3xl text-white leading-tight">
                {localEvent.title}
              </h2>
            </div>
            
            {!localEvent.past ? (
              <button
                type="button"
                className={`flex-shrink-0 px-2 py-1 text-xs md:px-4 md:py-2 cursor-pointer transition-colors duration-300 uppercase font-semibold tracking-widest ${
                  localEvent.isJoined
                    ? "rounded bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30"
                    : localEvent.spotsLeft === 0
                    ? "rounded bg-gray-500/20 text-gray-400 border border-gray-500/50 cursor-not-allowed"
                    : "btn-primary"
                }`}
                onClick={handleActionTrigger}
                disabled={!localEvent.isJoined && localEvent.spotsLeft === 0}
              >
                {localEvent.isJoined ? "Withdraw from Event" : localEvent.spotsLeft === 0 ? "Event Full" : "Join This Event"}
              </button>
            ) : (
              <span className="flex-shrink-0 inline-flex items-center px-2 py-1 text-xs md:px-4 md:py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/60 font-[var(--font-accent)] text-[0.6rem] font-semibold tracking-widest uppercase">
                Completed
              </span>
            )}
            
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div>
            <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">
              Signed Up
            </span>
            <span className="font-[var(--font-heading)] text-5xl font-black text-[var(--color-accent)] leading-none">
              {localEvent.spots - localEvent.spotsLeft}{" "}
              <span className="text-xl text-[var(--color-primary)] font-[var(--font-body)] font-medium">
                / {localEvent.spots} spots
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-[var(--color-border)]/30 py-5">
            <div>
              <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">
                Date
              </span>
              <span className="font-[var(--font-body)] text-primary font-medium text-sm">
                {formattedDate}
              </span>
            </div>
            <div>
              <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">
                Time
              </span>
              <span className="font-[var(--font-body)] text-primary font-medium text-sm">
                {localEvent.time || "N/A"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">
                Location
              </span>
              <span className="font-[var(--font-body)] text-primary font-medium text-sm">
                {localEvent.location || "N/A"}
              </span>
            </div>
          </div>

          <div>
            <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-2">
              Description
            </span>
            <p className="font-[var(--font-body)] text-secondary leading-relaxed text-sm">
              {localEvent.description || "No description provided."}
            </p>
          </div>

          {/* Administrative Roster List */}
          {userDetails?.role !== "rider" && localEvent.attendees && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h4 className="font-[var(--font-heading)] text-lg text-white">
                  Enrolled Attendees
                </h4>
                
                {/* Search Input for Admin/Crew */}
                <div className="relative w-full sm:w-64">
                  <input
                    id="roster-search"
                    name="rosterSearch"
                    type="text"
                    autoComplete="off"
                    placeholder="Search attendees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-[var(--color-border)]/50 rounded-lg pl-3 pr-8 py-2 text-sm text-white placeholder-secondary focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors p-1 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {(() => {
                if (localEvent.attendees.length === 0) {
                  return (
                    <p className="text-sm text-secondary italic">
                      No attendees have joined yet.
                    </p>
                  );
                }

                const filteredAttendees = localEvent.attendees.filter((a) =>
                  a.username.toLowerCase().includes(debouncedQuery.toLowerCase())
                );

                if (filteredAttendees.length === 0) {
                  return (
                    <p className="text-sm text-secondary italic">
                      No attendees found matching "{debouncedQuery}".
                    </p>
                  );
                }

                return (
                  <div className="border border-[var(--color-border)]/30 rounded-xl overflow-hidden bg-black/20">
                    {filteredAttendees.map((a, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/profile/${a.username}`);
                        }}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors ${
                          idx !== filteredAttendees.length - 1
                            ? "border-b border-[var(--color-border)]/20"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-medium text-white">
                          {a.username}
                        </span>
                        <span className="text-[0.65rem] text-[var(--color-accent)] uppercase tracking-wider">
                          View Profile &rarr;
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* In-flight execution overlay */}
        {isAttendanceProcessing && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <Cliploader size={40} color="var(--color-primary)" />
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
