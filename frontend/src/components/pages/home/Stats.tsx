import { useState, useRef, useMemo } from "react";
import { Stat } from "@/types/stat";
import { StatCard } from "@/components/ui/StatCard";
import { FaPencil } from "react-icons/fa6";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { compressImage } from "@/services/imageCompression.service";
import { cmsService } from "@/services";
import Cliploader from "@/components/ui/Cliploader";
import axios from "axios";

// Types
interface StatEditRow {
  _id: string;
  label: string;
  suffix: string;
  target: number;
  isFloat: boolean;
  image: string;
  pendingImageFile?: File;
  previewImageUrl?: string;
}

interface StatsProps {
  statsData: Stat[];
  onStatsUpdate?: (updatedStats: Stat[]) => void;
}

// Component
export default function Stats({ statsData, onStatsUpdate }: StatsProps) {
  const { userDetails } = useUser();
  const { showSuccess, showError } = useFeedback();
  const isAdmin: boolean = userDetails?.role === "admin";

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editRows, setEditRows] = useState<StatEditRow[]>([]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const hasChanges = useMemo(() => {
    if (editRows.length !== statsData.length) return true;
    for (let i = 0; i < editRows.length; i++) {
      const e = editRows[i];
      const s = statsData.find((st) => st._id === e._id);
      if (!s) return true;
      if (
        e.label !== s.label ||
        e.suffix !== s.suffix ||
        e.target !== s.target ||
        e.isFloat !== (s.isFloat ?? false) ||
        e.pendingImageFile !== undefined
      ) {
        return true;
      }
    }
    return false;
  }, [editRows, statsData]);

  // Start / Cancel
  function startEditing(): void {
    setEditRows(
      statsData.map((s) => ({
        _id: s._id,
        label: s.label,
        suffix: s.suffix,
        target: s.target,
        isFloat: s.isFloat ?? false,
        image: s.image,
      })),
    );
    setIsEditing(true);
  }

  function cancelEditing(): void {
    setEditRows([]);
    setIsEditing(false);
    setIsSaving(false);
  }

  // Field Mutation
  function updateRow(id: string, patch: Partial<StatEditRow>): void {
    setEditRows((prev) =>
      prev.map((row) => (row._id === id ? { ...row, ...patch } : row)),
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
      console.error("[Stats CMS] Image compression failed:", err);
    }
  }

  // Save Handler
  async function handleSave(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();

      const statsPayload = editRows.map((row) => ({
        id: row._id,
        label: row.label,
        suffix: row.suffix,
        target: String(row.target),
        isFloat: String(row.isFloat),
      }));

      formData.append("stats", JSON.stringify(statsPayload));

      editRows.forEach((row) => {
        if (row.pendingImageFile) {
          formData.append(
            `image_${row._id}`,
            row.pendingImageFile,
            row.pendingImageFile.name,
          );
        }
      });

      console.log(
        "[Stats CMS] Dispatching unified bulk update patch request to service layer.",
      );
      const result = await cmsService.updateHomeCMSData("stat", formData);

      if (result.success) {
        showSuccess("Stats updated successfully!");
        setIsEditing(false);
        if (onStatsUpdate) {
          const updatedStats: Stat[] = editRows.map((row) => ({
            _id: row._id,
            label: row.label,
            suffix: row.suffix,
            target: row.target,
            isFloat: row.isFloat,
            image: row.previewImageUrl ?? row.image,
          }));
          onStatsUpdate(updatedStats);
        }
      } else {
        showError(result.message || "Failed to save data");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Failed to update stats.");
      } else if (err instanceof Error) {
        showError(err.message);
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
      className={`${isAdmin ? "py-16" : "py-12"} lg:py-22 relative overflow-hidden bg-gradient-to-b from-black via-[var(--color-bg)] to-[var(--color-section)] border-b border-[var(--color-border)]/50`}
    >
      {/* ── Floating Admin Pencil ── */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEditing}
          title="Edit Stats Section"
          aria-label="Edit stats section"
          className="absolute top-4 right-4 z-30 btn-admin-edit"
        >
          <FaPencil size={18} />
        </button>
      )}

      {/* ── Section Header ── */}
      <div className="mb-12 lg:mb-22 text-center max-w-4xl mx-auto">
        <h2 className="section-heading">BY THE NUMBERS</h2>
        <p className="section-subheading">
          Riding hard, growing fast, and pushing limits every single day.
        </p>
      </div>

      {/* ── Read Mode ── */}
      {!isEditing && (
        <div className="px-6 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {statsData.map((stat, i) => (
              <StatCard key={stat._id} {...stat} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Edit Mode ── */}
      {isEditing && (
        <div className="px-6 lg:px-12 w-full relative z-10 flex flex-col gap-6">
          <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
            Editing Stats
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {editRows.map((row) => (
              <div
                key={row._id}
                className="flex flex-col gap-3 p-4 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-2xl backdrop-blur-md"
              >
                {/* Live image preview */}
                {row.image && (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--color-border)]/40">
                    <img
                      src={row.previewImageUrl ?? row.image}
                      alt={row.label}
                      className="absolute inset-0 size-full object-cover aspect-1"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group/img">
                      <div className="btn-admin-edit scale-90 group-hover/img:scale-100">
                        <FaPencil size={18} />
                      </div>
                      <input
                        ref={(el) => {
                          fileInputRefs.current[row._id] = el;
                        }}
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
                )}

                {/* Label */}
                <input
                  id={`stat-label-${row._id}`}
                  name={`stat-label-${row._id}`}
                  autoComplete="off"
                  type="text"
                  value={row.label}
                  onChange={(e) =>
                    updateRow(row._id, { label: e.target.value })
                  }
                  placeholder="Label"
                  className="w-full bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />

                {/* Target + Suffix in a row */}
                <div className="flex gap-2">
                  <input
                    id={`stat-target-${row._id}`}
                    name={`stat-target-${row._id}`}
                    autoComplete="off"
                    type="number"
                    value={row.target}
                    step={row.isFloat ? "0.1" : "1"}
                    onChange={(e) =>
                      updateRow(row._id, {
                        target: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Target"
                    className="flex-1 bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  <input
                    id={`stat-suffix-${row._id}`}
                    name={`stat-suffix-${row._id}`}
                    autoComplete="off"
                    type="text"
                    value={row.suffix}
                    onChange={(e) =>
                      updateRow(row._id, { suffix: e.target.value })
                    }
                    placeholder="Suffix"
                    className="w-1/3 bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-3 justify-end">
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
      )}
    </section>
  );
}
