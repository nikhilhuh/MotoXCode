import Cliploader from "@/components/ui/Cliploader";
import type { Profile as ProfileType } from "../../../types/profile";

export interface ProfileHeaderProps {
  profile: ProfileType;
  isOwner: boolean | null;
  avatarSrc: string;
  hasImage: boolean;
  uploading: boolean;
  uploadType: "avatar" | "coverImage" | null;
  onUploadClick: (type: "avatar") => void;
  onRemoveClick: () => void;
  onEditClick: () => void;
}

export default function ProfileHeader({
  profile,
  isOwner,
  avatarSrc,
  hasImage,
  uploading,
  uploadType,
  onUploadClick,
  onRemoveClick,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row flex-wrap items-center md:items-end gap-6 md:gap-8 mb-12">
      {/* Avatar Area */}
      <div className="relative z-30 group">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[6px] border-[var(--color-bg)] bg-[#111] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] shrink-0 relative">
          <img
            src={avatarSrc}
            alt={profile.name || profile.username}
            className="w-full h-full object-cover"
          />

          {isOwner && (
            <button
              onClick={() => onUploadClick("avatar")}
              disabled={uploading && uploadType === "avatar"}
              className={`absolute inset-0 flex flex-col gap-2 items-center justify-center text-white text-xs font-accent tracking-widest uppercase font-semibold hover:cursor-pointer disabled:cursor-not-allowed transition-all duration-300 ${
                uploading && uploadType === "avatar"
                  ? "bg-black/70 opacity-100"
                  : "bg-black/60 opacity-0 group-hover:opacity-100"
              }`}
            >
              {uploading && uploadType === "avatar" ? (
                <>
                  <Cliploader size={20} color="white" />
                  <span>Uploading...</span>
                </>
              ) : (
                "Upload Photo"
              )}
            </button>
          )}
        </div>

        {isOwner && (
          <>
            {hasImage && (
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-40">
                <button
                  onClick={onRemoveClick}
                  disabled={uploading}
                  className="w-10 h-10 bg-red-500 rounded-full text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-[var(--color-bg)] hover:cursor-pointer"
                  aria-label="Remove Photo"
                  title="Remove Photo"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            )}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-40">
              <button
                onClick={() => onUploadClick("avatar")}
                disabled={uploading && uploadType === "avatar"}
                className="w-10 h-10 bg-[var(--color-accent)] rounded-full text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-[var(--color-bg)] hover:cursor-pointer"
                aria-label="Upload Photo"
                title="Upload Photo"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 min-w-[280px] text-center md:text-left md:pb-4 lg:pb-6 pt-4 md:pt-0 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-3 md:mb-2">
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-none drop-shadow-md tracking-tight">
            {profile.name || "Not specified"}
          </h1>
          <span className="font-accent text-[var(--color-text-secondary)] text-sm tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center justify-center gap-2 w-max mx-auto md:mx-0 md:mb-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {profile.username}
          </span>
        </div>

        {profile.headline ? (
          <p className="font-body text-base md:text-lg text-white/80 mt-1 max-w-2xl leading-relaxed">
            {profile.headline}
          </p>
        ) : (
          <p className="font-body text-base md:text-lg text-white/30 italic mt-1 max-w-2xl leading-relaxed">
            No headline provided
          </p>
        )}
      </div>

      {isOwner && (
        <div className="mb-2 md:mb-8 flex-shrink-0">
          <button
            onClick={onEditClick}
            className="btn-outline px-8 py-3 text-sm font-accent tracking-widest font-semibold uppercase"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
