import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cliploader from "@/components/ui/Cliploader";

export interface ActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  actionType?: "primary" | "danger" | "info";
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export default function ActionModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  actionType = "primary",
  onConfirm,
  onClose,
}: ActionModalProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setIsProcessing(false); // Reset state when opened
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen && typeof document === "undefined") return null;

  const colorStyles = {
    primary: {
      bg: "bg-[var(--color-primary)]",
      hover: "hover:bg-[var(--color-primary)]/80",
      text: "text-[var(--color-bg)]",
      iconContainer:
        "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)] shadow-[0_0_30px_var(--color-primary-10)]",
      buttonShadow:
        "shadow-[0_0_20px_var(--color-primary-20)] hover:shadow-[0_0_30px_var(--color-primary-40)]",
    },
    danger: {
      bg: "bg-red-500",
      hover: "hover:bg-red-600",
      text: "text-white",
      iconContainer:
        "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]",
      buttonShadow:
        "shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    },
    info: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      text: "text-white",
      iconContainer:
        "bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      buttonShadow:
        "shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    },
  };

  const style = colorStyles[actionType];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[var(--color-bg)]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-[400px] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col p-8 text-center"
          >
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors hover:rotate-90 duration-300 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:rotate-0"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
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

            <div
              className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full border mb-6 ${style.iconContainer}`}
            >
              {actionType === "danger" ? (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ) : actionType === "info" ? (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              ) : (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              )}
            </div>

            <h2 className="font-heading text-2xl font-black text-white mb-3">
              {title}
            </h2>

            <p className="text-white/60 font-body text-sm leading-relaxed mb-8 px-2">
              {message}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-2xl ${style.bg} ${style.hover} ${style.text} font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${style.buttonShadow} disabled:opacity-70 hover:cursor-pointer disabled:cursor-not-allowed`}
              >
                {isProcessing ? (
                  <>
                    <Cliploader
                      size={20}
                      color={actionType === "primary" ? "black" : "white"}
                    />
                    <span>Processing...</span>
                  </>
                ) : (
                  confirmText
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl border border-white/10 text-white/70 font-semibold hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
