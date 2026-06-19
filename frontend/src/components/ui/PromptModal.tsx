import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface PromptModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export default function PromptModal({
  isOpen,
  title,
  message,
  initialValue = "",
  confirmText = "Save",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: PromptModalProps) {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // Focus the input slightly after opening so animation doesn't interfere
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, initialValue]);

  const handleConfirm = () => {
    onConfirm(inputValue);
  };

  if (!isOpen && typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors hover:rotate-90 duration-300 hover:cursor-pointer"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-6 text-[var(--color-primary)] shadow-lg">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>

            <h2 className="font-heading text-2xl font-black text-white mb-3">
              {title}
            </h2>

            <p className="text-white/60 font-body text-sm leading-relaxed mb-6 px-2">
              {message}
            </p>

            <input
              ref={inputRef}
              id="prompt-modal-input"
              name="prompt-modal-input"
              autoComplete="off"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Title..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
              }}
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg)] font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:cursor-pointer"
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl border border-white/10 text-white/70 font-semibold hover:bg-white/5 hover:text-white transition-colors hover:cursor-pointer"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
