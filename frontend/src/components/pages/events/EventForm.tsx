import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaTimes, FaImage } from "react-icons/fa";
import type { Event } from "@/types/event";
import { eventsService } from "@/services/events.service";
import { compressImage } from "@/services/imageCompression.service";
import { useFeedback } from "@/context/FeedbackContext";
import Cliploader from "@/components/ui/Cliploader";
import axios from "axios";
import FormField from "@/components/ui/FormField";

// Helper function equivalent to inputCls in RideForm
function inputCls(error?: string) {
  return `w-full bg-[var(--color-bg)]/50 border ${
    error ? "border-red-500/50" : "border-[var(--color-border)]/50 focus:border-[var(--color-primary)]"
  } rounded-xl px-4 py-2.5 text-sm font-[var(--font-body)] text-[var(--color-text-primary)] placeholder-white/20 transition-all outline-none focus:ring-1 focus:ring-[var(--color-primary)]`;
}

interface EventFormState {
  title: string;
  type: Event["type"];
  location: string;
  date: string;
  time: string;
  spots: number;
  description: string;
  past: boolean;
  imageFile: File | null;
  imagePreview: string;
}

interface EventFormErrors {
  title?: string;
  type?: string;
  location?: string;
  date?: string;
  time?: string;
  spots?: string;
  description?: string;
  image?: string;
}

interface EventFormProps {
  editEvent?: Event;
  onSuccess: (event: Event) => void;
  onClose: () => void;
}

const EVENT_TYPE_META: Record<Event["type"], { color: string }> = {
  Ride: { color: "text-[var(--color-highlight)]" },
  Meetup: { color: "text-[#38bdf8]" },
  Workshop: { color: "text-[#c084fc]" },
  Social: { color: "text-[#34d399]" },
};

function validateField(
  field: keyof EventFormErrors,
  value: string | number | boolean | File | null,
  isEditMode: boolean,
): string | undefined {
  switch (field) {
    case "title":
      return typeof value === "string" && value.trim().length >= 3
        ? undefined
        : "Title must be at least 3 characters.";
    case "location":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Location is required.";
    case "date": {
      if (typeof value !== "string" || value.trim() === "")
        return "Date is required.";
      const d = new Date(value);
      return isNaN(d.getTime()) ? "Enter a valid date." : undefined;
    }
    case "time":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Time is required (e.g. 06:00 AM).";
    case "type":
      return typeof value === "string" &&
        ["Ride", "Meetup", "Workshop", "Social"].includes(value)
        ? undefined
        : "Select a valid event type.";
    case "spots":
      return typeof value === "number" && value > 0
        ? undefined
        : "Spots must be greater than 0.";
    case "description":
      return typeof value === "string" && value.trim().length >= 10
        ? undefined
        : "Description must be at least 10 characters.";
    case "image":
      return !isEditMode && value === null
        ? "A banner image is required."
        : undefined;
    default:
      return undefined;
  }
}

function buildInitialState(editEvent?: Event): EventFormState {
  if (editEvent) {
    // If the event was created without a description initially, handle it gracefully
    return {
      title: editEvent.title,
      type: editEvent.type,
      location: editEvent.location,
      date: editEvent.date.split('T')[0], // format to YYYY-MM-DD for input type="date" if it's ISO
      time: editEvent.time,
      spots: editEvent.spots,
      description: editEvent.description || "",
      past: editEvent.past || false,
      imageFile: null,
      imagePreview: editEvent.image || "",
    };
  }
  return {
    title: "",
    type: "Meetup",
    location: "",
    date: "",
    time: "",
    spots: 20,
    description: "",
    past: false,
    imageFile: null,
    imagePreview: "",
  };
}

