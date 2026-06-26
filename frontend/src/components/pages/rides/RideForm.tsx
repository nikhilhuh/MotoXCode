import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaImage } from "react-icons/fa";
import type { Ride } from "@/types/ride";
import { ridesService } from "@/services/rides.service";
import { compressImage } from "@/services/imageCompression.service";
import { useFeedback } from "@/context/FeedbackContext";
import Cliploader from "@/components/ui/Cliploader";
import axios from "axios";

// ─── Form State Schema ────────────────────────────────────────────────────────

interface RideFormState {
  title: string;
  locationFrom: string;
  locationTo: string;
  date: string;
  distance: string;
  routeType: Ride["routeType"];
  meetupTime: string;
  meetupLocation: string;
  membersJoined: number;
  description: string;
  duration: string;
  past: boolean;
  imageFile: File | null;
  imagePreview: string;
}

// ─── Validation Error Schema ──────────────────────────────────────────────────

interface RideFormErrors {
  title?: string;
  locationFrom?: string;
  locationTo?: string;
  date?: string;
  distance?: string;
  routeType?: string;
  meetupTime?: string;
  meetupLocation?: string;
  description?: string;
  duration?: string;
  image?: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

interface RideFormProps {
  /** If provided, the form operates in Edit mode pre-populated with this ride's data. */
  editRide?: Ride;
  onSuccess: (ride: Ride) => void;
  onClose: () => void;
}

// ─── Route Type Metadata ──────────────────────────────────────────────────────

const ROUTE_TYPE_META: Record<
  Ride["routeType"],
  { label: string; hint: string; color: string }
> = {
  "Inter-state": {
    label: "Inter-state",
    hint: "Cross-state highway expeditions spanning multiple Indian states.",
    color: "text-[#f87171]",
  },
  "Inter-city": {
    label: "Inter-city",
    hint: "City-to-city runs connecting two distinct urban destinations.",
    color: "text-[#facc15]",
  },
  "Intra-city": {
    label: "Intra-city",
    hint: "Local rides entirely within the same city or metropolitan area.",
    color: "text-[#4ade80]",
  },
};

// ─── Validation Logic ─────────────────────────────────────────────────────────

function validateField(
  field: keyof RideFormErrors,
  value: string | number | boolean | File | null,
  isEditMode: boolean
): string | undefined {
  switch (field) {
    case "title":
      return typeof value === "string" && value.trim().length >= 3
        ? undefined
        : "Title must be at least 3 characters.";
    case "locationFrom":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Departure location is required.";
    case "locationTo":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Destination location is required.";
    case "date": {
      if (typeof value !== "string" || value.trim() === "") return "Date is required.";
      const d = new Date(value);
      return isNaN(d.getTime()) ? "Enter a valid date." : undefined;
    }
    case "distance":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Distance is required (e.g. 320 km).";
    case "routeType":
      return typeof value === "string" &&
        ["Inter-state", "Inter-city", "Intra-city"].includes(value)
        ? undefined
        : "Select a valid route type.";
    case "meetupTime":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Meetup time is required (e.g. 06:00 AM).";
    case "meetupLocation":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Meetup location is required.";
    case "description":
      return typeof value === "string" && value.trim().length >= 10
        ? undefined
        : "Description must be at least 10 characters.";
    case "duration":
      return typeof value === "string" && value.trim().length > 0
        ? undefined
        : "Duration is required (e.g. 2 days).";
    case "image":
      // In edit mode an existing image is acceptable; in create mode a new file is required
      return !isEditMode && value === null ? "A banner image is required." : undefined;
    default:
      return undefined;
  }
}

function buildInitialState(editRide?: Ride): RideFormState {
  if (editRide) {
    return {
      title: editRide.title,
      locationFrom: editRide.location.from,
      locationTo: editRide.location.to,
      date: editRide.date,
      distance: editRide.distance,
      routeType: editRide.routeType,
      meetupTime: editRide.meetupTime,
      meetupLocation: editRide.meetupLocation,
      membersJoined: editRide.membersJoined,
      description: editRide.description,
      duration: editRide.duration,
      past: editRide.past,
      imageFile: null,
      imagePreview: editRide.image,
    };
  }
  return {
    title: "",
    locationFrom: "",
    locationTo: "",
    date: "",
    distance: "",
    routeType: "Inter-city",
    meetupTime: "",
    meetupLocation: "",
    membersJoined: 0,
    description: "",
    duration: "",
    past: false,
    imageFile: null,
    imagePreview: "",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RideForm({ editRide, onSuccess, onClose }: RideFormProps) {
  const isEditMode = Boolean(editRide);
  const { showSuccess, showError } = useFeedback();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string>("");
  // Snapshot captured once on mount — used to detect whether anything changed.
  const initialStateRef = useRef<RideFormState>(buildInitialState(editRide));

  const [form, setForm] = useState<RideFormState>(() => buildInitialState(editRide));
  const [errors, setErrors] = useState<RideFormErrors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // ── hasChanges — true when any field differs from the opening snapshot ───────
  // In create mode always true (validation gate is enough).
  // In edit mode the Save button stays disabled until a real change is detected.
  const hasChanges: boolean = !isEditMode || (
    form.title !== initialStateRef.current.title ||
    form.locationFrom !== initialStateRef.current.locationFrom ||
    form.locationTo !== initialStateRef.current.locationTo ||
    form.date !== initialStateRef.current.date ||
    form.distance !== initialStateRef.current.distance ||
    form.routeType !== initialStateRef.current.routeType ||
    form.meetupTime !== initialStateRef.current.meetupTime ||
    form.meetupLocation !== initialStateRef.current.meetupLocation ||
    form.membersJoined !== initialStateRef.current.membersJoined ||
    form.description !== initialStateRef.current.description ||
    form.duration !== initialStateRef.current.duration ||
    form.past !== initialStateRef.current.past ||
    form.imageFile !== null // a new image file was selected
  );

  // ── Keyboard close ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSaving, onClose]);

  // ── Cleanup object URLs on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // ── Field change handler ────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field: keyof RideFormState, value: RideFormState[typeof field]) => {
      setForm((prev) => ({ ...prev, [field]: value }));

      // Validate the changed field immediately if it maps to an error key
      const errorKey = field as keyof RideFormErrors;
      if (errorKey in { title: 1, locationFrom: 1, locationTo: 1, date: 1, distance: 1, routeType: 1, meetupTime: 1, meetupLocation: 1, description: 1, duration: 1 }) {
        const err = validateField(errorKey, value as string, isEditMode);
        setErrors((prev) => ({ ...prev, [errorKey]: err }));
      }
    },
    [isEditMode]
  );

  // ── Image selection with compression ───────────────────────────────────────
  const handleImageSelect = useCallback(async (file: File) => {
    setIsCompressing(true);
    try {
      const { file: compressed, previewUrl } = await compressImage(file);
      // Revoke the previous object URL to free memory
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = previewUrl;
      setForm((prev) => ({ ...prev, imageFile: compressed, imagePreview: previewUrl }));
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
  }, [showError]);

  // ── Compute overall form validity ───────────────────────────────────────────
  const isFormValid = useCallback((): boolean => {
    const fields: Array<[keyof RideFormErrors, string | File | null]> = [
      ["title", form.title],
      ["locationFrom", form.locationFrom],
      ["locationTo", form.locationTo],
      ["date", form.date],
      ["distance", form.distance],
      ["routeType", form.routeType],
      ["meetupTime", form.meetupTime],
      ["meetupLocation", form.meetupLocation],
      ["description", form.description],
      ["duration", form.duration],
      ["image", form.imageFile],
    ];
    return fields.every(([key, val]) => validateField(key, val, isEditMode) === undefined);
  }, [form, isEditMode]);

  // ── Run full validation and surface errors on save attempt ─────────────────
  const validateAll = useCallback((): boolean => {
    const newErrors: RideFormErrors = {
      title: validateField("title", form.title, isEditMode),
      locationFrom: validateField("locationFrom", form.locationFrom, isEditMode),
      locationTo: validateField("locationTo", form.locationTo, isEditMode),
      date: validateField("date", form.date, isEditMode),
      distance: validateField("distance", form.distance, isEditMode),
      routeType: validateField("routeType", form.routeType, isEditMode),
      meetupTime: validateField("meetupTime", form.meetupTime, isEditMode),
      meetupLocation: validateField("meetupLocation", form.meetupLocation, isEditMode),
      description: validateField("description", form.description, isEditMode),
      duration: validateField("duration", form.duration, isEditMode),
      image: validateField("image", form.imageFile, isEditMode),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === undefined);
  }, [form, isEditMode]);

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("locationFrom", form.locationFrom.trim());
      formData.append("locationTo", form.locationTo.trim());
      formData.append("date", form.date);
      formData.append("distance", form.distance.trim());
      formData.append("routeType", form.routeType);
      formData.append("meetupTime", form.meetupTime.trim());
      formData.append("meetupLocation", form.meetupLocation.trim());
      formData.append("membersJoined", String(form.membersJoined));
      formData.append("description", form.description.trim());
      formData.append("duration", form.duration.trim());
      formData.append("past", String(form.past));

      if (form.imageFile) {
        formData.append("image", form.imageFile, form.imageFile.name);
      }

      let savedRide: Ride;
      if (isEditMode && editRide) {
        savedRide = await ridesService.updateRide(editRide._id, formData);
        showSuccess("Ride updated successfully!");
      } else {
        savedRide = await ridesService.createRide(formData);
        showSuccess("Ride created successfully!");
      }

      onSuccess(savedRide);
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
  }, [form, isEditMode, editRide, validateAll, onSuccess, onClose, showSuccess, showError]);

