import imageCompression from "browser-image-compression";

// ─── Compression Settings ─────────────────────────────────────────────────────

/**
 * Enforced compression profile for all CMS media uploads.
 * Processing is delegated to a Web Worker to keep the UI thread unblocked.
 */
const COMPRESSION_OPTIONS: Parameters<typeof imageCompression>[1] = {
  maxSizeMB: 1.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

// ─── Output Shape ─────────────────────────────────────────────────────────────

export interface CompressedImageResult {
  /** Compressed File object ready for FormData shipment. */
  file: File;
  /** Revocable object URL for instant in-page preview rendering. */
  previewUrl: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Compresses a raw browser File using the enforced CMS settings.
 *
 * Returns a CompressedImageResult containing the compressed binary and a
 * revocable object URL that updates the live section preview immediately
 * before the administrator commits the network save.
 *
 * Callers are responsible for calling URL.revokeObjectURL(result.previewUrl)
 * when the preview is no longer needed (e.g. on component unmount or cancel).
 */
export async function compressImage(rawFile: File): Promise<CompressedImageResult> {
  const compressedBlob = await imageCompression(rawFile, COMPRESSION_OPTIONS);

  // Re-wrap as a named File so multer receives the original filename on upload
  const compressedFile = new File([compressedBlob], rawFile.name, {
    type: compressedBlob.type,
  });

  const previewUrl = URL.createObjectURL(compressedFile);

  return { file: compressedFile, previewUrl };
}
