import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Value } from "@/types/value";
import { FaPencil } from "react-icons/fa6";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { compressImage } from "@/services/imageCompression.service";
import { cmsService } from "@/services";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValueEditRow {
  _id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  /** Compressed File pending upload on Save. */
  pendingImageFile?: File;
  /** ObjectURL for immediate preview rendering. */
  previewImageUrl?: string;
}

interface ValuesProps {
  valuesData: Value[];
  onValuesUpdate?: (updatedValues: Value[]) => void;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      delay: i * 0.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Values({ valuesData, onValuesUpdate }: ValuesProps) {
  const { userDetails } = useUser();
  const { showSuccess, showError } = useFeedback();
  const isAdmin: boolean = userDetails?.role === "admin";

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editRows, setEditRows] = useState<ValueEditRow[]>([]);

  const hasChanges = useMemo(() => {
    if (editRows.length !== valuesData.length) return true;
    for (let i = 0; i < editRows.length; i++) {
      const e = editRows[i];
      const v = valuesData.find((val) => val._id === e._id);
      if (!v) return true;
      if (
        e.title !== v.title ||
        e.description !== v.description ||
        e.tag !== v.tag ||
        e.pendingImageFile !== undefined
      ) {
        return true;
      }
    }
    return false;
  }, [editRows, valuesData]);

  // ─── Start / Cancel ─────────────────────────────────────────────────────────

  function startEditing(): void {
    setEditRows(
      valuesData.map((v) => ({
        _id: v._id,
        title: v.title,
        description: v.description,
        tag: v.tag,
        image: v.image,
      }))
    );
    setIsEditing(true);
  }

  function cancelEditing(): void {
    setEditRows([]);
    setIsEditing(false);
    setIsSaving(false);
  }

  // ─── Field Mutation ─────────────────────────────────────────────────────────

  function updateRow(id: string, patch: Partial<ValueEditRow>): void {
    setEditRows((prev) =>
      prev.map((row) => (row._id === id ? { ...row, ...patch } : row))
    );
  }

  async function handleImagePick(id: string, file: File): Promise<void> {
    try {
      const { file: compressedFile, previewUrl } = await compressImage(file);
      updateRow(id, {
        pendingImageFile: compressedFile,
        previewImageUrl: previewUrl,
        image: previewUrl,
      });
    } catch (err) {
      console.error("[Values CMS] Image compression failed:", err);
    }
  }

  // ─── Save Handler ───────────────────────────────────────────────────────────

