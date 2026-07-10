import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPencil, FaTrash } from "react-icons/fa6";
import type { Event } from "../../types/event";
import ConfirmModal from "./ConfirmModal";
import ActionModal from "./ActionModal";
import EventModal from "./EventModal";
import { eventsService } from "@/services/events.service";
import { useFeedback } from "@/context/FeedbackContext";
import { useUser } from "@/context/UserContext";
import Cliploader from "./Cliploader";
import axios from "axios";

interface EventCardProps {
  event: Event;
  /** When true, edit and delete buttons are rendered always-visible (no hover gate). */
  isEditing?: boolean;
  onDelete?: (id: string) => void;
  /** Opens the edit form for this specific event — triggered by the pencil button. */
  onEditClick?: (event: Event) => void;
}

const typeColors: Record<Event["type"], string> = {
  Ride: "var(--color-highlight)",
  Meetup: "#38bdf8",
  Workshop: "#c084fc",
  Social: "#34d399",
};

export default function EventCard({
  event,
  isEditing = false,
  onDelete,
  onEditClick,
}: EventCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // State for attendance
  const [isGuestPromptOpen, setIsGuestPromptOpen] = useState<boolean>(false);
  const [isConfirmJoinOpen, setIsConfirmJoinOpen] = useState<boolean>(false);
  const [isConfirmWithdrawOpen, setIsConfirmWithdrawOpen] = useState<boolean>(false);
  const [isAttendanceProcessing, setIsAttendanceProcessing] = useState<boolean>(false);

  // Real UI state derived from network responses
  const [localEvent, setLocalEvent] = useState<Event>(event);

  const { showSuccess, showError } = useFeedback();
  const { userDetails } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalEvent(event);
  }, [event]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
    };
  }

  const { day, month } = formatDate(localEvent.date);
  const isFull = localEvent.spotsLeft === 0;

  const formattedDate = new Date(localEvent.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleConfirmDelete(): Promise<void> {
    setIsDeleting(true);
    try {
      await eventsService.deleteEvent(event._id);
      showSuccess("Event deleted successfully.");
      onDelete?.(event._id);
      setIsConfirmDeleteOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to delete event.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  const handleActionTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userDetails) {
      setIsGuestPromptOpen(true);
    } else if (!localEvent.isJoined) {
      setIsConfirmJoinOpen(true);
    } else {
      setIsConfirmWithdrawOpen(true);
    }
  };

  const executeJoinEvent = async () => {
    setIsAttendanceProcessing(true);
    try {
      const response = await eventsService.joinEvent(localEvent._id);
      if (response.data) {
        setLocalEvent(response.data as any);
      }
      showSuccess("Successfully joined the event!");
      setIsConfirmJoinOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to join the event.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsAttendanceProcessing(false);
    }
  };

  const executeWithdrawEvent = async () => {
    setIsAttendanceProcessing(true);
    try {
      const response = await eventsService.withdrawFromEvent(localEvent._id);
      if (response.data) {
        setLocalEvent(response.data as any);
      }
      showSuccess("You have withdrawn from the event.");
      setIsConfirmWithdrawOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to withdraw from the event.");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsAttendanceProcessing(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => !isEditing && setIsOpen(true)}
          className={`relative overflow-hidden rounded-2xl w-full transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.4)] aspect-[4/5] block text-left p-0 border-none appearance-none bg-transparent ${
            isEditing
              ? "cursor-default"
              : "cursor-pointer hover:-translate-y-2 group"
          }`}
        >
          {/* Background Image or Fallback */}
          {localEvent.image ? (
            <img
              src={localEvent.image}
              alt={localEvent.title}
              className={`absolute inset-0 size-full object-cover transition-transform duration-700 ${!isEditing ? "group-hover:scale-105" : ""}`}
            />
          ) : (
            <div
              className={`absolute inset-0 size-full transition-transform duration-700 ${!isEditing ? "group-hover:scale-105" : ""}`}
              style={{
                background: `linear-gradient(135deg, ${typeColors[localEvent.type]}60 0%, var(--color-bg) 100%)`,
              }}
            />
          )}

          {/* Dark gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-[#0F0F0F]/10 transition-opacity duration-500 ${!isEditing ? "opacity-90 group-hover:opacity-100" : "opacity-80"}`}
          />

          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
            <span
              className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-current"
              style={{ color: typeColors[localEvent.type] }}
            >
              {localEvent.type}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-secondary">
              {localEvent.past ? "Past" : "Upcoming"}
            </span>
            {isFull && !localEvent.past && (
              <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-500">
                Full
              </span>
            )}
          </div>
          
          {/* Calendar visual (Top Right offset) */}
          <div className="absolute top-16 right-5 flex flex-col items-center justify-center gap-0.5 w-16 h-16 rounded-xl bg-black/45 border border-white/10 shadow-inner z-10">
             <span
                className="font-heading font-black text-2xl leading-none"
                style={{ color: typeColors[localEvent.type] }}
              >
                {day}
              </span>
              <span className="font-accent text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                {month}
              </span>
          </div>

          {/* Content aligned to bottom */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end">
            <h3
              className={`font-heading font-black text-2xl md:text-3xl mb-1 leading-tight transition-colors duration-300 text-primary ${!isEditing ? "group-hover:text-white" : ""}`}
            >
              {localEvent.title}
            </h3>

            <p className="font-heading font-black text-xl text-accent mb-4">
              {localEvent.spots - localEvent.spotsLeft}{" "}
              <span className="text-xs font-accent tracking-[0.15em] text-secondary uppercase font-semibold">
                / {localEvent.spots} Attendees
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-accent text-secondary">
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                {localEvent.location}
              </span>
              <span className="flex items-center gap-1.5">
                 <svg
                  width="14"
                  height="14"
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
                {localEvent.time}
              </span>
            </div>
          </div>
        </button>

        {/* ── Admin / Crew action overlay — always visible when isEditing ── */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/20 z-20 flex items-start justify-end p-3 rounded-2xl pointer-events-none">
            <div className="flex gap-2 pointer-events-auto mt-12">
              <button
                type="button"
                aria-label={`Edit event: ${event.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick?.(event);
                }}
                className="size-10 rounded-full bg-[var(--color-surface)]/90 hover:bg-[var(--color-primary)] text-white hover:text-[var(--color-bg)] flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
                title="Edit Event"
              >
                <FaPencil size={13} />
              </button>
              <button
                type="button"
                aria-label={`Delete event: ${event.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmDeleteOpen(true);
                }}
                disabled={isDeleting}
                className="size-10 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 disabled:opacity-50"
                title="Delete Event"
              >
                {isDeleting ? (
                  <Cliploader size={13} color="white" />
                ) : (
                  <FaTrash size={13} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <EventModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        localEvent={localEvent}
        event={event}
        handleActionTrigger={handleActionTrigger}
        isAttendanceProcessing={isAttendanceProcessing}
        formattedDate={formattedDate}
      />

      <ActionModal
        isOpen={isGuestPromptOpen}
        onClose={() => setIsGuestPromptOpen(false)}
        onConfirm={() => {
          setIsGuestPromptOpen(false);
          navigate("/join");
        }}
        title="Authentication Required"
        message="Only registered members can join this event."
        confirmText="Join"
        actionType="info"
      />

      <ActionModal
        isOpen={isConfirmJoinOpen}
        onClose={() => setIsConfirmJoinOpen(false)}
        onConfirm={executeJoinEvent}
        title="Confirm Attendance"
        message="Are you sure you want to join this event?"
        confirmText="Join Event"
        actionType="primary"
      />

      <ActionModal
        isOpen={isConfirmWithdrawOpen}
        onClose={() => setIsConfirmWithdrawOpen(false)}
        onConfirm={executeWithdrawEvent}
        title="Withdraw from Event"
        message="Are you sure you want to withdraw from this event?"
        confirmText="Withdraw"
        actionType="danger"
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message={`Are you sure you want to permanently delete "${event.title}"?`}
        confirmText="Delete"
      />
    </>
  );
}
