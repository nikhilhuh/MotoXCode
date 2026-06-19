import { useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { motion } from "framer-motion";
import { FaPencil } from "react-icons/fa6";
import { useAdminEditable } from "@/hooks/useAdminEditable";
import { cmsService } from "@/services";
import type { PageHero } from "@/services/cms.service";
import Cliploader from "@/components/ui/Cliploader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroEditData {
  /** Server image URL (read mode) or a compressed File (edit mode pending save). */
  image: string | File;
}

interface HeroProp {
  HeroBg: string;
  onUpdate?: (updatedHero: PageHero) => void;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero({ HeroBg, onUpdate }: HeroProp) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { userDetails, isInitialized } = useUser();
  const { showSuccess, showError } = useFeedback();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  } = useAdminEditable<HeroEditData>({ image: HeroBg });

  const hasChanges = editData.image instanceof File;

  // Resolve background: objectURL (File) or plain string URL
  const resolvedBg =
    previewData.image instanceof File
      ? URL.createObjectURL(previewData.image)
      : (previewData.image as string);

  // ─── Save Handler ───────────────────────────────────────────────────────────

  async function handleSave(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();
      const selectedFileBinary = editData.image instanceof File ? editData.image : null;

      // 1. Audit your file target binary object allocation
      if (selectedFileBinary) {
        console.log("[CMS Frontend Form] Appending media asset binary file object.");
        // CRITICAL: Key MUST be exactly "image" to match backend upload.single("image")
        formData.append("image", selectedFileBinary, selectedFileBinary.name);
      } else {
        throw new Error("No compressed file binary was found in your local preview state storage.");
      }

      // 2. Pass any additional textual property data if necessary
      formData.append("page", "home");

      console.log("[CMS Frontend Form] Dispatching outbound patch network request to service layer...");
      const result = await cmsService.updateHomeCMSData("hero", formData);

      if (result.success) {
        showSuccess("Hero background image updated successfully!");
        
        const resultData = result.data as { image?: string } | undefined;
        
        if (resultData && resultData.image) {
          setField({ image: resultData.image });
        }
        finishEditing();
        
        // Update local hydrated page state with the fresh public URL returned from server response
        if (resultData && resultData.image && onUpdate) {
          onUpdate({ page: "home", image: resultData.image });
        } else if (onUpdate) {
          onUpdate({ page: "home", image: resolvedBg });
        }
      } else {
        showError(result.message || "Failed to update hero background.");
      }
    } catch (error: any) {
      console.error("[CMS Frontend Error Handlers]:", error);
      showError(error.response?.data?.message || error.message || "Failed to update hero background.");
    } finally {
      setIsSaving(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background layer — switches to previewData in edit mode */}
      <div
        className="absolute inset-0 size-full bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${resolvedBg})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 40%, rgba(2,6,23,0.4) 60%, rgba(2,6,23,1) 100%)",
        }}
      />

      {/* ── Floating Admin Edit Console ── */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEditing}
          title="Edit Hero Section"
          aria-label="Edit hero section"
          className="absolute bottom-4 right-4 z-30 btn-admin-edit"
        >
          <FaPencil size={18} />
        </button>
      )}

      {/* ── Edit Mode Overlay Panel ── */}
      {isAdmin && isEditing && (
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 flex flex-col gap-3 p-4 bg-[var(--color-surface)]/90 border border-[var(--color-border)] rounded-2xl shadow-2xl backdrop-blur-md min-w-[220px]">
          <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest mb-1">
            Hero Section
          </p>

          {/* Image swap trigger */}
          <label className="flex items-center justify-center gap-2 px-3 py-2.5 mt-1 text-xs text-[var(--color-primary)] font-bold cursor-pointer rounded-xl border border-dashed border-[var(--color-border)] hover:bg-[var(--color-bg)]/40 hover:border-[var(--color-primary)]/50 hover:scale-[1.02] transition-all duration-300">
            <FaPencil size={12} className="opacity-70" />
            Change Background
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImageChange("image", file);
              }}
            />
          </label>

          {/* Action buttons */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-all ${
                isSaving || !hasChanges
                  ? "bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60"
                  : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 cursor-pointer hover:shadow-lg"
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
            <button
              onClick={cancelEditing}
              disabled={isSaving}
              className="flex-1 text-xs font-bold py-2 px-3 rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center px-4 py-10 md:px-6 md:py-12 lg:px-12 lg:py-20">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] md:text-xs lg:text-sm font-bold tracking-[0.05em] uppercase px-4 md:px-6 py-2.5 rounded-full text-[var(--color-bg)] bg-[var(--color-primary)] shadow-[0_8px_32px_rgba(248,250,252,0.2)]">
              Premium Riding Community
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="
              font-[var(--font-heading)]
              font-black
              leading-[0.9]
              tracking-tighter
              mb-4 sm:mb-6
              text-[clamp(3rem,8vw,7rem)]
              text-center
              text-[var(--color-primary)]
              drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]
              uppercase
            "
          >
            MOTOXCODE <br />
            <span className="text-[var(--color-accent)] text-[clamp(2.4rem,6.5vw,5.5rem)]">
              Ride Beyond Ordinary
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-[var(--font-body)] font-medium max-w-2xl mx-auto text-sm md:text-base lg:text-xl text-[var(--color-text-primary)] opacity-90 leading-relaxed mb-10"
          >
            Born from late-night rides, endless highways, and a passion for
            adventure: MotoXCode is more than a riding group.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[16rem] sm:max-w-none mx-auto"
          >
            {!isInitialized ? null : userDetails ? (
              <Link
                to={`/profile/@${userDetails.username}`}
                className="btn-primary w-full sm:w-auto px-8 py-4 text-sm lg:text-base"
              >
                View My Profile
              </Link>
            ) : (
              <Link
                to="/join"
                className="btn-primary w-full sm:w-auto px-8 py-4 text-sm lg:text-base"
              >
                Join the Movement
              </Link>
            )}
            <Link
              to="/rides"
              className="btn-secondary w-full sm:w-auto px-8 py-4 text-sm lg:text-base"
            >
              View Rides
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[var(--color-text-primary)] opacity-60"
      >
        <span className="font-[var(--font-body)] text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-[var(--color-text-primary)] to-transparent" />
      </motion.div>
    </section>
  );
}