  const routeMeta = ROUTE_TYPE_META[form.routeType];

  // ─── Render ─────────────────────────────────────────────────────────────────
  // Image border: red-dashed in create mode when no image; muted when edit mode has existing image
  const imageBorderCls = !isEditMode && !form.imagePreview
    ? "border-2 border-dashed border-red-500/60"
    : form.imagePreview
      ? ""
      : "border-2 border-dashed border-[var(--color-border)]/50";

  const modalContent = (
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
        aria-labelledby="ride-form-title"
        className="relative w-full max-w-2xl max-h-[96vh] sm:max-h-[92vh] flex flex-col bg-[var(--color-section)] border border-[var(--color-border)]/50 rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── In-flight overlay ───────────────────────────────────────────── */}
        {isSaving && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm bg-black/40">
            <Cliploader size={40} color="#f8fafc" />
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary)] font-[var(--font-accent)] tracking-widest uppercase">
              {isEditMode ? "Saving Changes…" : "Creating Ride…"}
            </p>
          </div>
        )}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]/40 flex-shrink-0">
          <div>
            <p className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-1">
              {isEditMode ? "Edit Ride" : "New Ride"}
            </p>
            <h2
              id="ride-form-title"
              className="font-[var(--font-heading)] font-black text-lg md:text-2xl text-[var(--color-primary)] uppercase"
            >
              {isEditMode ? "Update Ride Document" : "Create Ride Document"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close form"
            className="hidden md:block p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all duration-200 cursor-pointer disabled:opacity-40"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* ── Image Banner Preview ───────────────────────────────────────── */}
        <div
          className={`relative h-30 md:h-40 flex-shrink-0 bg-[var(--color-surface)] cursor-pointer group overflow-hidden ${imageBorderCls}`}
          onClick={() => !isSaving && fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          role="button"
          tabIndex={0}
          aria-label="Select banner image"
        >
          {/* Required badge — always shown in create mode until an image is chosen */}
          {!isEditMode && !form.imagePreview && (
            <span className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[0.6rem] font-semibold font-[var(--font-accent)] uppercase tracking-wide">
              Required
            </span>
          )}

          {form.imagePreview ? (
            <>
              <img
                src={form.imagePreview}
                alt="Ride banner preview"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {isCompressing ? (
                    <Cliploader size={24} color="#f8fafc" />
                  ) : (
                    <>
                      <FaImage size={24} />
                      <span className="text-xs font-semibold tracking-wide">Change Image</span>
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

        {/* ── Scrollable Form Body ───────────────────────────────────────── */}
        <form
          id="ride-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-5"
        >
          {/* Title */}
          <FormField htmlFor="ride-title" label="Ride Title" error={errors.title} required>
            <input
              id="ride-title"
              name="rideTitle"
              type="text"
              autoComplete="off"
              placeholder="e.g. Coastal Highway Blast"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={inputCls(errors.title)}
            />
          </FormField>

          {/* Route Type — uses buttons, no text input, label is decorative */}
          <FormField label="Route Type" error={errors.routeType} required>
            <div className="flex flex-wrap gap-2">
              {(["Inter-state", "Inter-city", "Intra-city"] as Ride["routeType"][]).map((rt) => (
                <button
                  key={rt}
                  type="button"
                  onClick={() => handleChange("routeType", rt)}
                  className={`flex-1 min-w-[7rem] py-2.5 rounded-xl text-xs font-bold font-[var(--font-accent)] tracking-wide uppercase transition-all duration-200 border cursor-pointer ${
                    form.routeType === rt
                      ? `bg-[var(--color-surface)] border-[var(--color-primary)] ${ROUTE_TYPE_META[rt].color}`
                      : "bg-transparent border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:border-[var(--color-border)]"
                  }`}
                >
                  {rt}
                </button>
              ))}
            </div>
            {/* Dynamic route type hint */}
            <p className={`text-[0.7rem] mt-1.5 font-[var(--font-accent)] ${routeMeta.color} opacity-80`}>
              {routeMeta.hint}
            </p>
          </FormField>

          {/* Location From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField htmlFor="ride-location-from" label="From" error={errors.locationFrom} required>
              <input
                id="ride-location-from"
                name="rideLocationFrom"
                type="text"
                autoComplete="address-level2"
                placeholder="e.g. Mumbai"
                value={form.locationFrom}
                onChange={(e) => handleChange("locationFrom", e.target.value)}
                className={inputCls(errors.locationFrom)}
              />
            </FormField>
            <FormField htmlFor="ride-location-to" label="To" error={errors.locationTo} required>
              <input
                id="ride-location-to"
                name="rideLocationTo"
                type="text"
                autoComplete="address-level2"
                placeholder="e.g. Goa"
                value={form.locationTo}
                onChange={(e) => handleChange("locationTo", e.target.value)}
                className={inputCls(errors.locationTo)}
              />
            </FormField>
          </div>

          {/* Date / Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField htmlFor="ride-date" label="Ride Date" error={errors.date} required>
              <input
                id="ride-date"
                name="rideDate"
                type="date"
                autoComplete="off"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={inputCls(errors.date)}
              />
            </FormField>
            <FormField htmlFor="ride-duration" label="Duration" error={errors.duration} required>
              <input
                id="ride-duration"
                name="rideDuration"
                type="text"
                autoComplete="off"
                placeholder="e.g. 2 days"
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className={inputCls(errors.duration)}
              />
            </FormField>
          </div>

          {/* Distance / Members Joined */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField htmlFor="ride-distance" label="Distance" error={errors.distance} required>
              <input
                id="ride-distance"
                name="rideDistance"
                type="text"
                autoComplete="off"
                placeholder="e.g. 580 km"
                value={form.distance}
                onChange={(e) => handleChange("distance", e.target.value)}
                className={inputCls(errors.distance)}
              />
            </FormField>
            <FormField htmlFor="ride-members-joined" label="Members Joined">
              <input
                id="ride-members-joined"
                name="rideMembersJoined"
                type="number"
                autoComplete="off"
                min={0}
                value={form.membersJoined}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    membersJoined: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className={inputCls()}
              />
            </FormField>
          </div>

          {/* Meetup Time / Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField htmlFor="ride-meetup-time" label="Meetup Time" error={errors.meetupTime} required>
              <input
                id="ride-meetup-time"
                name="rideMeetupTime"
                type="text"
                autoComplete="off"
                placeholder="e.g. 05:30 AM"
                value={form.meetupTime}
                onChange={(e) => handleChange("meetupTime", e.target.value)}
                className={inputCls(errors.meetupTime)}
              />
            </FormField>
            <FormField htmlFor="ride-meetup-location" label="Meetup Location" error={errors.meetupLocation} required>
              <input
                id="ride-meetup-location"
                name="rideMeetupLocation"
                type="text"
                autoComplete="street-address"
                placeholder="e.g. Gateway of India"
                value={form.meetupLocation}
                onChange={(e) => handleChange("meetupLocation", e.target.value)}
                className={inputCls(errors.meetupLocation)}
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField htmlFor="ride-description" label="Description" error={errors.description} required>
            <textarea
              id="ride-description"
              name="rideDescription"
              autoComplete="off"
              rows={4}
              placeholder="Describe the ride — terrain, highlights, what to expect…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${inputCls(errors.description)} resize-none`}
            />
          </FormField>

          {/* Past toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="ride-past-toggle"
              onClick={() => setForm((prev) => ({ ...prev, past: !prev.past }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${
                form.past ? "bg-[var(--color-highlight)]" : "bg-[var(--color-border)]"
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
              htmlFor="ride-past-toggle"
              className="text-sm font-[var(--font-accent)] font-semibold text-[var(--color-text-secondary)] cursor-pointer select-none"
            >
              Mark as Past Ride
            </label>
          </div>
        </form>

        {/* ── Footer Actions — mirrors GalleryPreview Save/Cancel ─────────── */}
        <div className="flex gap-3 justify-end px-6 py-5 border-t border-[var(--color-border)]/40 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="ride-form"
            disabled={isSaving || isCompressing || !isFormValid() || !hasChanges}
            className={`px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all ${
              isSaving || isCompressing || !isFormValid() || !hasChanges
                ? 'bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60'
                : 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 hover:cursor-pointer'
            }`}
          >
            {isSaving ? (
              <span className="flex gap-1 items-center justify-center">
                <Cliploader size={12} color="var(--color-bg)" />
                {isEditMode ? 'Saving..' : 'Creating..'}
              </span>
            ) : (
              isEditMode ? 'Save Changes' : 'Create Ride'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {htmlFor ? (
        <label
          htmlFor={htmlFor}
          className="text-[0.7rem] font-semibold font-[var(--font-accent)] text-[var(--color-text-secondary)] uppercase tracking-[0.12em]"
        >
          {label}
          {required && <span className="text-[var(--color-highlight)] ml-0.5">*</span>}
        </label>
      ) : (
        <span
          className="text-[0.7rem] font-semibold font-[var(--font-accent)] text-[var(--color-text-secondary)] uppercase tracking-[0.12em]"
        >
          {label}
          {required && <span className="text-[var(--color-highlight)] ml-0.5">*</span>}
        </span>
      )}
      {children}
      {error && (
        <p className="text-[0.68rem] text-red-400 font-[var(--font-accent)]">{error}</p>
      )}
    </div>
  );
}

function inputCls(error?: string): string {
  return [
    "w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border text-sm font-[var(--font-body)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 outline-none transition-all duration-200",
    error
      ? "border-red-500/60 focus:border-red-400"
      : "border-[var(--color-border)]/50 focus:border-[var(--color-primary)]/60",
  ].join(" ");
}
