import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { FaPencil } from "react-icons/fa6";
import { useAdminEditable } from "@/hooks/useAdminEditable";
import { useFeedback } from "@/context/FeedbackContext";
import { cmsService } from "@/services";
import type { Philosophy } from "@/types/philosophy";
import Cliploader from "@/components/ui/Cliploader";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhilosophyEditData {
  quote: string;
  author: string;
  image: string | File;
}

interface AboutPhilosophyProps {
  philosophy: Philosophy;
  onUpdate?: (updated: Philosophy) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutPhilosophy({
  philosophy,
  onUpdate,
}: AboutPhilosophyProps) {
  const { userDetails, isInitialized } = useUser();
  const { showSuccess, showError } = useFeedback();

  const {
    isAdmin,
    isEditing,
    isSaving,
    editData,
    previewData,
    startEditing,
    cancelEditing,
    finishEditing,
    setField,
    handleImageChange,
    setIsSaving,
  } = useAdminEditable<PhilosophyEditData>({
    quote: philosophy.quote,
    author: philosophy.author,
    image: philosophy.image,
  });

  const resolvedImage =
    previewData.image instanceof File
      ? URL.createObjectURL(previewData.image)
      : (previewData.image as string);

  const hasChanges =
    editData.quote !== philosophy.quote ||
    editData.author !== philosophy.author ||
    editData.image instanceof File;

  async function handleSave(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append(
        "philosophy",
        JSON.stringify({
          id: philosophy._id,
          quote: editData.quote,
          author: editData.author,
        }),
      );

      if (editData.image instanceof File) {
        formData.append("image", editData.image, editData.image.name);
      }

      const result = await cmsService.updateAboutCMSData(formData);

      if (result.success) {
        showSuccess("Philosophy updated successfully!");
        const rd = result.data as
          | { philosophy?: { quote?: string; author?: string; image?: string } }
          | undefined;
        const updatedPhil = rd?.philosophy;
        finishEditing();
        onUpdate?.({
          _id: philosophy._id,
          quote: updatedPhil?.quote ?? editData.quote,
          author: updatedPhil?.author ?? editData.author,
          image:
            updatedPhil?.image ??
            (editData.image instanceof File ? resolvedImage : philosophy.image),
        });
      } else {
        showError(result.message || "Failed to update philosophy.");
      }
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          showError(error.response.data.message || "Failed to update philosophy.");
        } else if (error instanceof Error) {
          showError(error.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      id="philosophy"
      className="py-12 lg:py-22 relative overflow-hidden"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        {isEditing ? (
          <div className="flex flex-col gap-10">
            <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
              Editing Philosophy
            </p>

            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
              {/* Text edit fields */}
              <div className="flex-1 w-full flex flex-col gap-4 p-5 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[var(--color-accent)] text-xs font-mono">
                    Philosophy Content
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="phil-quote"
                    className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Quote
                  </label>
                  <textarea
                    id="phil-quote"
                    name="phil-quote"
                    autoComplete="off"
                    value={editData.quote}
                    onChange={(e) => setField({ quote: e.target.value })}
                    rows={4}
                    className="bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="phil-author"
                    className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Author
                  </label>
                  <input
                    id="phil-author"
                    name="phil-author"
                    autoComplete="off"
                    type="text"
                    value={editData.author}
                    onChange={(e) => setField({ author: e.target.value })}
                    className="bg-[var(--color-bg)]/60 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              {/* Image editor */}
              <div className="w-full lg:flex-1">
                <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden aspect-[4/5] bg-[var(--color-surface)]/20 border border-[var(--color-border)]/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <img
                    src={resolvedImage}
                    alt="MotoXCode Story"
                    className="absolute inset-0 size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group/img">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)]/90 rounded-full border border-[var(--color-border)]">
                      <FaPencil
                        size={14}
                        className="text-[var(--color-primary)]"
                      />
                      <span className="text-[var(--color-primary)] text-xs font-semibold">
                        Change Image
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await handleImageChange("image", file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

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
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1">
              <h2 className="section-heading">Why We Exist</h2>
              <div className="space-y-6 text-[var(--color-text-secondary)]">
                <p className="font-[var(--font-body)] text-lg lg:text-xl leading-relaxed">
                  Most riding groups are about the bike. MotoXCode is about the
                  rider. There's a difference, and we felt it every time we
                  tried to find our people.
                </p>
                <p className="font-[var(--font-body)] text-lg lg:text-xl leading-relaxed">
                  We wanted a community that took safety as seriously as speed.
                  That valued the story of a ride over the spec sheet of the
                  machine. That made space for the beginner and the veteran in
                  the same convoy.
                </p>
                <p className="font-[var(--font-body)] text-lg lg:text-xl leading-relaxed">
                  So we built it. And every person who rides with us adds a
                  chapter to what it means.
                </p>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12">
                {!isInitialized ? null : userDetails ? (
                  <Link
                    to={`/profile/@${userDetails.username}`}
                    className="btn-primary px-8 py-4 text-sm"
                  >
                    View My Profile
                  </Link>
                ) : (
                  <Link to="/join" className="btn-primary px-8 py-4 text-sm">
                    Be Part of It
                  </Link>
                )}
                <Link to="/crew" className="btn-secondary px-8 py-4 text-sm">
                  Meet the Team
                </Link>
              </div>
            </div>

            {/* Image + Quote Card */}
            <div className="flex-1 w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[var(--color-border)]/30">
                <img
                  src={resolvedImage}
                  alt="MotoXCode Story"
                  className="absolute inset-0 size-full object-cover transition-transform duration-1000 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-10 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent">
                  <blockquote className="font-[var(--font-heading)] font-bold text-3xl lg:text-4xl italic mb-4 text-[var(--color-primary)] leading-tight">
                    {previewData.quote}
                  </blockquote>
                  <p className="font-[var(--font-sub)] text-sm tracking-widest uppercase font-semibold text-[var(--color-accent)]">
                    - {previewData.author}
                  </p>
                </div>

                {/* ── Admin Edit Button ── */}
                {isAdmin && !isEditing && (
                  <button
                    onClick={startEditing}
                    title="Edit Philosophy Section"
                    aria-label="Edit philosophy quote and image"
                    className="absolute top-4 right-4 z-30 btn-admin-edit"
                  >
                    <FaPencil size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
