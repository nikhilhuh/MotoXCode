import { useState } from "react";
import { motion } from "framer-motion";
import { FaPencil, FaTrash, FaPlus } from "react-icons/fa6";
import { RidingCode } from "@/types/ridingCode";
import { useAdminEditable } from "@/hooks/useAdminEditable";
import { useFeedback } from "@/context/FeedbackContext";
import { cmsService } from "@/services";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Cliploader from "@/components/ui/Cliploader";

interface RidingCodeEditEntry {
  _id: string;
  rule: string;
  detail: string;
}

interface AboutRidingCodeProps {
  ridingCode: RidingCode[];
  onUpdate?: (updated: RidingCode[]) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function AboutRidingCode({
  ridingCode,
  onUpdate,
}: AboutRidingCodeProps) {
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

  const [draftCodes, setDraftCodes] = useState<RidingCodeEditEntry[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const hasChanges =
    JSON.stringify(
      ridingCode.map((e) => ({ rule: e.rule, detail: e.detail }))
    ) !==
    JSON.stringify(
      draftCodes.map((e) => ({ rule: e.rule, detail: e.detail }))
    );

  function handleStartEditing() {
    setDraftCodes(ridingCode.map((r) => ({ ...r })));
    startEditing();
  }

  function handleCancelAll() {
    setDraftCodes([]);
    cancelEditing();
  }

  function handleUpdateDraft(
    index: number,
    field: keyof RidingCodeEditEntry,
    value: string,
  ) {
    setDraftCodes((prev) => {
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
      setDraftCodes((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  }

  function handleAddDraft() {
    setDraftCodes((prev) => [
      ...prev,
      {
        _id: `temp_${Date.now()}`,
        rule: "",
        detail: "",
      },
    ]);
  }

  async function handleSaveAll(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append(
        "ridingCode",
        JSON.stringify(
          draftCodes.map((e) => ({
            id: e._id.startsWith("temp_") ? undefined : e._id,
            rule: e.rule,
            detail: e.detail,
          })),
        ),
      );

      const result = await cmsService.updateAboutCMSData(formData);

      if (result.success) {
        showSuccess("Riding Code updated successfully!");
        const rd = result.data as { ridingCodes?: RidingCode[] } | undefined;
        if (rd?.ridingCodes) {
          onUpdate?.(rd.ridingCodes);
        } else {
          onUpdate?.(draftCodes); // fallback
        }
        finishEditing();
        setDraftCodes([]);
      } else {
        showError(result.message || "Failed to update riding code.");
      }
    } catch (error: unknown) {
      showError(
        error instanceof Error
          ? error.message
          : "Failed to update riding code.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const accentColors = [
    "text-red-500",
    "text-orange-500",
    "text-blue-500",
    "text-emerald-500",
    "text-amber-500",
    "text-purple-500",
    "text-cyan-500",
    "text-rose-500",
  ];

  return (
    <section
      id="riding-code"
      className={`${isAdmin ? "py-16" : "py-12"} lg:py-22 bg-gradient-to-b from-[var(--color-bg)] to-black relative overflow-hidden`}
    >
      {/* Decorative ambient lighting */}
      <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] -left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0"></div>

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

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
        <h2 className="section-heading">The Riding Code</h2>
        <p className="section-subheading">Five Principles. Non-Negotiable.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        {isEditing ? (
          /* ── BLOCK LAYOUT EDITOR ── */
          <div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-20">
            <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
              Editing Riding Code
            </p>
            {draftCodes.map((draft, idx) => (
              <div
                key={draft._id}
                className="bg-slate-950/90 border border-[var(--color-primary)]/20 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col gap-5 group transition-all duration-300 hover:border-[var(--color-primary)]/50"
              >
                <div className="flex-1 flex flex-col gap-4">
                  {/* Row 1: Rule Name */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`code-rule-${draft._id}`} className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">
                      Rule Name
                    </label>
                    <input
                      id={`code-rule-${draft._id}`}
                      type="text"
                      value={draft.rule}
                      onChange={(e) =>
                        handleUpdateDraft(idx, "rule", e.target.value)
                      }
                      placeholder="Rule Title"
                      className="w-full bg-black/60 border border-[var(--color-border)] text-[var(--color-text-primary)] font-heading font-black text-2xl rounded-xl px-4 py-2.5 outline-none focus:border-[var(--color-primary)]/60 transition-colors"
                    />
                  </div>
                  
                  {/* Row 2: Description */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`code-detail-${draft._id}`} className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">
                      Rule Description
                    </label>
                    <textarea
                      id={`code-detail-${draft._id}`}
                      rows={3}
                      value={draft.detail}
                      onChange={(e) =>
                        handleUpdateDraft(idx, "detail", e.target.value)
                      }
                      placeholder="Rule details..."
                      className="w-full bg-black/60 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm rounded-xl px-4 py-3 outline-none resize-none focus:border-[var(--color-primary)]/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/30 mt-2">
                  <button
                    onClick={() => confirmDeleteDraft(idx)}
                    className="flex w-full text-center justify-center items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-500/30 text-xs font-bold uppercase tracking-widest hover:cursor-pointer"
                    title="Remove Rule"
                  >
                    <FaTrash size={12} /> Remove Rule
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddDraft}
              className="mt-4 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all font-bold tracking-widest uppercase text-xs hover:cursor-pointer"
            >
              <FaPlus /> Add New Rule
            </button>

            {/* Save / Cancel */}
            <div className="flex gap-3 justify-end mt-4">
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
                  <span className="flex gap-1 items-center justify-center">
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
          /* ── STANDARD PRESENTATION ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {ridingCode.map((item, i) => {
              const accentClass = accentColors[i % accentColors.length];
              return (
                <motion.div
                  key={item._id || item.rule}
                  custom={i}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="h-full bg-slate-950/98 border border-white/10 backdrop-blur-2xl p-8 lg:p-10 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col">
                    <div className="absolute -top-4 -right-4 font-heading font-black text-9xl text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors duration-500">
                      {i + 1}
                    </div>

                    <div className="relative z-10">
                      <div className="flex flex-col gap-1 mb-6">
                        <span
                          className={`font-mono text-[0.65rem] font-bold tracking-[0.4em] uppercase ${accentClass}`}
                        >
                          Rule {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-heading font-black text-3xl lg:text-4xl tracking-tight text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                          {item.rule}
                        </h3>
                      </div>
                      <p className="font-body text-base leading-relaxed text-[var(--color-text-secondary)]/90 selection:bg-white/10">
                        {item.detail}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Riding Code?"
        message="Are you sure you want to remove this rule? This cannot be undone once saved."
        confirmText="Remove Rule"
        onConfirm={executeDeleteDraft}
        onClose={() => setDeleteIndex(null)}
      />
    </section>
  );
}
