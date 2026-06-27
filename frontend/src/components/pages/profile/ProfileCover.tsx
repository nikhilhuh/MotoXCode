export interface ProfileCoverProps {
  coverImageSrc: string;
  isOwner: boolean | null;
  hasImage: boolean;
  uploading: boolean;
  uploadType: "avatar" | "coverImage" | null;
  onUploadClick: (type: "coverImage") => void;
  onRemoveClick: () => void;
}

export default function ProfileCover({
  coverImageSrc,
  isOwner,
  hasImage,
  uploading,
  uploadType,
  onUploadClick,
  onRemoveClick,
}: ProfileCoverProps) {
  return (
    <div className="relative w-full h-[35vh] sm:h-[40vh] md:h-[50vh] min-h-[250px] max-h-[500px] bg-[#111] overflow-hidden">
      {/* Cover Image */}
      <img
        src={coverImageSrc}
        alt="Cover"
        className="w-full h-full object-cover object-center"
      />

      {/* Smooth gradient blend into the page background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent pointer-events-none z-0" />

      {/* Bottom Blur Effect for seamless blending */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 backdrop-blur-xl pointer-events-none z-10"
        style={{
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent)",
          maskImage: "linear-gradient(to top, black 10%, transparent)",
        }}
      />
      {isOwner && (
        <>
          {hasImage && (
            <div className="absolute bottom-6 left-6 md:bottom-18 md:left-auto md:right-6 z-30">
              <button
                onClick={onRemoveClick}
                disabled={uploading}
                className={`w-10 h-10 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-300 shadow-lg flex items-center justify-center ${
                  uploading
                    ? "bg-white/5 opacity-50"
                    : "bg-red-500/80 hover:bg-red-600 hover:text-white"
                } hover:cursor-pointer disabled:cursor-not-allowed`}
                aria-label="Remove Cover"
                title="Remove Cover"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hover:scale-110 transition-transform"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          )}
          <div className="absolute bottom-6 right-6 z-30">
            <button
              onClick={() => onUploadClick("coverImage")}
              disabled={uploading && uploadType === "coverImage"}
              className={`w-10 h-10 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-300 shadow-lg group flex items-center justify-center ${
                uploading && uploadType === "coverImage"
                  ? "bg-white/5 cursor-not-allowed opacity-50"
                  : "bg-white/10 hover:bg-[var(--color-accent)] hover:text-black"
              } hover:cursor-pointer disabled:cursor-not-allowed`}
              aria-label="Change Cover"
              title="Change Cover"
            >
              {uploading && uploadType === "coverImage" ? (
                <svg
                  className="animate-spin"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
