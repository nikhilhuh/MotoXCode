import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { GalleryImage } from "@/types/galleryImage";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { cmsService } from "@/services";
import { compressImage } from "@/services/imageCompression.service";
import { FaPencil, FaTrash, FaPlus } from "react-icons/fa6";
import Cliploader from "./Cliploader";
import ConfirmModal from "./ConfirmModal";
import PromptModal from "./PromptModal";
import axios from "axios";

interface GalleryPreviewProps {
  galleryPreviewImages: GalleryImage[];
  className?: string;
  page?: string;
  onGalleryUpdate?: (images: GalleryImage[]) => void;
}

export default function GalleryPreview({
  galleryPreviewImages,
  className,
  page,
  onGalleryUpdate,
}: GalleryPreviewProps) {
  const { userDetails } = useUser();
  const { showSuccess, showError } = useFeedback();
  const isAdmin = userDetails?.role === "admin";

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Staged State
  const [localImages, setLocalImages] = useState<GalleryImage[]>(galleryPreviewImages || []);
  const [addedFiles, setAddedFiles] = useState<Array<{ id: string; file: File; title: string; preview: string }>>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Keep localImages synced if props change while not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalImages(galleryPreviewImages || []);
      setAddedFiles([]);
      setDeletedIds(new Set());
    }
  }, [galleryPreviewImages, isEditing]);

  const hasChanges = addedFiles.length > 0 || deletedIds.size > 0;

  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string, isNew: boolean } | null>(null);

  const [promptModalOpen, setPromptModalOpen] = useState<boolean>(false);
  const [pendingAddFile, setPendingAddFile] = useState<File | null>(null);
  const [fileInputTarget, setFileInputTarget] = useState<HTMLInputElement | null>(null);

  function handleDeleteClick(e: React.MouseEvent, id: string, isNew: boolean = false) {
    e.stopPropagation();
    setImageToDelete({ id, isNew });
    setConfirmModalOpen(true);
  }

  function performDelete() {
    if (!imageToDelete) return;
    if (imageToDelete.isNew) {
      // Remove from addedFiles
      setAddedFiles(prev => prev.filter(f => f.id !== imageToDelete.id));
    } else {
      // Stage for deletion from DB
      setDeletedIds(prev => new Set(prev).add(imageToDelete.id));
      setLocalImages(prev => prev.filter(img => img._id !== imageToDelete.id));
    }
    setConfirmModalOpen(false);
    setImageToDelete(null);
  }

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingAddFile(file);
    setFileInputTarget(e.target);
    setPromptModalOpen(true);
  }

  function performAdd(title: string) {
    if (!pendingAddFile) return;

    const finalTitle = title.trim() || "New Image";
    const previewUrl = URL.createObjectURL(pendingAddFile);
    const tempId = `temp_${Date.now()}_${Math.random()}`;

    setAddedFiles(prev => [...prev, {
      id: tempId,
      file: pendingAddFile,
      title: finalTitle,
      preview: previewUrl
    }]);

    if (fileInputTarget) {
      fileInputTarget.value = "";
    }
    setPromptModalOpen(false);
    setPendingAddFile(null);
    setFileInputTarget(null);
  }

  function cancelAdd() {
    if (fileInputTarget) {
      fileInputTarget.value = "";
    }
    setPromptModalOpen(false);
    setPendingAddFile(null);
    setFileInputTarget(null);
  }

  async function handleSave() {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      
      // 1. Process deletions
      const deletePromises = Array.from(deletedIds).map(id => cmsService.deleteGalleryImage(id));
      await Promise.all(deletePromises);

      // 2. Process additions
      const newImages: GalleryImage[] = [];
      for (const added of addedFiles) {
        const { file: compressedFile } = await compressImage(added.file);
        const formData = new FormData();
        formData.append("image", compressedFile, compressedFile.name);
        formData.append("title", added.title);
        formData.append("page", page || "home");

        const res = await cmsService.addGalleryImage(formData);
        if (res.success && res.data) {
          newImages.push(res.data);
        }
      }

      showSuccess("Gallery saved successfully!");
      if (onGalleryUpdate) {
        const finalImages = localImages.concat(newImages);
        onGalleryUpdate(finalImages);
      }
      setIsEditing(false);
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Failed to save gallery changes.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsSaving(false);
    }
  }

  function cancelEditing() {
    setIsEditing(false);
    setLocalImages(galleryPreviewImages || []);
    setAddedFiles([]);
    setDeletedIds(new Set());
  }

  // Combine localImages (already filtered) + addedFiles for the grid
  const displayImages = isEditing 
    ? [...(localImages || []), ...addedFiles.map(a => ({ _id: a.id, src: a.preview, title: a.title, page: page as any, isNew: true }))]
    : (galleryPreviewImages || []);

  // Scroll lock when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <>
      {/* ── LIGHTBOX PORTAL ── */}
      {lightbox &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(10px)",
            }}
            role="presentation"
            onClick={() => setLightbox(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setLightbox(null);
            }}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-5 right-5 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-accent)]/30 text-white transition-colors cursor-pointer z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Image & Title Container — stop propagation so clicking content itself doesn't close */}
            <div
              className="relative flex flex-col items-center gap-4 max-w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title at top of the image */}
              <h3 className="font-heading text-2xl md:text-4xl text-[var(--color-primary)] tracking-[0.1em] text-center select-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {lightbox.title}
              </h3>
              
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-w-full max-h-[72vh] md:max-h-[78vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </div>,
          document.body,
        )}

      {/* ── SECTION ── */}
      <section
        className={`${isAdmin? "py-16" : "py-12"} lg:py-22 relative overflow-hidden ${className || "bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }}
          viewport={{ once: true, margin: "-50px" }}
          className="w-full z-10"
        >
        {isAdmin && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            title="Edit Gallery"
            aria-label="Edit gallery"
            className="absolute top-4 right-4 z-30 btn-admin-edit"
          >
            <FaPencil size={18} />
          </button>
        )}

        {/* Ambient glow blobs */}
        <div className="absolute -top-[10%] right-[5%] w-[35%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] -left-[5%] w-[35%] h-[40%] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none z-0" />

        {/* Section header — centered */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-16 relative z-10 text-center flex flex-col items-center gap-4">
          <h2 className="section-heading">Through the Lens</h2>
          <p className="section-subheading text-center">
            Roads conquered, moments shared, machines remembered.
          </p>
        </div>

        {/* Grid — flows left-to-right in rows of 1 → 2 → 3 */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10 flex flex-col gap-6">
          {isEditing && (
            <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
              Editing Gallery
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(displayImages || []).map((img: any) => (
              <div
                key={img._id}
                className="gallery-item group relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] aspect-[4/3] w-full block"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Admin Delete Overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 z-20 flex items-start justify-end p-4">
                    <button
                      onClick={(e) => handleDeleteClick(e, img._id, img.isNew)}
                      className="size-10 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg"
                      title="Delete Image"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}

                {/* Hover overlay (only show if not editing) */}
                {!isEditing && (
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-10 cursor-pointer w-full h-full border-none appearance-none"
                    onClick={() => setLightbox({ src: img.src, title: img.title })}
                  >
                    <span className="font-heading font-bold text-xl text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {img.title}
                    </span>
                    <div className="size-10 rounded-full border border-white/30 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 bg-white/5 backdrop-blur-sm">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <label className="gallery-item group relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer aspect-[4/3] w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-primary)]/50 bg-[var(--color-bg)]/30 hover:bg-[var(--color-bg)]/60 transition-colors">
                <div className="size-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FaPlus size={20} className="text-[var(--color-primary)]" />
                </div>
                <span className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAdd}
                />
              </label>
            )}
          </div>

          {/* Save / Cancel */}
          {isEditing && (
            <div className="flex gap-3 justify-end mt-4">
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
                  <span className="flex gap-1 items-center justify-center">
                    <Cliploader size={12} color="var(--color-bg)" />
                    Saving..
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </div>
        </motion.div>
      </section>

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action will be staged until you save."
        confirmText="Remove"
        onConfirm={performDelete}
        onClose={() => {
          setConfirmModalOpen(false);
          setImageToDelete(null);
        }}
      />

      <PromptModal
        isOpen={promptModalOpen}
        title="Add Image"
        message="Enter a title for the new image:"
        initialValue="New Image"
        confirmText="Add Image"
        onConfirm={performAdd}
        onClose={cancelAdd}
      />
    </>
  );
}
