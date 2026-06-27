import { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { FaMapPin, FaPencil, FaPlus, FaTrash } from "react-icons/fa6";
import { Timeline } from "@/types/timeline";
import { useAdminEditable } from "@/hooks/useAdminEditable";
import { useFeedback } from "@/context/FeedbackContext";
import { cmsService } from "@/services";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Cliploader from "@/components/ui/Cliploader";
import axios from "axios";

// Types
interface TimelineEditEntry {
  _id: string;
  year: string;
  location: string;
  event: string;
}

interface AboutJourneyProps {
  timeline: Timeline[];
  onUpdate?: (updated: Timeline[]) => void;
}

// Helper
const getStepProps = (index: number, total: number) => {
  const yBase = 5;
  const yEnd = 95;
  const y = yBase + (index / (total - 1)) * (yEnd - yBase);
  const xPattern = [50, 25, 75, 30, 70, 50];
  const x = xPattern[index % xPattern.length];
  const side = x <= 50 ? "right" : "left";
  return { x, y, side };
};

// Animation Variants
const pinVariants = {
  hidden: { scale: 0, opacity: 0, filter: "blur(4px)" },
  visible: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: [0.175, 0.885, 0.32, 1.275] as const,
      filter: { ease: "easeOut" },
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      delay: 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Component
export default function AboutJourney({
  timeline,
  onUpdate,
}: AboutJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  const { showSuccess, showError } = useFeedback();

  const {
    isAdmin,
    isEditing,
    isSaving,
    startEditing,
    cancelEditing,
    finishEditing,
    setIsSaving,
  } = useAdminEditable<{ placeholder: string }>({ placeholder: "" });

  const [draftTimeline, setDraftTimeline] = useState<TimelineEditEntry[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const hasChanges =
    JSON.stringify(
      timeline.map((e) => ({
        year: e.year,
        location: e.location,
        event: e.event,
      })),
    ) !==
    JSON.stringify(
      draftTimeline.map((e) => ({
        year: e.year,
        location: e.location,
        event: e.event,
      })),
    );

  const dynamicHeight = Math.max(800, timeline.length * 300);

  function handleStartEditing() {
    setDraftTimeline(timeline.map((t) => ({ ...t })));
    startEditing();
  }

  function handleCancelAll() {
    setDraftTimeline([]);
    cancelEditing();
  }

  function handleUpdateDraft(
    index: number,
    field: keyof TimelineEditEntry,
    value: string,
  ) {
    setDraftTimeline((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function confirmDeleteDraft(index: number) {
    setDeleteIndex(index);
  }

  function executeDeleteDraft() {
    if (deleteIndex !== null) {
      setDraftTimeline((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  }

  function handleAddDraft() {
    setDraftTimeline((prev) => [
      ...prev,
      {
        _id: `temp_${Date.now()}`,
        year: "",
        location: "",
        event: "",
      },
    ]);
  }

  async function handleSaveAll(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append(
        "timeline",
        JSON.stringify(
          draftTimeline.map((e) => ({
            id: e._id.startsWith("temp_") ? undefined : e._id,
            year: e.year,
            location: e.location,
            event: e.event,
          })),
        ),
      );

      const result = await cmsService.updateAboutCMSData(formData);

      if (result.success) {
        showSuccess("Journey timeline updated successfully!");
        const rd = result.data as { timeline?: Timeline[] } | undefined;
        if (rd?.timeline) {
          onUpdate?.(rd.timeline);
        } else {
          onUpdate?.(draftTimeline); // fallback
        }
        finishEditing();
        setDraftTimeline([]);
      } else {
        showError(result.message || "Failed to update timeline.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        showError(error.response.data.message || "Failed to update timeline.");
      } else if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Render
  return (
    <section
      ref={containerRef}
      className={`${isAdmin ? "py-16" : "py-12"} lg:py-22 bg-[var(--color-bg)] relative overflow-hidden`}
    >
      {/* Topographic Map Mesh */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'url("/assets/images/about/topographic.png")',
          backgroundSize: "600px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Floating Admin Pencil ── */}
      {isAdmin && !isEditing && (
        <button
          onClick={handleStartEditing}
          title="Enter timeline edit mode"
          aria-label="Enter timeline edit mode"
          className="absolute top-4 right-4 z-30 btn-admin-edit"
        >
          <FaPencil size={18} />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
          <h2 className="section-heading">Community Journey</h2>
          <p className="section-subheading">Our Story</p>
        </div>

        {isEditing ? (
          /* ── BLOCK LAYOUT EDITOR ── */
          <div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-20">
            <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
              Editing Timeline
            </p>
            {draftTimeline.map((draft, idx) => (
              <div
                key={draft._id}
                className="bg-slate-950/90 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col gap-5 group transition-all duration-300 hover:border-white/20"
              >
                <div className="flex-1 flex flex-col gap-4">
                  {/* Row 1: Year and Location */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-1 sm:w-1/3">
                      <label
                        htmlFor={`timeline-year-${draft._id}`}
                        className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider"
                      >
                        Year
                      </label>
                      <input
                        id={`timeline-year-${draft._id}`}
                        type="text"
                        value={draft.year}
                        onChange={(e) =>
                          handleUpdateDraft(idx, "year", e.target.value)
                        }
                        placeholder="e.g. 2024"
                        className="w-full bg-black/60 border border-[var(--color-border)] text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase rounded-xl px-4 py-2.5 outline-none focus:border-[var(--color-accent)] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:w-2/3">
                      <label
                        htmlFor={`timeline-location-${draft._id}`}
                        className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider"
                      >
                        Location / Title
                      </label>
                      <input
                        id={`timeline-location-${draft._id}`}
                        type="text"
                        value={draft.location}
                        onChange={(e) =>
                          handleUpdateDraft(idx, "location", e.target.value)
                        }
                        placeholder="Location"
                        className="w-full bg-black/60 border border-[var(--color-border)] text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase rounded-xl px-4 py-2.5 outline-none focus:border-[var(--color-accent)] transition-colors"
                      />
                    </div>
                  </div>
                  {/* Row 2: Description */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`timeline-event-${draft._id}`}
                      className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider"
                    >
                      Description
                    </label>
                    <textarea
                      id={`timeline-event-${draft._id}`}
                      rows={3}
                      value={draft.event}
                      onChange={(e) =>
                        handleUpdateDraft(idx, "event", e.target.value)
                      }
                      placeholder="Event description..."
                      className="w-full bg-black/60 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm rounded-xl px-4 py-3 outline-none resize-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/30 mt-2">
                  <button
                    onClick={() => confirmDeleteDraft(idx)}
                    className="flex w-full text-center justify-center items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-500/30 text-xs font-bold uppercase tracking-widest hover:cursor-pointer"
                    title="Remove Event"
                  >
                    <FaTrash size={12} /> Remove Event
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddDraft}
              className="mt-4 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all font-bold tracking-widest uppercase text-xs hover:cursor-pointer"
            >
              <FaPlus /> Add New Timeline Event
            </button>

            {/* Save / Cancel */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelAll}
                disabled={isSaving}
                className="px-6 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving || !hasChanges}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  isSaving || !hasChanges
                    ? "bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60"
                    : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 hover:cursor-pointer"
                }`}
              >
                {isSaving ? (
                  <span className="flex gap-1 items-center justify-denter">
                    <Cliploader size={12} color="blue" />
                    Saving..
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ── STANDARD MAP PRESENTATION ── */
          <>
            {/* Desktop Experience */}
            <div
              className="hidden lg:block relative w-full"
              style={{ height: `${dynamicHeight}px` }}
            >
              <svg
                className="absolute inset-0 size-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="journeyGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="25%" stopColor="#f97316" />
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
                <motion.path
                  style={{ pathLength: scrollYProgress }}
                  d={timeline.reduce((acc, _, i) => {
                    const { x, y } = getStepProps(i, timeline.length);
                    if (i === 0) return `M ${x} ${y}`;
                    const prev = getStepProps(i - 1, timeline.length);
                    const midY = (prev.y + y) / 2;
                    return `${acc} C ${prev.x} ${midY}, ${x} ${midY}, ${x} ${y}`;
                  }, "")}
                  stroke="url(#journeyGradient)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                />
              </svg>

              {timeline.map((item, index) => {
                const { x, y, side } = getStepProps(index, timeline.length);
                return (
                  <motion.div
                    key={item._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-100px" }}
                    className="absolute w-full"
                    style={{ top: `${y}%`, left: 0, height: 0 }}
                  >
                    {/* Pin */}
                    <div
                      className="absolute z-20 flex items-center justify-center"
                      style={{
                        left: `${x}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <motion.div
                        variants={pinVariants}
                        className="size-12 bg-slate-950 rounded-full flex items-center justify-center border border-white/20 shadow-2xl"
                      >
                        <FaMapPin className="size-5 text-white" />
                        <div className="absolute -inset-1.5 rounded-full border border-white/10 animate-pulse pointer-events-none" />
                      </motion.div>
                    </div>

                    {/* Card */}
                    <div
                      className={`absolute w-[calc(100vw-80px)] lg:w-[400px] xl:w-[420px] z-30 transition-all duration-300 ${
                        side === "right"
                          ? "pl-12 lg:pl-14"
                          : "pr-12 lg:pr-14 text-right"
                      }`}
                      style={{
                        top: "0",
                        left: `${x}%`,
                        transform:
                          side === "right"
                            ? "translate(0%, -50%)"
                            : "translate(-100%, -50%)",
                      }}
                    >
                      <motion.div variants={cardVariants}>
                        <div className="bg-slate-950/98 border border-white/10 backdrop-blur-2xl p-6 lg:p-8 rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] hover:border-white/20 transition-all duration-500 group relative">
                          <div
                            className={`flex flex-col gap-1 mb-3 ${side === "left" ? "items-end" : "items-start"}`}
                          >
                            <span className="font-heading font-black text-4xl lg:text-5xl tracking-tight text-[var(--color-text-primary)] leading-none group-hover:text-[var(--color-primary)] transition-colors duration-300">
                              {item.year}
                            </span>
                            <span className="font-mono text-[0.6rem] lg:text-[0.65rem] font-bold tracking-[0.3em] text-[var(--color-accent)] uppercase">
                              {item.location}
                            </span>
                          </div>
                          <p className="font-body text-xs lg:text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
                            {item.event}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Experience */}
            <div className="lg:hidden relative">
              <div className="absolute left-1 top-2 bottom-2 w-[3px] bg-gradient-to-b from-red-500 via-blue-500 to-amber-500 opacity-30 rounded-full" />
              <div className="space-y-8">
                {timeline.map((item) => (
                  <motion.div
                    key={item._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-50px" }}
                    className="relative flex items-start pl-12 pr-2"
                  >
                    <motion.div
                      variants={pinVariants}
                      className="absolute top-0 left-[5.5px] -ml-5 z-20 pt-1"
                    >
                      <div className="size-10 bg-[var(--color-bg)]/95 rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                        <FaMapPin className="size-4 text-white" />
                      </div>
                    </motion.div>
                    <motion.div variants={cardVariants} className="flex-1 z-30">
                      <div className="bg-[var(--color-bg)]/95 border border-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl relative group">
                        <div className="flex flex-col gap-0.5 mb-2">
                          <span className="font-heading font-black text-3xl text-[var(--color-text-primary)] leading-none">
                            {item.year}
                          </span>
                          <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] text-[var(--color-accent)] uppercase">
                            {item.location}
                          </span>
                        </div>
                        <p className="font-body text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
                          {item.event}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Timeline Event?"
        message="Are you sure you want to remove this event from the journey? This cannot be undone once saved."
        confirmText="Remove Event"
        onConfirm={executeDeleteDraft}
        onClose={() => setDeleteIndex(null)}
      />
    </section>
  );
}
