import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/cropImage";
import { motion, AnimatePresence } from "framer-motion";
import Cliploader from "@/components/ui/Cliploader";

export interface ImageCropModalProps {
  imageSrc: string;
  aspect: number;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => Promise<void> | void;
}

export default function ImageCropModal({
  imageSrc,
  aspect,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onCropCompleteHandler = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    setIsProcessing(false);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0,
      );
      if (croppedImageBlob) {
        await onCropComplete(croppedImageBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isProcessing ? onClose : undefined}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[var(--color-bg)]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col overflow-hidden h-[85vh] sm:h-[80vh] max-h-[800px]"
        >
          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center shrink-0">
            <h2 className="font-heading text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              Adjust Image
            </h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-white/30 hover:text-white transition-colors hover:rotate-90 duration-300 disabled:opacity-50 disabled:hover:rotate-0"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative flex-1 bg-black/40 mx-4 sm:mx-6 rounded-[1.5rem] overflow-hidden shadow-inner border border-white/5">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
              classes={{
                containerClassName: "rounded-[1.5rem]",
              }}
            />
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 shrink-0 flex flex-col gap-6">
            <div className="flex items-center gap-4 px-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] disabled:opacity-50"
                disabled={isProcessing}
              />
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/10 text-white/70 font-semibold hover:bg-white/5 hover:text-white transition-colors order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="btn-primary text-black w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_var(--color-accent)] hover:shadow-[0_0_30px_var(--color-accent)] order-1 sm:order-2 min-w-[150px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Cliploader size={20} color="black" />
                    <span>Applying...</span>
                  </>
                ) : (
                  "Apply Crop"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