  async function handleSave(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      const valuesPayload = editRows.map(row => ({
        id: row._id,
        title: row.title,
        description: row.description,
        tag: row.tag
      }));
      
      formData.append("values", JSON.stringify(valuesPayload));

      editRows.forEach(row => {
        if (row.pendingImageFile) {
          formData.append(`image_${row._id}`, row.pendingImageFile, row.pendingImageFile.name);
        }
      });

      console.log("[Values CMS] Dispatching unified bulk update patch request to service layer.");
      const result = await cmsService.updateHomeCMSData("value", formData);

      if (result.success) {
        showSuccess("Values updated successfully!");
        setIsEditing(false);
        if (onValuesUpdate) {
          const updatedValues: Value[] = editRows.map((row) => ({
            _id: row._id,
            title: row.title,
            description: row.description,
            tag: row.tag,
            image: row.previewImageUrl ?? row.image,
          }));
          onValuesUpdate(updatedValues);
        }
      } else {
        showError(result.message || "Failed to save data");
      }
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Failed to update values.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsSaving(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <section className={`${isAdmin? "py-16" : "py-12"}  g:py-22 bg-gradient-to-b from-[var(--color-section)] via-[var(--color-bg)] to-[var(--color-surface)] relative overflow-hidden`}>
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Floating Admin Pencil ── */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEditing}
          title="Edit Values Section"
          aria-label="Edit values section"
          className="absolute top-4 right-4 z-30 btn-admin-edit"
        >
          <FaPencil size={18} />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 lg:mb-22 text-center max-w-4xl mx-auto"
        >
          <motion.h2 variants={headerVariants} className="section-heading">THE MOTOXCODE WAY</motion.h2>
          <motion.p variants={headerVariants} className="section-subheading">
            We don't just share a passion for motorcycles. We share a code.
          </motion.p>
        </motion.div>

        {/* ── Read Mode ── */}
        {!isEditing && (
          <div className="flex flex-col gap-10 lg:gap-20">
            {valuesData.map((v, idx) => (
              <motion.div
                key={v._id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={itemVariants}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 group ${
                  idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <div className="flex-1 flex flex-col items-start text-left relative">
                  <span className="relative z-10 inline-flex items-center gap-2 text-[clamp(0.65rem,1.5vw,0.85rem)] font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full text-[var(--color-primary)] bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 backdrop-blur-md mb-8 group-hover:border-[var(--color-primary)]/30 transition-all duration-500">
                    <span className="size-1.5 rounded-full bg-[var(--color-primary)] opacity-70" />
                    {v.tag}
                  </span>

                  <div className="relative mb-6">
                    <span className="absolute -top-10 lg:-top-20 -left-2 lg:-left-4 font-[var(--font-heading)] font-black text-[clamp(5rem,15vw,12rem)] leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--color-accent)] opacity-40 select-none pointer-events-none group-hover:opacity-80 group-hover:[-webkit-text-stroke:2px_var(--color-primary)] transition-all duration-700">
                      {idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}
                    </span>
                    <h3 className="relative z-10 font-[var(--font-heading)] font-bold text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--color-primary)] leading-[1.05] tracking-tight">
                      {v.title}
                    </h3>
                  </div>

                  <p className="relative z-10 font-[var(--font-body)] text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-[var(--color-text-primary)]/80 pl-4 border-l-2 border-[var(--color-border)]/50 group-hover:border-[var(--color-accent)]/80 transition-colors duration-500">
                    {v.description}
                  </p>
                </div>

                {/* Image */}
                <div className="w-full lg:flex-1">
                  <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden aspect-[21/9] sm:aspect-[16/9] lg:aspect-[16/10] bg-[var(--color-surface)]/20 border border-[var(--color-border)]/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700">
                    <img
                      src={v.image}
                      alt={v.title}
                      className="absolute inset-0 size-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out aspect-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/90 via-[var(--color-bg)]/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Edit Mode ── */}
        {isEditing && (
          <div className="flex flex-col gap-10">
            <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
              Editing Values
            </p>

            {editRows.map((row, idx) => (
              <div
                key={row._id}
                className={`flex flex-col lg:flex-row items-start gap-8 lg:gap-16 ${
                  idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text edit fields */}
                <div className="flex-1 w-full flex flex-col gap-4 p-5 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-2xl backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[var(--color-accent)] text-xs font-mono">
                      Value #{idx + 1}
                    </span>
                  </div>

                  {/* Tag */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`value-tag-${row._id}`} className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider cursor-pointer">
                      Tag
                    </label>
                    <input
                      id={`value-tag-${row._id}`}
                      name={`value-tag-${row._id}`}
                      autoComplete="off"
                      type="text"
                      value={row.tag}
                      onChange={(e) => updateRow(row._id, { tag: e.target.value })}
                      className="bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`value-title-${row._id}`} className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider cursor-pointer">
                      Title
                    </label>
                    <input
                      id={`value-title-${row._id}`}
                      name={`value-title-${row._id}`}
                      autoComplete="off"
                      type="text"
                      value={row.title}
                      onChange={(e) => updateRow(row._id, { title: e.target.value })}
                      className="bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`value-desc-${row._id}`} className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider cursor-pointer">
                      Description
                    </label>
                    <textarea
                      id={`value-desc-${row._id}`}
                      name={`value-desc-${row._id}`}
                      autoComplete="off"
                      value={row.description}
                      rows={4}
                      onChange={(e) => updateRow(row._id, { description: e.target.value })}
                      className="bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Image editor */}
                <div className="w-full lg:flex-1">
                  <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden aspect-[21/9] sm:aspect-[16/9] lg:aspect-[16/10] bg-[var(--color-surface)]/20 border border-[var(--color-border)]/40">
                    <img
                      src={row.previewImageUrl ?? row.image}
                      alt={row.title}
                      className="absolute inset-0 size-full object-cover"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group/img">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)]/90 rounded-full border border-[var(--color-border)]">
                        <FaPencil size={14} className="text-[var(--color-primary)]" />
                        <span className="text-[var(--color-primary)] text-xs font-semibold">
                          Change Image
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImagePick(row._id, file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {/* Save / Cancel */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={cancelEditing}
                disabled={isSaving}
                className="px-6 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  isSaving || !hasChanges
                    ? "bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60"
                    : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 hover:cursor-pointer"
                }`}
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