export default function EventForm({
  editEvent,
  onSuccess,
  onClose,
}: EventFormProps) {
  const isEditMode = Boolean(editEvent);
  const { showSuccess, showError } = useFeedback();
  const initialStateRef = useRef<EventFormState>(buildInitialState(editEvent));

  const [form, setForm] = useState<EventFormState>(() => buildInitialState(editEvent));
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string>("");

  const hasChanges: boolean =
    !isEditMode ||
    form.title !== initialStateRef.current.title ||
    form.type !== initialStateRef.current.type ||
    form.location !== initialStateRef.current.location ||
    form.date !== initialStateRef.current.date ||
    form.time !== initialStateRef.current.time ||
    form.spots !== initialStateRef.current.spots ||
    form.description !== initialStateRef.current.description ||
    form.past !== initialStateRef.current.past ||
    form.imageFile !== null;

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSaving, onClose]);

  const handleChange = useCallback(
    (field: keyof EventFormState, value: EventFormState[typeof field]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      const errorKey = field as keyof EventFormErrors;
      const err = validateField(errorKey, value as any, isEditMode);
      setErrors((prev) => ({ ...prev, [errorKey]: err }));
    },
    [isEditMode],
  );

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsCompressing(true);
      try {
        const { file: compressed, previewUrl } = await compressImage(file);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = previewUrl;
        setForm((prev) => ({
          ...prev,
          imageFile: compressed,
          imagePreview: previewUrl,
        }));
        setErrors((prev) => ({ ...prev, image: undefined }));
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Backend operation failed.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
        setIsCompressing(false);
      }
    },
    [showError],
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: EventFormErrors = {
      title: validateField("title", form.title, isEditMode),
      location: validateField("location", form.location, isEditMode),
      date: validateField("date", form.date, isEditMode),
      type: validateField("type", form.type, isEditMode),
      time: validateField("time", form.time, isEditMode),
      spots: validateField("spots", form.spots, isEditMode),
      description: validateField("description", form.description, isEditMode),
      image: validateField("image", form.imageFile, isEditMode),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === undefined);
  }, [form, isEditMode]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateAll()) return;

      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append("title", form.title.trim());
        formData.append("location", form.location.trim());
        formData.append("date", form.date);
        formData.append("type", form.type);
        formData.append("time", form.time.trim());
        formData.append("spots", String(form.spots));
        formData.append("description", form.description.trim());
        formData.append("past", String(form.past));

        if (form.imageFile) {
          formData.append("image", form.imageFile, form.imageFile.name);
        }

        let savedEvent: Event;
        if (isEditMode && editEvent) {
          savedEvent = await eventsService.updateEvent(editEvent._id, formData);
          showSuccess("Event updated successfully!");
        } else {
          savedEvent = await eventsService.createEvent(formData);
          showSuccess("Event created successfully!");
        }

        onSuccess(savedEvent);
        onClose();
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "An error occurred. Please try again.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
        setIsSaving(false);
      }
    },
    [form, isEditMode, editEvent, validateAll, onSuccess, onClose, showSuccess, showError],
  );

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        className="relative w-full max-w-2xl max-h-[96vh] sm:max-h-[92vh] flex flex-col bg-[var(--color-section)] border border-[var(--color-border)]/50 rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {isSaving && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm bg-black/40">
            <Cliploader size={40} color="#f8fafc" />
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary)] font-[var(--font-accent)] tracking-widest uppercase">
              {isEditMode ? "Saving Changes…" : "Creating Event…"}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]/40 flex-shrink-0">
          <div>
            <p className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-1">
              {isEditMode ? "Edit Event" : "New Event"}
            </p>
            <h2
              id="event-form-title"
              className="font-[var(--font-heading)] font-black text-lg md:text-2xl text-[var(--color-primary)] uppercase"
            >
              {isEditMode ? "Update Event Document" : "Create Event Document"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="hidden md:block p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all duration-200 cursor-pointer disabled:opacity-40"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Image Banner Preview */}
        <div
          className={`relative h-30 md:h-40 flex-shrink-0 bg-[var(--color-surface)] cursor-pointer group overflow-hidden ${
            !isEditMode && !form.imagePreview
              ? "border-2 border-dashed border-red-500/60"
              : form.imagePreview
                ? ""
                : "border-2 border-dashed border-[var(--color-border)]/50"
          }`}
          onClick={() => !isSaving && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              fileInputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          aria-label="Select banner image"
        >
          {!isEditMode && !form.imagePreview && (
            <span className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[0.6rem] font-semibold font-[var(--font-accent)] uppercase tracking-wide">
              Required
            </span>
          )}

          {form.imagePreview ? (
            <>
              <img
                src={form.imagePreview}
                alt="Event banner preview"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {isCompressing ? (
                    <Cliploader size={24} color="#f8fafc" />
                  ) : (
                    <>
                      <FaImage size={24} />
                      <span className="text-xs font-semibold tracking-wide">
                        Change Image
                      </span>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
              {isCompressing ? (
                <Cliploader size={28} color="currentColor" />
              ) : (
                <>
                  <FaImage size={26} />
                  <span className="text-sm font-semibold font-[var(--font-accent)]">
                    Click to upload banner image
                  </span>
                  <span className="text-xs opacity-60">
                    Max 5 MB · auto-compressed to 1920 px
                  </span>
                </>
              )}
            </div>
          )}
          {errors.image && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <span className="text-[0.65rem] text-red-400 bg-black/70 px-3 py-1 rounded-full">
                {errors.image}
              </span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelect(file);
            e.target.value = "";
          }}
        />

        {/* Form Body */}
        <form
          id="event-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-5"
        >
          <FormField htmlFor="event-title" label="Event Title" error={errors.title} required>
            <input
              id="event-title"
              name="eventTitle"
              type="text"
              placeholder="e.g. Annual MotoX Meetup"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={inputCls(errors.title)}
            />
          </FormField>

          <FormField label="Event Type" error={errors.type} required>
            <div className="flex flex-wrap gap-2">
              {(["Ride", "Meetup", "Workshop", "Social"] as Event["type"][]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange("type", t)}
                  className={`flex-1 min-w-[5rem] py-2.5 rounded-xl text-xs font-bold font-[var(--font-accent)] tracking-wide uppercase transition-all duration-200 border cursor-pointer ${
                    form.type === t
                      ? `bg-[var(--color-surface)] border-[var(--color-primary)] ${EVENT_TYPE_META[t].color}`
                      : "bg-transparent border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:border-[var(--color-border)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField htmlFor="event-location" label="Location" error={errors.location} required>
              <input
                id="event-location"
                name="eventLocation"
                type="text"
                placeholder="e.g. Central Park"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className={inputCls(errors.location)}
              />
            </FormField>
            <FormField htmlFor="event-date" label="Date" error={errors.date} required>
              <input
                id="event-date"
                name="eventDate"
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={inputCls(errors.date)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField htmlFor="event-time" label="Time" error={errors.time} required>
              <input
                id="event-time"
                name="eventTime"
                type="text"
                placeholder="e.g. 05:30 PM"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={inputCls(errors.time)}
              />
            </FormField>
            <FormField htmlFor="event-spots" label="Total Spots" error={errors.spots} required>
              <input
                id="event-spots"
                name="eventSpots"
                type="number"
                min={1}
                value={form.spots}
                onChange={(e) => handleChange("spots", parseInt(e.target.value, 10) || 0)}
                className={inputCls(errors.spots)}
              />
            </FormField>
          </div>

          <FormField htmlFor="event-description" label="Description" error={errors.description} required>
            <textarea
              id="event-description"
              name="eventDescription"
              rows={4}
              placeholder="Describe the event..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${inputCls(errors.description)} resize-none`}
            />
          </FormField>

          {/* Past toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="event-past-toggle"
              onClick={() => setForm((prev) => ({ ...prev, past: !prev.past }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${
                form.past
                  ? "bg-[var(--color-highlight)]"
                  : "bg-[var(--color-border)]"
              }`}
              role="switch"
              aria-checked={form.past}
            >
              <span
                className={`inline-block size-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                  form.past ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label
              htmlFor="event-past-toggle"
              className="text-sm font-[var(--font-accent)] font-semibold text-[var(--color-text-secondary)] cursor-pointer select-none"
            >
              Mark as Past Event
            </label>
          </div>
        </form>

        <div className="flex gap-3 justify-end px-6 py-5 border-t border-[var(--color-border)]/40 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !hasChanges}
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] transition-all hover:brightness-110 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isEditMode ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
